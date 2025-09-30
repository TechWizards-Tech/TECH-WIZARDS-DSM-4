import React, { useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Animated } from 'react-native';

export default function HomeScreen({ onPlay }) {
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
      <TouchableOpacity 
        onPress={handlePress}
        activeOpacity={0.9}
      >
        <Animated.View 
          style={[
            styles.logoContainer,
            {
              transform: [{ scale: scaleAnim }],
            }
          ]}
        >
          <Image 
            source={require('../assets/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
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
  logoContainer: {
    padding: 30,
  },
  logo: {
    width: 200,
    height: 200,
  },
});