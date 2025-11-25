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
  Text,
  TextInput,
  Keyboard,
  ImageBackground,
  StatusBar,
  Platform,
  SectionList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { colors, shadows, radius } from '../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');
const imageSize = (width - 48) / 3;

// Imagens de exemplo dos assets
const assetCaptures = [
  { id: 'asset1', source: require('../assets/video/scrsht1.jpg'), isAsset: true },
  { id: 'asset2', source: require('../assets/video/scrsht2.jpg'), isAsset: true },
  { id: 'asset3', source: require('../assets/video/scrsht3.jpg'), isAsset: true },
  { id: 'asset4', source: require('../assets/video/scrsht4.jpg'), isAsset: true },
  { id: 'asset5', source: require('../assets/video/scrsht5.jpg'), isAsset: true },
  { id: 'asset6', source: require('../assets/video/scrsht6.jpg'), isAsset: true },
];

export default function GalleryScreen({ onVideo, captures = [], isLoading = false, onDeleteCapture, onEditCaptureName }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showAbout, setShowAbout] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingName, setEditingName] = useState('');
  const insets = useSafeAreaInsets();

  const handleImagePress = (item) => {
    setSelectedImage(item);
  };

  const closeModal = () => {
    console.log('closeModal chamado - fechando modal');
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
        Alert.alert('Info', 'Esta é uma imagem de exemplo');
        return;
      }

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

  const handleDelete = () => {
    if (selectedImage.isAsset) {
      Alert.alert('Info', 'Não é possível excluir imagens de exemplo');
      return;
    }

    Alert.alert(
      'Excluir imagem',
      'Tem certeza que deseja excluir esta captura? Esta ação não pode ser desfeita.',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              // Deletar arquivo local
              await FileSystem.deleteAsync(selectedImage.uri, { idempotent: true });
              
              // Remover da lista através do callback
              if (onDeleteCapture) {
                onDeleteCapture(selectedImage.id);
              }
              
              closeModal();
              
              Alert.alert('✓ Excluído', 'Imagem removida com sucesso');
            } catch (error) {
              console.error('Erro ao excluir:', error);
              Alert.alert('Erro', 'Não foi possível excluir a imagem');
            }
          }
        }
      ]
    );
  };

  const handleEditName = () => {
    if (selectedImage.isAsset) {
      Alert.alert('Info', 'Não é possível editar imagens de exemplo');
      return;
    }

    // Abrir modal customizado com nome atual
    setEditingName(selectedImage.name || '');
    setShowEditModal(true);
  };

  const saveEditedName = () => {
    const newName = editingName.trim();
    
    if (!newName) {
      Alert.alert('Erro', 'O nome não pode estar vazio');
      return;
    }

    // Persistir através do callback
    if (onEditCaptureName) {
      onEditCaptureName(selectedImage.id, newName);
    }
    
    // Atualizar localmente também para atualizar o modal
    setSelectedImage({
      ...selectedImage,
      name: newName
    });
    
    // Fechar modal de edição
    setShowEditModal(false);
    setEditingName('');
    
    console.log('Nome atualizado:', newName);
  };

  const cancelEdit = () => {
    setShowEditModal(false);
    setEditingName('');
  };

  const renderItem = ({ item }) => {
    const imageSource = item.isAsset ? item.source : { uri: item.uri };
    
    return (
      <View style={styles.imageWrapper}>
        <TouchableOpacity 
          style={styles.imageContainer}
          activeOpacity={0.8}
          onPress={() => handleImagePress(item)}
        >
          <Image 
            source={imageSource}
            style={styles.image}
            resizeMode="cover"
          />
          {!item.isAsset && item.inGallery && (
            <View style={styles.galleryBadge}>
              <Ionicons name="checkmark-circle" size={12} color="#fff" />
            </View>
          )}
        </TouchableOpacity>
        
        {!item.isAsset && item.name && (
          <Text style={styles.imageName} numberOfLines={2} ellipsizeMode="tail">
            {item.name}
          </Text>
        )}
      </View>
    );
  };

  // Criar grid manual (3 colunas)
  const renderRow = (items) => {
    return (
      <View style={styles.row}>
        {items.map(item => item && (
          <View key={item.id}>
            {renderItem({ item })}
          </View>
        ))}
      </View>
    );
  };

  // Agrupar em linhas de 3
  const groupIntoRows = (data) => {
    const rows = [];
    for (let i = 0; i < data.length; i += 3) {
      rows.push(data.slice(i, i + 3));
    }
    return rows;
  };

  const captureRows = groupIntoRows(captures);
  const exampleRows = groupIntoRows(assetCaptures);

  return (
    <ImageBackground 
      source={require('../assets/background.png')}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <StatusBar barStyle="dark-content" backgroundColor={colors.light.background} translucent={false} />
      
      <View style={styles.container}>
        <View style={styles.header}>
          <Image 
            source={require('../assets/logo_long.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>Galeria</Text>
        </View>

        {isLoading ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="hourglass-outline" size={80} color={colors.light.muted} />
            <Text style={styles.emptyText}>Carregando capturas...</Text>
          </View>
        ) : (
          <FlatList
            data={[1]} // Dummy data para usar FlatList
            renderItem={() => (
              <View>
                {/* Seção: Minhas Capturas */}
                {captures.length > 0 ? (
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionTitle}>Minhas Capturas</Text>
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{captures.length}</Text>
                      </View>
                    </View>
                    {captureRows.map((row, index) => (
                      <View key={`capture-row-${index}`}>
                        {renderRow(row)}
                      </View>
                    ))}
                  </View>
                ) : (
                  <View style={styles.emptySection}>
                    <Ionicons name="images-outline" size={48} color={colors.light.muted} />
                    <Text style={styles.emptySectionText}>Nenhuma captura ainda</Text>
                    <Text style={styles.emptySectionSubtext}>Capture frames do microscópio</Text>
                  </View>
                )}

                {/* Seção: Exemplos */}
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Exemplos</Text>
                    <Ionicons name="star-outline" size={16} color={colors.light.mutedForeground} />
                  </View>
                  {exampleRows.map((row, index) => (
                    <View key={`example-row-${index}`}>
                      {renderRow(row)}
                    </View>
                  ))}
                </View>
              </View>
            )}
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          />
        )}

        <View style={[
          styles.bottomNav,
          { paddingBottom: Math.max(insets.bottom, 12) }
        ]}>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={onVideo}
            activeOpacity={0.7}
          >
            <Ionicons name="videocam" size={28} color={colors.light.foreground} />
            <Text style={styles.navLabel}>Vídeo</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.navButton}
            activeOpacity={0.7}
          >
            <View style={styles.activeIndicator}>
              <Ionicons name="images" size={28} color={colors.light.primaryForeground} />
            </View>
            <Text style={[styles.navLabel, styles.navLabelActive]}>Galeria</Text>
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

      {/* Modal de Imagem - Estilo Android Gallery */}
      <Modal
        visible={selectedImage !== null}
        transparent={false}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.androidModalContainer}>
          <StatusBar backgroundColor="#000000" barStyle="light-content" />
          
          {/* Back Button - Absolute Position */}
          <TouchableOpacity 
            style={styles.androidBackButtonAbsolute}
            onPress={() => {
              console.log('Botão voltar pressionado');
              closeModal();
            }}
            activeOpacity={0.7}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
          
          {/* Top Bar */}
          <View style={styles.androidTopBar}>
            <View style={styles.androidBackButtonPlaceholder} />

            {selectedImage && selectedImage.name && (
              <View style={styles.androidTitleContainer}>
                <Text style={styles.androidTitle} numberOfLines={1}>
                  {selectedImage.name}
                </Text>
                {selectedImage.timestamp && (
                  <Text style={styles.androidSubtitle}>
                    {new Date(selectedImage.timestamp).toLocaleDateString('pt-BR')}
                  </Text>
                )}
              </View>
            )}
          </View>

          {/* Image */}
          {selectedImage && (
            <View style={styles.androidImageContainer}>
              <Image 
                source={selectedImage.isAsset ? selectedImage.source : { uri: selectedImage.uri }}
                style={styles.androidFullImage}
                resizeMode="contain"
              />
            </View>
          )}

          {/* Bottom Action Bar */}
          <View style={[
            styles.androidBottomBar,
            { paddingBottom: Math.max(insets.bottom, 20) }
          ]}>
            {selectedImage && !selectedImage.isAsset ? (
              <>
                <TouchableOpacity 
                  style={styles.androidActionButton}
                  onPress={handleEditName}
                  activeOpacity={0.7}
                >
                  <Ionicons name="create-outline" size={26} color="white" />
                  <Text style={styles.androidActionLabel}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.androidActionButton}
                  onPress={handleShare}
                  activeOpacity={0.7}
                >
                  <Ionicons name="share-social-outline" size={26} color="white" />
                  <Text style={styles.androidActionLabel}>Compartilhar</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.androidActionButton}
                  onPress={handleDelete}
                  activeOpacity={0.7}
                >
                  <Ionicons name="trash-outline" size={26} color="white" />
                  <Text style={styles.androidActionLabel}>Excluir</Text>
                </TouchableOpacity>

                {selectedImage.inGallery && (
                  <View style={styles.androidActionButton}>
                    <Ionicons name="checkmark-circle" size={26} color="#4CAF50" />
                    <Text style={[styles.androidActionLabel, { color: '#4CAF50' }]}>
                      Na Galeria
                    </Text>
                  </View>
                )}
              </>
            ) : (
              <View style={styles.androidInfoContainer}>
                <Ionicons name="star-outline" size={22} color="rgba(255,255,255,0.7)" />
                <Text style={styles.androidInfoText}>Imagem de exemplo</Text>
              </View>
            )}
          </View>
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

      {/* Modal Editar Nome */}
      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="fade"
        onRequestClose={cancelEdit}
      >
        <TouchableOpacity 
          style={styles.editModalOverlay}
          activeOpacity={1}
          onPress={() => {
            Keyboard.dismiss();
            cancelEdit();
          }}
        >
          <TouchableOpacity 
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.editModalContent}>
              <View style={styles.editHeader}>
                <Ionicons name="create" size={32} color={colors.light.primary} />
                <Text style={styles.editTitle}>Editar Nome</Text>
              </View>

              <View style={styles.editInputContainer}>
                <Text style={styles.editLabel}>Nome da captura:</Text>
                <TextInput
                  style={styles.editInput}
                  value={editingName}
                  onChangeText={setEditingName}
                  placeholder="Digite o nome..."
                  placeholderTextColor={colors.light.mutedForeground}
                  autoFocus={true}
                  maxLength={50}
                  returnKeyType="done"
                  onSubmitEditing={saveEditedName}
                />
                <Text style={styles.editCounter}>{editingName.length}/50</Text>
              </View>

              <View style={styles.editButtons}>
                <TouchableOpacity 
                  style={styles.editCancelButton}
                  onPress={cancelEdit}
                  activeOpacity={0.8}
                >
                  <Text style={styles.editCancelButtonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.editSaveButton}
                  onPress={saveEditedName}
                  activeOpacity={0.8}
                >
                  <Ionicons name="checkmark-circle" size={20} color="white" />
                  <Text style={styles.editSaveButtonText}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </ImageBackground>
  );
}

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
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 16,
    alignItems: 'center',
  },
  logo: {
    height: 120,
    width: 360,
    marginBottom: 8,
  },
  headerTitle: {
    color: colors.light.foreground,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  section: {
    marginTop: 8,
    paddingHorizontal: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.light.foreground,
    letterSpacing: 0.3,
  },
  badge: {
    backgroundColor: colors.light.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 8,
  },
  imageContainer: {
    width: imageSize,
    height: imageSize,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.light.muted,
    ...shadows.light.sm,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  galleryBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 3,
    ...shadows.light.sm,
  },
  imageWrapper: {
    width: imageSize,
    margin: 4,
  },
  imageName: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '600',
    color: colors.light.foreground,
    textAlign: 'center',
    lineHeight: 14,
    paddingHorizontal: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.light.foreground,
    marginTop: 20,
    letterSpacing: 0.3,
  },
  emptySection: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptySectionText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.light.foreground,
    marginTop: 12,
  },
  emptySectionSubtext: {
    fontSize: 14,
    color: colors.light.mutedForeground,
    marginTop: 4,
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
  activeIndicator: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    ...shadows.light.md,
  },
  navLabel: {
    color: colors.light.foreground,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
    letterSpacing: 0.3,
  },
  navLabelActive: {
    fontWeight: '700',
  },
  
  // Android Gallery Modal Styles
  androidModalContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  androidTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  androidBackButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    zIndex: 10,
  },
  androidBackButtonAbsolute: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 8,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  androidBackButtonPlaceholder: {
    width: 48,
    height: 48,
  },
  androidTitleContainer: {
    flex: 1,
    marginLeft: 8,
    marginRight: 48,
  },
  androidTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  androidSubtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 13,
    marginTop: 2,
  },
  androidImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  androidFullImage: {
    width: width,
    height: height,
  },
  androidBottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  androidActionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
    gap: 6,
  },
  androidActionLabel: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  androidInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  androidInfoText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 13,
    fontWeight: '500',
  },
  fullImage: {
    width: width,
    height: height,
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

  // Edit Modal styles
  editModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  editModalContent: {
    backgroundColor: colors.light.background,
    borderRadius: radius.xl,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    ...shadows.light.xl,
  },
  editHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 10,
  },
  editTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.light.foreground,
    letterSpacing: 0.3,
  },
  editInputContainer: {
    marginBottom: 20,
  },
  editLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.light.foreground,
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  editInput: {
    backgroundColor: colors.light.muted,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.light.foreground,
    borderWidth: 2,
    borderColor: colors.light.primary,
  },
  editCounter: {
    fontSize: 12,
    color: colors.light.mutedForeground,
    textAlign: 'right',
    marginTop: 4,
  },
  editButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  editCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radius.lg,
    alignItems: 'center',
    backgroundColor: colors.light.muted,
  },
  editCancelButtonText: {
    color: colors.light.foreground,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  editSaveButton: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 12,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.light.primary,
    ...shadows.light.md,
  },
  editSaveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});