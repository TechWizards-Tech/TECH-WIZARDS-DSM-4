import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import VideoPlayer from './components/VideoPlayer';

export default function App() {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <View style={styles.container}>
      {showVideo ? (
        <VideoPlayer onClose={() => setShowVideo(false)} />
      ) : (
        <HomeScreen onPlay={() => setShowVideo(true)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
});