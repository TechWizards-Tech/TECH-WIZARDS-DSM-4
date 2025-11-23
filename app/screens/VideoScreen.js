import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';

const { width: screenWidth} = Dimensions.get('window');

export default function VideoScreen({ navigation }) {
  // Replace YOUR_VIDEO_ID with your actual YouTube video ID
  const youtubeUrl = "https://www.youtube.com/embed/rNSEkDGKnwU?rel=0&modestbranding=1";

  return (
    <View style={styles.container}>
      {/* Back button in top left */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={30} color="#000" />
      </TouchableOpacity>

      {/* Centered YouTube Video Container */}
      <View style={styles.videoWrapper}>
        <View style={styles.videoContainer}>
          <WebView
            style={styles.videoPlayer}
            source={{ uri: youtubeUrl }}
            allowsFullscreenVideo={true}
            allowsInlineMediaPlayback={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
          />
        </View>
      </View>
    </View>
  );
}

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
    width: '100%', // Takes full width but limited by maxWidth
    maxWidth: screenWidth * 0.9, // 90% of screen width
    height: (screenWidth * 0.9) * (9/16), // 16:9 aspect ratio (standard YouTube)
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
    elevation: 8, // For Android shadow
  },
  videoPlayer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});