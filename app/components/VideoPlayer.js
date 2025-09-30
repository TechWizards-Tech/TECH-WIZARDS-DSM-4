import React, { useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import { LogBox } from 'react-native';

// Suppress deprecation warnings
LogBox.ignoreLogs([
  'Video component from `expo-av` is deprecated',
]);

const { width, height } = Dimensions.get('window');

export default function VideoPlayer({ onClose }) {
  const video = useRef(null);

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={onClose}
      >
        <Ionicons name="close" size={30} color="#000" />
      </TouchableOpacity>

      <View style={styles.videoWrapper}>
        <View style={styles.videoContainer}>
          <Video
            ref={video}
            style={styles.video}
            source={require('../assets/video/sample.mp4')}
            useNativeControls
            resizeMode="contain"
            isLooping
            shouldPlay={true}
          />
        </View>
      </View>
    </View>
  );
}

// Calculate responsive video dimensions
const videoWidth = Math.min(width * 0.9, 400);
const videoHeight = videoWidth * (9/16);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
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
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  video: {
    width: '100%',
    height: '100%',
  },
});