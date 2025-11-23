import React, { useRef, useState, useEffect } from 'react';
import { 
  View, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  Alert, 
  Animated, 
  Image, 
  Text,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LogBox } from 'react-native';
import { colors, shadows, radius } from '../theme/colors';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system/legacy';

LogBox.ignoreLogs([
  'Video component from `expo-av` is deprecated',
]);

const { width } = Dimensions.get('window');

export default function VideoPlayer({ onGallery, onNewCapture }) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const flashAnim = useRef(new Animated.Value(0)).current;
  const isMobile = Platform.OS === 'android' || Platform.OS === 'ios';

  // URL do servidor
  const SERVER_IP = '10.42.171.51';
  const VIDEO_FEED_URL = `http://${SERVER_IP}:5000/video`;
  const SNAPSHOT_URL = `http://${SERVER_IP}:5000/snapshot`;

  // Verifica conexão com o servidor
  useEffect(() => {
    checkServerConnection();
    
    const interval = setInterval(() => {
      checkServerConnection();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const checkServerConnection = async () => {
    try {
      await fetch(`http://${SERVER_IP}:5000/`, { 
        method: 'GET',
        timeout: 3000 
      });
      setIsConnected(true);
      setConnectionError(false);
      setImageError(false);
    } catch (error) {
      console.log('Servidor offline:', error);
      setIsConnected(false);
      setConnectionError(true);
    }
  };

  const captureFrame = async () => {
    if (isCapturing || !isConnected) return;
    setIsCapturing(true);

    try {
      // Efeito de flash
      Animated.sequence([
        Animated.timing(flashAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(flashAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      console.log('Capturando frame do servidor...');

      // Criar diretório de capturas se não existir
      const capturesDir = `${FileSystem.documentDirectory}captures/`;
      const dirInfo = await FileSystem.getInfoAsync(capturesDir);
      
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(capturesDir, { intermediates: true });
      }

      // Baixar a imagem do servidor
      const timestamp = Date.now();
      const filename = `capture_${timestamp}.jpg`;
      const fileUri = `${capturesDir}${filename}`;

      const downloadResult = await FileSystem.downloadAsync(SNAPSHOT_URL, fileUri);
      
      console.log('Imagem baixada:', downloadResult.uri);

      // Verificar tamanho do arquivo
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      console.log('Tamanho do arquivo:', fileInfo.size, 'bytes');

      if (fileInfo.size < 1000) {
        throw new Error('Imagem capturada está muito pequena. Verifique o servidor.');
      }

      // Adicionar à galeria
      if (onNewCapture) {
        onNewCapture({
          id: timestamp.toString(),
          uri: fileUri,
          timestamp,
        });
      }

      Alert.alert('✓ Captura salva!', 'Frame capturado do servidor');
      
    } catch (error) {
      console.error('Erro ao capturar frame:', error);
      Alert.alert(
        'Erro ao capturar', 
        'Não foi possível capturar: ' + error.message
      );
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Efeito de flash na captura */}
      <Animated.View 
        style={[
          styles.flash,
          { opacity: flashAnim }
        ]} 
        pointerEvents="none"
      />

      {/* Logo */}
      <View style={styles.logoWrapper}>
        <Image 
          source={require('../assets/logo_long.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Indicador de Conexão */}
      <View style={[
        styles.connectionIndicator, 
        { backgroundColor: isConnected ? '#4CAF50' : '#f44336' }
      ]}>
        <Ionicons 
          name={isConnected ? "wifi" : "wifi-outline"} 
          size={16} 
          color="white" 
        />
        <Text style={styles.connectionText}>
          {isConnected ? 'Conectado' : 'Offline'}
        </Text>
      </View>

      {/* Botão Galeria */}
      <TouchableOpacity 
        style={styles.galleryButton}
        onPress={onGallery}
        activeOpacity={0.7}
      >
        <Ionicons name="images" size={28} color={colors.light.foreground} />
      </TouchableOpacity>

      {/* Área do Vídeo */}
      <View style={styles.videoWrapper}>
        <View style={styles.videoContainer}>
          {isConnected ? (
            isMobile ? (
              <>
                <WebView
                  originWhitelist={["*"]}
                  source={{ 
                    html: `
                      <!DOCTYPE html>
                      <html>
                      <head>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                        <style>
                          body, html { margin: 0; padding: 0; width: 100%; height: 100%; background: black; overflow: hidden; }
                          img { width: 100%; height: 100%; object-fit: contain; }
                        </style>
                      </head>
                      <body>
                        <img src="${VIDEO_FEED_URL}" onerror="console.error('Erro ao carregar imagem')" />
                      </body>
                      </html>
                    `
                  }}
                  style={styles.video}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  startInLoadingState={true}
                  mixedContentMode="always"
                  allowsInlineMediaPlayback={true}
                  mediaPlaybackRequiresUserAction={false}
                  onLoadStart={() => console.log('WebView: Iniciando carregamento')}
                  onLoadEnd={() => console.log('WebView: Carregamento finalizado')}
                  onError={(syntheticEvent) => {
                    const { nativeEvent } = syntheticEvent;
                    console.error('Erro no WebView:', nativeEvent);
                    setConnectionError(true);
                  }}
                />
                <View style={styles.fallbackBadge} pointerEvents="none">
                  <Text style={styles.fallbackBadgeText}>AO VIVO</Text>
                </View>
              </>
            ) : (
              !imageError ? (
                <Image
                  source={{ uri: VIDEO_FEED_URL }}
                  style={styles.video}
                  resizeMode="contain"
                  onLoadStart={() => console.log('Carregando vídeo...')}
                  onLoad={() => console.log('Vídeo carregado!')}
                  onError={(error) => {
                    console.error('Erro no vídeo (Image):', error.nativeEvent?.error || error);
                    setImageError(true);
                  }}
                />
              ) : (
                <WebView
                  originWhitelist={["*"]}
                  source={{ 
                    html: `
                      <!DOCTYPE html>
                      <html>
                      <head>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                        <style>
                          body, html { margin: 0; padding: 0; width: 100%; height: 100%; background: black; overflow: hidden; }
                          img { width: 100%; height: 100%; object-fit: contain; }
                        </style>
                      </head>
                      <body>
                        <img src="${VIDEO_FEED_URL}" onerror="console.error('Erro ao carregar imagem')" />
                      </body>
                      </html>
                    `
                  }}
                  style={styles.video}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  startInLoadingState={true}
                  mixedContentMode="always"
                  allowsInlineMediaPlayback={true}
                  mediaPlaybackRequiresUserAction={false}
                />
              )
            )
          ) : (
            <View style={styles.placeholder}>
              <Ionicons name="videocam-off" size={50} color="#666" />
              <Text style={styles.placeholderText}>
                {connectionError ? 'Erro de conexão com o servidor' : 'Conectando...'}
              </Text>
              <Text style={styles.placeholderSubtext}>
                Verifique se o servidor está rodando em {SERVER_IP}:5000
              </Text>
            </View>
          )}
        </View>
        
        {/* Container para os botões */}
        <View style={styles.buttonsContainer}>
          {/* Botão de Captura */}
          <TouchableOpacity 
            style={[
              styles.captureButton, 
              (isCapturing || !isConnected) && styles.captureButtonDisabled
            ]}
            onPress={captureFrame}
            disabled={isCapturing || !isConnected}
            activeOpacity={0.7}
          >
            <View style={styles.captureButtonInner}>
              <Ionicons 
                name="camera" 
                size={32} 
                color={colors.light.primaryForeground} 
              />
            </View>
          </TouchableOpacity>

          {/* Botão de Refresh */}
          <TouchableOpacity 
            style={[
              styles.refreshButton, 
              !isConnected && styles.captureButtonDisabled
            ]}
            onPress={() => {
              setIsConnected(false);
              setImageError(false);
              checkServerConnection();
            }}
            disabled={!isConnected}
            activeOpacity={0.7}
          >
            <View style={styles.refreshButtonInner}>
              <Ionicons 
                name="refresh" 
                size={32} 
                color={colors.light.primaryForeground} 
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const videoWidth = Math.min(width * 0.9, 400);
const videoHeight = videoWidth * (9 / 16);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    gap: 20,
  },
  flash: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    zIndex: 999,
  },
  logoWrapper: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  logo: {
    height: 120,
    width: 400,
  },
  connectionIndicator: {
    position: 'absolute',
    top: 40,
    left: 10,
    zIndex: 11,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.lg * 2,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.light.sm,
  },
  connectionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  galleryButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 11,
    padding: 10,
    backgroundColor: colors.light.card,
    borderRadius: radius.lg * 2.5,
    ...shadows.light.sm,
  },
  videoWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  videoContainer: {
    width: videoWidth,
    height: videoHeight,
    backgroundColor: '#000',
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadows.light.lg,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  placeholderText: {
    color: '#333',
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  placeholderSubtext: {
    color: '#666',
    marginTop: 8,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.light.lg,
  },
  captureButtonDisabled: {
    backgroundColor: colors.light.muted,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.light.lg,
  },
  refreshButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    zIndex: 20,
  },
  fallbackBadgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
});