import React, { useState } from 'react';
import { 
  View, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  FlatList,
  Dimensions,
  Modal,
  Alert,
  Text
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import { colors, shadows, radius } from '../theme/colors';

const { width, height } = Dimensions.get('window');
const imageSize = (width - 60) / 3;

// Imagens de exemplo dos assets
const assetCaptures = [
  { id: 'asset1', source: require('../assets/video/scrsht1.jpg'), isAsset: true },
  { id: 'asset2', source: require('../assets/video/scrsht2.jpg'), isAsset: true },
  { id: 'asset3', source: require('../assets/video/scrsht3.jpg'), isAsset: true },
  { id: 'asset4', source: require('../assets/video/scrsht4.jpg'), isAsset: true },
  { id: 'asset5', source: require('../assets/video/scrsht5.jpg'), isAsset: true },
  { id: 'asset6', source: require('../assets/video/scrsht6.jpg'), isAsset: true },
];

export default function GalleryScreen({ onVideo, captures = [] }) {
  const [selectedImage, setSelectedImage] = useState(null);

  // Combinar capturas reais com imagens de exemplo
  const allCaptures = [...captures, ...assetCaptures];

  const handleImagePress = (item) => {
    setSelectedImage(item);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const handleShare = async () => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Erro', 'Compartilhamento não disponível neste dispositivo');
        return;
      }

      if (selectedImage.isAsset) {
        // Imagem dos assets - não pode compartilhar direto
        Alert.alert('Info', 'Esta é uma imagem de exemplo');
        return;
      }

      // Compartilhar captura real
      await Sharing.shareAsync(selectedImage.uri, {
        mimeType: 'image/jpeg',
        dialogTitle: 'Compartilhar captura',
      });

      console.log('Compartilhado com sucesso');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível compartilhar a imagem');
      console.error('Erro ao compartilhar:', error);
    }
  };

  const renderItem = ({ item }) => {
    const imageSource = item.isAsset ? item.source : { uri: item.uri };
    
    return (
      <TouchableOpacity 
        style={styles.imageContainer}
        activeOpacity={0.7}
        onPress={() => handleImagePress(item)}
      >
        <Image 
          source={imageSource}
          style={styles.image}
          resizeMode="cover"
        />
        {!item.isAsset && (
          <View style={styles.capturedBadge}>
            <Ionicons name="camera" size={12} color="#fff" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoWrapper}>
        <Image 
          source={require('../assets/logo_long.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <TouchableOpacity 
        style={styles.videoButton}
        onPress={onVideo}
        activeOpacity={0.7}
      >
        <Ionicons name="videocam" size={28} color={colors.light.foreground} />
      </TouchableOpacity>

      {allCaptures.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="images-outline" size={80} color={colors.light.muted} />
          <Text style={styles.emptyText}>Nenhuma captura ainda</Text>
          <Text style={styles.emptySubtext}>Capture frames do vídeo</Text>
        </View>
      ) : (
        <FlatList
          data={allCaptures}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={styles.gridContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Modal
        visible={selectedImage !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.modalCloseButton}
            onPress={closeModal}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={30} color={colors.light.primaryForeground} />
          </TouchableOpacity>

          {selectedImage && !selectedImage.isAsset && (
            <TouchableOpacity 
              style={styles.modalShareButton}
              onPress={handleShare}
              activeOpacity={0.7}
            >
              <Ionicons name="share-social" size={28} color={colors.light.primaryForeground} />
            </TouchableOpacity>
          )}

          {selectedImage && (
            <Image 
              source={selectedImage.isAsset ? selectedImage.source : { uri: selectedImage.uri }}
              style={styles.fullImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
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
  videoButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 11,
    padding: 10,
    backgroundColor: colors.light.card,
    borderRadius: radius.lg * 2.5,
    ...shadows.light.sm,
  },
  gridContainer: {
    padding: 15,
    paddingTop: 190,
  },
  imageContainer: {
    width: imageSize,
    height: imageSize,
    margin: 5,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.light.muted,
    ...shadows.light.sm,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  capturedBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: colors.light.primary,
    borderRadius: 12,
    padding: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 190,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.light.foreground,
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.light.mutedForeground,
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor: colors.light.primary,
    borderRadius: radius.lg * 2.5,
    ...shadows.light.md,
  },
  modalShareButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor: colors.light.primary,
    borderRadius: radius.lg * 2.5,
    ...shadows.light.md,
  },
  fullImage: {
    width: width,
    height: height,
  },
});