import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import SplashScreen from './screens/SplashScreen';
import VideoPlayer from './components/VideoPlayer';
import GalleryScreen from './screens/GalleryScreen';
import { colors } from './theme/colors';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('splash');

  return (
    <View style={styles.container}>
      {currentScreen === 'splash' && (
        <SplashScreen onFinish={() => setCurrentScreen('video')} />
      )}
      
      {currentScreen === 'video' && (
        <VideoPlayer onGallery={() => setCurrentScreen('gallery')} />
      )}

      {currentScreen === 'gallery' && (
        <GalleryScreen onVideo={() => setCurrentScreen('video')} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
});