import React, { useRef, useState } from 'react';
import { 
  View, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  FlatList,
  Dimensions,
  Modal,
  Alert,
  ImageBackground
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { colors, shadows, radius } from '../theme/colors';

const { width, height } = Dimensions.get('window');
const imageSize = (width - 60) / 3;

const captures = [
  { id: '1', source: require('../assets/video/scrsht1.jpg') },
  { id: '2', source: require('../assets/video/scrsht2.jpg') },
  { id: '3', source: require('../assets/video/scrsht3.jpg') },
  { id: '4', source: require('../assets/video/scrsht4.jpg') },
  { id: '5', source: require('../assets/video/scrsht5.jpg') },
  { id: '6', source: require('../assets/video/scrsht6.jpg') },
];

export default function GalleryScreen({ onVideo }) {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImagePress = (item) => setSelectedImage(item);
  const closeModal = () => setSelectedImage(null);

  const handleShare = async () => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Erro', 'Compartilhamento não disponível neste dispositivo');
        return;
      }

      const asset = selectedImage.source;
      const assetModule = Image.resolveAssetSource(asset);
      const fileUri = `${FileSystem.cacheDirectory}share_image_${selectedImage.id}.jpg`;

      await FileSystem.downloadAsync(assetModule.uri, fileUri);
      await Sharing.shareAsync(fileUri, {
        mimeType: 'image/jpeg',
        dialogTitle: 'Compartilhar imagem',
      });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível compartilhar a imagem');
      console.error('Erro ao compartilhar:', error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.imageContainer}
      activeOpacity={0.7}
      onPress={() => handleImagePress(item)}
    >
      <Image 
        source={item.source}
        style={styles.image}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../assets/background.png')}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
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

        <FlatList
          data={captures}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={styles.gridContainer}
          showsVerticalScrollIndicator={false}
        />

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

            <TouchableOpacity 
              style={styles.modalShareButton}
              onPress={handleShare}
              activeOpacity={0.7}
            >
              <Ionicons name="share-social" size={28} color={colors.light.primaryForeground} />
            </TouchableOpacity>

            {selectedImage && (
              <Image 
                source={selectedImage.source}
                style={styles.fullImage}
                resizeMode="contain"
              />
            )}
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  backgroundImage: {
    opacity: 0.12,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
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
    top: 80,
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
