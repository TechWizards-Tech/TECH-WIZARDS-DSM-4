import React, { useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Logo from '../assets/logo.png';

export default function HomeScreen({ onPlay, onGallery }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    // Scale down animation
    Animated.sequence([
      // Scale down
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 150,
        useNativeDriver: true,
      }),
      // Scale back up slightly
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      // Scale down to invisible
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Call onPlay after animation completes
      onPlay();
    });
  };

  return (
    <View style={styles.container}>
      {/* Botão da galeria */}
      <TouchableOpacity
        style={styles.galleryButton}
        onPress={onGallery}
        activeOpacity={0.7}
      >
        <Ionicons name="images" size={28} color="#000" />
      </TouchableOpacity>

      <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Image source={Logo} style={styles.logo} resizeMode="contain" />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  galleryButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  logoContainer: {
    padding: 30,
  },
  logo: {
    width: 200,
    height: 200,
  },
});
