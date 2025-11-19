import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import SplashScreen from './screens/SplashScreen';
import VideoPlayer from './components/VideoPlayer';
import GalleryScreen from './screens/GalleryScreen';
import { colors } from './theme/colors';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system/legacy';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [captures, setCaptures] = useState([]);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(false);
  const [isLoadingCaptures, setIsLoadingCaptures] = useState(true);

  // Solicitar permissão UMA VEZ ao iniciar o app
  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setHasMediaLibraryPermission(status === 'granted');
      
      if (status !== 'granted') {
        Alert.alert(
          'Permissão de Galeria',
          'Para salvar capturas permanentemente na galeria do seu dispositivo, é necessário conceder permissão.\n\nVocê pode alterar isso depois em Configurações.',
          [{ text: 'OK' }]
        );
      }
    })();
  }, []);

  // Carregar capturas salvas ao iniciar o app
  useEffect(() => {
    loadSavedCaptures();
  }, []);

  const loadSavedCaptures = async () => {
    try {
      console.log('Carregando capturas salvas...');
      const capturesDir = `${FileSystem.documentDirectory}captures/`;
      
      const dirInfo = await FileSystem.getInfoAsync(capturesDir);
      
      if (!dirInfo.exists) {
        console.log('Diretório de capturas não existe ainda');
        setIsLoadingCaptures(false);
        return;
      }

      const files = await FileSystem.readDirectoryAsync(capturesDir);
      console.log(`Encontrados ${files.length} arquivos`);

      const savedCaptures = [];
      for (const file of files) {
        if (file.endsWith('.jpg')) {
          const fileUri = `${capturesDir}${file}`;
          const fileInfo = await FileSystem.getInfoAsync(fileUri);
          
          const timestampMatch = file.match(/capture_(\d+)\.jpg/);
          const timestamp = timestampMatch ? parseInt(timestampMatch[1]) : fileInfo.modificationTime * 1000;
          
          savedCaptures.push({
            id: timestamp.toString(),
            uri: fileUri,
            timestamp: timestamp,
            inGallery: true,
          });
        }
      }

      savedCaptures.sort((a, b) => b.timestamp - a.timestamp);
      
      console.log(`Carregadas ${savedCaptures.length} capturas`);
      setCaptures(savedCaptures);
      
    } catch (error) {
      console.error('Erro ao carregar capturas:', error);
    } finally {
      setIsLoadingCaptures(false);
    }
  };

  const handleNewCapture = (captureData) => {
    setCaptures(prev => [captureData, ...prev]);
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {currentScreen === 'splash' && (
          <SplashScreen onFinish={() => setCurrentScreen('video')} />
        )}
        
        {currentScreen === 'video' && (
          <VideoPlayer 
            onGallery={() => setCurrentScreen('gallery')}
            onNewCapture={handleNewCapture}
            hasMediaLibraryPermission={hasMediaLibraryPermission}
          />
        )}

        {currentScreen === 'gallery' && (
          <GalleryScreen 
            onVideo={() => setCurrentScreen('video')}
            captures={captures}
            isLoading={isLoadingCaptures}
          />
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
});