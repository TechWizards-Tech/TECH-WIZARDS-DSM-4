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
  ImageBackground,
  StatusBar,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LogBox } from 'react-native';
import { colors, shadows, radius } from '../theme/colors';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

LogBox.ignoreLogs([
  'Video component from `expo-av` is deprecated',
]);

const { width, height } = Dimensions.get('window');

export default function VideoPlayer({ onGallery, onNewCapture, hasMediaLibraryPermission = false }) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const flashAnim = useRef(new Animated.Value(0)).current;
  const isMobile = Platform.OS === 'android' || Platform.OS === 'ios';
  const insets = useSafeAreaInsets();

  // URL do servidor
  const SERVER_IP = '10.42.171.51';
  const VIDEO_FEED_URL = `http://${SERVER_IP}:5000/video`;
  const SNAPSHOT_URL = `http://${SERVER_IP}:5000/snapshot`;

  useEffect(() => {
    checkServerConnection();
    
    const interval = setInterval(() => {
      checkServerConnection();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const checkServerConnection = async () => {
    try {
      const response = await fetch(`http://${SERVER_IP}:5000/`, { 
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

      const capturesDir = `${FileSystem.documentDirectory}captures/`;
      const dirInfo = await FileSystem.getInfoAsync(capturesDir);
      
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(capturesDir, { intermediates: true });
      }

      const timestamp = Date.now();
      const filename = `capture_${timestamp}.jpg`;
      const fileUri = `${capturesDir}${filename}`;

      const downloadResult = await FileSystem.downloadAsync(SNAPSHOT_URL, fileUri);
      console.log('Imagem baixada:', downloadResult.uri);

      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      console.log('Tamanho do arquivo:', fileInfo.size, 'bytes');

      if (fileInfo.size < 1000) {
        throw new Error('Imagem capturada está muito pequena. Verifique o servidor.');
      }

      let asset = null;
      if (hasMediaLibraryPermission) {
        try {
          asset = await MediaLibrary.createAssetAsync(fileUri);
          
          const album = await MediaLibrary.getAlbumAsync('MicroWizards');
          if (album == null) {
            await MediaLibrary.createAlbumAsync('MicroWizards', asset, false);
          } else {
            await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
          }
          
          console.log('Imagem salva permanentemente na galeria:', asset.uri);
        } catch (mediaError) {
          console.error('Erro ao salvar na galeria:', mediaError);
        }
      }

      if (onNewCapture) {
        onNewCapture({
          id: timestamp.toString(),
          uri: fileUri,
          galleryUri: asset ? asset.uri : null,
          timestamp,
          inGallery: hasMediaLibraryPermission && asset !== null,
        });
      }

      Alert.alert(
        '✓ Captura salva!', 
        hasMediaLibraryPermission 
          ? 'Frame salvo na galeria do dispositivo' 
          : 'Frame capturado (galeria não autorizada)'
      );
      
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

  const renderVideoContent = (isFullscreenView = false) => {
    const containerStyle = isFullscreenView ? styles.fullscreenVideoContainer : styles.videoContainer;
    
    return (
      <View style={containerStyle}>
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
              <View style={styles.liveBadge} pointerEvents="none">
                <View style={styles.liveIndicator} />
                <Text style={styles.liveText}>AO VIVO</Text>
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
            <ActivityIndicator size="large" color={colors.light.primary} />
            <Ionicons name="videocam-off" size={48} color={colors.light.mutedForeground} style={styles.placeholderIcon} />
            <Text style={styles.placeholderText}>
              {connectionError ? 'Microscópio Offline' : 'Conectando ao microscópio...'}
            </Text>
            <Text style={styles.placeholderSubtext}>
              {SERVER_IP}:5000
            </Text>
            {connectionError && (
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={() => {
                  setConnectionError(false);
                  checkServerConnection();
                }}
              >
                <Ionicons name="refresh" size={16} color="white" />
                <Text style={styles.retryButtonText}>Tentar Novamente</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        
        {/* Botão de Fullscreen - Mais Visível */}
        {!isFullscreenView && isConnected && (
          <TouchableOpacity 
            style={styles.fullscreenButton}
            onPress={() => setIsFullscreen(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="expand" size={20} color="white" />
            <Text style={styles.fullscreenButtonText}>Tela Cheia</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <ImageBackground 
      source={require('../assets/background.png')}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <StatusBar barStyle="dark-content" backgroundColor={colors.light.background} translucent={false} />
      
      <Animated.View 
        style={[styles.flash, { opacity: flashAnim }]} 
        pointerEvents="none"
      />

      <View style={styles.container}>
        <View style={styles.header}>
          <Image 
            source={require('../assets/logo_long.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.videoWrapper}>
          {renderVideoContent(false)}
        </View>

        <View style={[
          styles.bottomNav,
          { paddingBottom: Math.max(insets.bottom, 12) }
        ]}>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={captureFrame}
            disabled={isCapturing || !isConnected}
            activeOpacity={0.7}
          >
            <View style={[
              styles.captureButtonWrapper,
              (isCapturing || !isConnected) && styles.captureButtonDisabled
            ]}>
              <Ionicons 
                name="camera" 
                size={28} 
                color={isCapturing || !isConnected ? colors.light.mutedForeground : colors.light.primaryForeground} 
              />
            </View>
            <Text style={[
              styles.navLabel,
              (isCapturing || !isConnected) && styles.navLabelDisabled
            ]}>
              Capturar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.navButton}
            onPress={onGallery}
            activeOpacity={0.7}
          >
            <Ionicons name="images" size={28} color={colors.light.foreground} />
            <Text style={styles.navLabel}>Galeria</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => setShowAbout(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="information-circle" size={28} color={colors.light.foreground} />
            <Text style={styles.navLabel}>Sobre</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal de Fullscreen */}
      <Modal
        visible={isFullscreen}
        transparent={false}
        animationType="fade"
        onRequestClose={() => setIsFullscreen(false)}
      >
        <View style={styles.fullscreenContainer}>
          <StatusBar hidden />
          
          {renderVideoContent(true)}
          
          <TouchableOpacity 
            style={styles.fullscreenCloseButton}
            onPress={() => setIsFullscreen(false)}
            activeOpacity={0.8}
          >
            <Ionicons name="contract" size={28} color="white" />
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Modal Sobre o Projeto */}
      <Modal
        visible={showAbout}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAbout(false)}
      >
        <View style={styles.aboutModalOverlay}>
          <View style={styles.aboutModalContent}>
            <View style={styles.aboutHeader}>
              <Ionicons name="information-circle" size={48} color={colors.light.primary} />
              <Text style={styles.aboutTitle}>Sobre o Projeto</Text>
            </View>

            <View style={styles.aboutBody}>
              <Text style={styles.aboutText}>
                Sistema desenvolvido pela equipe <Text style={styles.aboutBold}>Tech Wizards</Text> (FATEC Jacareí) para transmitir, em tempo real, imagens de microscópio para web e mobile.
              </Text>
              
              <Text style={styles.aboutText}>
                A câmera acoplada ao microscópio envia o vídeo para um servidor, permitindo que vários alunos visualizem a mesma amostra simultaneamente e capturem imagens com facilidade.
              </Text>

              <View style={styles.aboutFooter}>
                <Ionicons name="school" size={20} color={colors.light.mutedForeground} />
                <Text style={styles.aboutFooterText}>FATEC Jacareí</Text>
              </View>

              <View style={styles.aboutFooter}>
                <Ionicons name="people" size={20} color={colors.light.mutedForeground} />
                <Text style={styles.aboutFooterText}>Tech Wizards</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.aboutCloseButton}
              onPress={() => setShowAbout(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.aboutCloseButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

// Player MAIOR - usa mais espaço da tela
const videoWidth = Math.min(width * 0.95, 600);
const maxHeight = height - 300;
const calculatedHeight = (videoWidth * 3) / 4;
const videoHeight = Math.min(calculatedHeight, maxHeight);

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  backgroundImage: {
    opacity: 0.15,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
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
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 16,
    alignItems: 'center',
  },
  logo: {
    height: 120,
    width: 360,
  },
  videoWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 100,
  },
  videoContainer: {
    width: videoWidth,
    height: videoHeight,
    backgroundColor: '#000',
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadows.light.xl,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.light.muted,
    padding: 30,
    gap: 12,
  },
  placeholderIcon: {
    marginTop: 8,
  },
  placeholderText: {
    color: colors.light.foreground,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  placeholderSubtext: {
    color: colors.light.mutedForeground,
    fontSize: 13,
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  retryButton: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.light.primary,
    borderRadius: 24,
    ...shadows.light.md,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  liveBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#f44336',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    ...shadows.light.md,
  },
  liveIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  liveText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  fullscreenButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.light.primary,
    borderRadius: 24,
    ...shadows.light.lg,
  },
  fullscreenButtonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingTop: 12,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(226, 232, 240, 0.6)',
    ...shadows.light.md,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: radius.md,
  },
  captureButtonWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    ...shadows.light.md,
  },
  captureButtonDisabled: {
    backgroundColor: colors.light.muted,
  },
  navLabel: {
    color: colors.light.foreground,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
    letterSpacing: 0.3,
  },
  navLabelDisabled: {
    color: colors.light.mutedForeground,
  },
  
  // Fullscreen styles
  fullscreenContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenVideoContainer: {
    width: width,
    height: height,
    backgroundColor: '#000',
  },
  fullscreenCloseButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.light.lg,
  },
  
  // About Modal styles
  aboutModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  aboutModalContent: {
    backgroundColor: colors.light.background,
    borderRadius: radius.xl,
    padding: 24,
    width: '100%',
    maxWidth: 500,
    ...shadows.light.xl,
  },
  aboutHeader: {
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  aboutTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.light.foreground,
    letterSpacing: 0.3,
  },
  aboutBody: {
    gap: 16,
    marginBottom: 24,
  },
  aboutText: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.light.foreground,
    textAlign: 'justify',
  },
  aboutBold: {
    fontWeight: '700',
    color: colors.light.primary,
  },
  aboutFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  aboutFooterText: {
    fontSize: 14,
    color: colors.light.mutedForeground,
    fontWeight: '600',
  },
  aboutCloseButton: {
    backgroundColor: colors.light.primary,
    paddingVertical: 14,
    borderRadius: radius.lg,
    alignItems: 'center',
    ...shadows.light.md,
  },
  aboutCloseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});