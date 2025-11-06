import React, { useRef, useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, Alert, Animated, Image, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VideoView, useVideoPlayer } from 'expo-video';
import { captureRef } from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system/legacy';
import { colors, shadows, radius } from '../theme/colors';

const { width } = Dimensions.get('window');

export default function VideoPlayer({ onGallery }) {
  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const flashAnim = useRef(new Animated.Value(0)).current;
  const controlsTimeout = useRef(null);

  const player = useVideoPlayer(require('../assets/video/sample.mp4'), player => {
    player.loop = true;
    player.play();
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (player) {
        setCurrentTime(player.currentTime);
        setDuration(player.duration);
      }
    }, 100);

    resetControlsTimeout();

    return () => {
      clearInterval(interval);
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }
    };
  }, [player]);

  const resetControlsTimeout = () => {
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current);
    }
    setShowControls(true);
    controlsTimeout.current = setTimeout(() => {
      if (player?.playing) {
        setShowControls(false);
      }
    }, 3000);
  };

  const handleVideoPress = () => {
    resetControlsTimeout();
  };

  const togglePlayPause = () => {
    if (player.playing) {
      player.pause();
    } else {
      player.play();
    }
    resetControlsTimeout();
  };

  const toggleMute = () => {
    player.muted = !player.muted;
    resetControlsTimeout();
  };

  const skipForward = () => {
    player.currentTime = Math.min(currentTime + 10, duration);
    resetControlsTimeout();
  };

  const skipBackward = () => {
    player.currentTime = Math.max(currentTime - 10, 0);
    resetControlsTimeout();
  };

  const captureFrame = async () => {
    if (isCapturing || !videoContainerRef.current) return;
    
    setIsCapturing(true);
    
    try {
      // Pausar o vídeo
      const wasPlaying = player.playing;
      player.pause();

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

      // Aguardar o flash
      await new Promise(resolve => setTimeout(resolve, 200));

      // Capturar screenshot do container do vídeo
      const uri = await captureRef(videoContainerRef, {
        format: 'jpg',
        quality: 1,
      });

      // Criar diretório de capturas se não existir
      const capturesDir = `${FileSystem.documentDirectory}captures/`;
      const dirInfo = await FileSystem.getInfoAsync(capturesDir);
      
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(capturesDir, { intermediates: true });
      }

      // Salvar a imagem
      const timestamp = Date.now();
      const filename = `capture_${timestamp}.jpg`;
      const newUri = `${capturesDir}${filename}`;
      
      await FileSystem.copyAsync({
        from: uri,
        to: newUri,
      });

      console.log('Imagem salva em:', newUri);
      Alert.alert('✓ Captura salva!', 'A imagem foi salva com sucesso');

      // Retomar o vídeo
      if (wasPlaying) {
        player.play();
      }
      
    } catch (error) {
      console.error('Erro ao capturar frame:', error);
      Alert.alert('Erro', 'Não foi possível capturar: ' + error.message);
    } finally {
      setIsCapturing(false);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.flash,
          {
            opacity: flashAnim,
          }
        ]} 
        pointerEvents="none"
      />

      <View style={styles.logoWrapper}>
        <Image 
          source={require('../assets/logo_long.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <TouchableOpacity 
        style={styles.galleryButton}
        onPress={onGallery}
        activeOpacity={0.7}
      >
        <Ionicons name="images" size={28} color={colors.light.foreground} />
      </TouchableOpacity>

      <View style={styles.videoWrapper}>
        <TouchableOpacity 
          style={styles.videoContainer}
          activeOpacity={1}
          onPress={handleVideoPress}
        >
          <View 
            ref={videoContainerRef}
            style={styles.videoViewWrapper}
            collapsable={false}
          >
            <VideoView
              ref={videoRef}
              style={styles.video}
              player={player}
              allowsFullscreen={false}
              allowsPictureInPicture={false}
              nativeControls={false}
              contentFit="contain"
            />
          </View>

          {showControls && (
            <Animated.View style={styles.controlsOverlay}>
              <View style={styles.topControls}>
                <TouchableOpacity 
                  style={styles.controlButton}
                  onPress={toggleMute}
                  activeOpacity={0.7}
                >
                  <Ionicons 
                    name={player?.muted ? "volume-mute" : "volume-high"} 
                    size={24} 
                    color="#fff" 
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.centerControls}>
                <TouchableOpacity 
                  style={styles.skipButton}
                  onPress={skipBackward}
                  activeOpacity={0.7}
                >
                  <Ionicons name="play-back" size={36} color="#fff" />
                  <Text style={styles.skipText}>10</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.playButton}
                  onPress={togglePlayPause}
                  activeOpacity={0.7}
                >
                  <Ionicons 
                    name={player?.playing ? "pause" : "play"} 
                    size={48} 
                    color="#fff" 
                  />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.skipButton}
                  onPress={skipForward}
                  activeOpacity={0.7}
                >
                  <Ionicons name="play-forward" size={36} color="#fff" />
                  <Text style={styles.skipText}>10</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.bottomControls}>
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { width: `${progressPercentage}%` }
                      ]} 
                    />
                  </View>
                  <View style={styles.timeContainer}>
                    <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
                    <Text style={styles.timeText}>{formatTime(duration)}</Text>
                  </View>
                </View>
              </View>
            </Animated.View>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.captureButton, isCapturing && styles.captureButtonDisabled]}
          onPress={captureFrame}
          disabled={isCapturing}
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
      </View>
    </View>
  );
}

const videoWidth = Math.min(width * 0.9, 400);
const videoHeight = videoWidth * (9/16);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  flash: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.light.card,
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
  videoViewWrapper: {
    width: '100%',
    height: '100%',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  controlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'space-between',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 15,
  },
  centerControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30,
  },
  bottomControls: {
    padding: 15,
  },
  controlButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(59, 130, 246, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  skipText: {
    position: 'absolute',
    bottom: 2,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  progressContainer: {
    width: '100%',
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.light.primary,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  captureButton: {
    marginTop: 30,
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
});