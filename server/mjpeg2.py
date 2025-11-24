from flask import Flask, Response, request
from picamera2 import Picamera2
import cv2
import time
import signal
import sys
import logging
from threading import Event, Thread, Lock, Condition

# Sistema de logging do Python
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
shutdown_event = Event()

# Configuração CORS
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    return response

# Inicialização da câmera com tratamento de erro
try:
    picam2 = Picamera2()
    picam2.configure(picam2.create_preview_configuration(
        main={"format": "RGB888", "size": (640, 480)}
    ))
    picam2.start()
    logger.info("Camera iniciada com sucesso")
except Exception as e:
    logger.error(f"Erro ao inicializar camera: {e}")
    sys.exit(1)

def cleanup():
    # ***************************************
    # * Parar o produtor e a câmera, sinalizando shutdown.
    # *
    # * Chamado em encerramento (sinais ou exceções) para garantir que
    # * a câmera e o thread de captura sejam corretamente finalizados.
    # ***************************************
    logger.info("Realizando cleanup...")
    try:
        # stop producer first (if present)
        if 'producer' in globals():
            try:
                producer.stop()
            except Exception:
                logger.exception("Erro ao parar producer")
        if picam2:
            picam2.stop()
            picam2.close()
    finally:
        shutdown_event.set()

def signal_handler(signum, frame):
    # ***************************************
    # * Handler para sinais do sistema (SIGTERM/SIGINT).
    # * Registra o sinal recebido, executa cleanup e finaliza o processo.
    # ***************************************
    logger.info(f"Sinal recebido: {signum}")
    cleanup()
    sys.exit(0)

signal.signal(signal.SIGTERM, signal_handler)
signal.signal(signal.SIGINT, signal_handler)


class FrameProducer:
    # ***************************************
    # * Thread em background que captura da câmera uma vez e fornece o
    # * último JPEG codificado para qualquer número de clientes. Isso evita múltiplas
    # * chamadas concorrentes ao dispositivo da câmera que causam congelamentos.
    # ***************************************
    
    def __init__(self, cam, quality=80, fps=20):
        self.cam = cam
        self.quality = quality
        self.interval = 1.0 / max(1, fps)
        self._lock = Lock()
        self._cond = Condition(self._lock)
        self._frame = None
        self._running = False
        self._thread = None

    def start(self):
        # ***************************************
        # * Inicia o thread de captura em background.
        # * Se já estiver em execução, não faz nada.
        # ***************************************
        if self._running:
            return
        self._running = True
        self._thread = Thread(target=self._run, daemon=True)
        self._thread.start()

    def stop(self):
        # ***************************************
        # * Solicita parada do thread e aguarda sua finalização (rápida).
        # ***************************************
        self._running = False
        if self._thread:
            self._thread.join(timeout=1)

    def _run(self):
        # ***************************************
        # * Loop principal que captura frames, codifica em JPEG e notifica clientes.
        # * Executado em background; atualiza `self._frame` com o último JPEG.
        # ***************************************
        while self._running and not shutdown_event.is_set():
            try:
                frame = self.cam.capture_array()
                frame = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)
                _, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, self.quality])
                jpg = buffer.tobytes()
                with self._cond:
                    self._frame = jpg
                    # notify waiting clients that a new frame is available
                    self._cond.notify_all()
                time.sleep(self.interval)
            except Exception as e:
                logger.error(f"Erro no FrameProducer: {e}")
                time.sleep(0.5)

    def get_frame(self, wait=True, timeout=2.0):
        # ***************************************
        # * Retorna o último frame JPEG disponível.
        # * Se `wait` for True, aguarda até `timeout` segundos por um frame.
        # * Retorna `None` se nenhum frame estiver disponível no tempo esperado.
        # ***************************************
        with self._cond:
            if self._frame is None and wait:
                self._cond.wait(timeout=timeout)
            return self._frame


producer = FrameProducer(picam2, quality=80, fps=20)
producer.start()


# ***************************************
# * Endpoint para streaming de vídeo MJPEG.
# ***************************************
@app.route('/video')
def video_feed():
    try:
        def generator():
            boundary = b'--frame\r\n'
            while not shutdown_event.is_set():
                frame = producer.get_frame()
                if frame is None:
                    # no frame yet, wait a bit
                    time.sleep(0.05)
                    continue
                try:
                    yield (boundary + b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
                except GeneratorExit:
                    break
                except Exception as e:
                    logger.error(f"Erro ao enviar frame ao cliente: {e}")
                    break
                time.sleep(0.01)

        return Response(generator(), mimetype='multipart/x-mixed-replace; boundary=frame')
    except Exception as e:
        logger.error(f"Erro no video_feed: {e}")
        return str(e), 500


# ***************************************
# * Endpoint para captura de snapshot JPEG.
# ***************************************
@app.route('/snapshot')
def snapshot():
    try:
        quality = request.args.get('quality', default=90, type=int)
        if quality < 1 or quality > 100:
            quality = 90
            
        frame = picam2.capture_array()
        frame = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)
        _, buffer = cv2.imencode(".jpg", frame, [cv2.IMWRITE_JPEG_QUALITY, quality])
        return Response(buffer.tobytes(), mimetype='image/jpeg')
    except Exception as e:
        logger.error(f"Erro no snapshot: {e}")
        return str(e), 500

@app.route('/status')
def status():
    try:
        return {
            "status": "online",
            "camera": "active" if picam2 else "inactive",
            "resolution": "640x480",
            "format": "MJPEG"
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}, 500

# ***************************************
# * Endpoint raiz
# ***************************************
@app.route('/')
def index():
    return "Servidor de camera ativo!"

if __name__ == "__main__":
    try:
        logger.info("Iniciando servidor...")
        app.run(host="0.0.0.0", port=5000, threaded=True)
    except KeyboardInterrupt:
        logger.info("Shutdown solicitado via keyboard")
        cleanup()
    except Exception as e:
        logger.error(f"Erro fatal: {e}")
        cleanup()