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

  // Arquivo de metadados (nomes das capturas)
  const METADATA_FILE = `${FileSystem.documentDirectory}captures/metadata.json`;

  // Carregar metadados (nomes)
  const loadMetadata = async () => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(METADATA_FILE);
      if (fileInfo.exists) {
        const content = await FileSystem.readAsStringAsync(METADATA_FILE);
        return JSON.parse(content);
      }
      return {};
    } catch (error) {
      console.error('Erro ao carregar metadados:', error);
      return {};
    }
  };

  // Salvar metadados (nomes)
  const saveMetadata = async (metadata) => {
    try {
      await FileSystem.writeAsStringAsync(
        METADATA_FILE,
        JSON.stringify(metadata, null, 2)
      );
      console.log('Metadados salvos com sucesso');
    } catch (error) {
      console.error('Erro ao salvar metadados:', error);
    }
  };

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

      // Carregar metadados (nomes)
      const metadata = await loadMetadata();
      console.log('Metadados carregados:', metadata);

      const files = await FileSystem.readDirectoryAsync(capturesDir);
      console.log(`Encontrados ${files.length} arquivos`);

      const savedCaptures = [];
      for (const file of files) {
        if (file.endsWith('.jpg')) {
          const fileUri = `${capturesDir}${file}`;
          const fileInfo = await FileSystem.getInfoAsync(fileUri);
          
          const timestampMatch = file.match(/capture_(\d+)\.jpg/);
          const timestamp = timestampMatch ? parseInt(timestampMatch[1]) : fileInfo.modificationTime * 1000;
          const captureId = timestamp.toString();
          
          savedCaptures.push({
            id: captureId,
            uri: fileUri,
            timestamp: timestamp,
            name: metadata[captureId] || `Captura ${new Date(timestamp).toLocaleDateString('pt-BR')}`, // Nome dos metadados ou padrão
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

  const handleNewCapture = async (captureData) => {
    try {
      // Adicionar captura ao estado
      setCaptures(prev => [captureData, ...prev]);
      
      // Se a captura tem nome, salvar nos metadados
      if (captureData.name && captureData.id) {
        const metadata = await loadMetadata();
        metadata[captureData.id] = captureData.name;
        await saveMetadata(metadata);
        console.log(`Metadados salvos para captura ${captureData.id}: ${captureData.name}`);
      }
    } catch (error) {
      console.error('Erro ao salvar captura:', error);
      // Ainda adiciona ao estado mesmo se falhar ao salvar metadados
      setCaptures(prev => [captureData, ...prev]);
    }
  };

  const handleDeleteCapture = async (captureId) => {
    try {
      // Remover do estado
      setCaptures(prev => prev.filter(c => c.id !== captureId));
      
      // Remover dos metadados
      const metadata = await loadMetadata();
      delete metadata[captureId];
      await saveMetadata(metadata);
      
      console.log(`Captura ${captureId} removida dos metadados`);
    } catch (error) {
      console.error('Erro ao deletar captura:', error);
      // Ainda remove do estado mesmo se falhar ao limpar metadados
      setCaptures(prev => prev.filter(c => c.id !== captureId));
    }
  };

  const handleEditCaptureName = async (captureId, newName) => {
    try {
      // Atualizar estado
      setCaptures(prev =>
        prev.map(capture =>
          capture.id === captureId
            ? { ...capture, name: newName }
            : capture
        )
      );

      // Carregar metadados atuais
      const metadata = await loadMetadata();
      
      // Atualizar metadados
      metadata[captureId] = newName;
      
      // Salvar metadados
      await saveMetadata(metadata);
      
      console.log(`Nome da captura ${captureId} atualizado para: ${newName}`);
    } catch (error) {
      console.error('Erro ao editar nome:', error);
      Alert.alert('Erro', 'Não foi possível salvar o novo nome');
    }
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
            onDeleteCapture={handleDeleteCapture}
            onEditCaptureName={handleEditCaptureName}
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