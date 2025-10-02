import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, Image, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import io from 'socket.io-client';
import { Colors, Shadows, Radius } from '../theme';

const { width } = Dimensions.get('window');

export default function VideoPlayer({ onClose }) {
  const [currentFrame, setCurrentFrame] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const socketRef = useRef(null);

  useEffect(() => {
    connectSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const connectSocket = () => {
    setConnectionStatus('Connecting...');
    
    try {
      // Use your working IP address
      socketRef.current = io('http://10.213.7.51:5000', {
        transports: ['websocket'],
        timeout: 10000,
      });

      socketRef.current.on('connect', () => {
        console.log('✅ Connected to Flask server!');
        setConnectionStatus('Connected');
      });

      socketRef.current.on('frame', (data) => {
        if (data.image) {
          const imageUri = `data:image/jpeg;base64,${data.image}`;
          setCurrentFrame(imageUri);
        }
      });

      socketRef.current.on('disconnect', () => {
        console.log('🔌 Disconnected from server');
        setConnectionStatus('Disconnected');
      });

      socketRef.current.on('connect_error', (error) => {
        console.log('❌ Connection error:', error);
        setConnectionStatus('Connection failed');
        
        // Try to reconnect after 3 seconds
        setTimeout(() => {
          if (socketRef.current && !socketRef.current.connected) {
            connectSocket();
          }
        }, 3000);
      });

    } catch (error) {
      console.log('❌ Socket setup error:', error);
      setConnectionStatus('Setup failed');
    }
  };

  const reconnect = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    connectSocket();
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors.light.background }]}>
      <TouchableOpacity 
        style={[
          styles.backButton,
          { backgroundColor: Colors.light.card }
        ]}
        onPress={onClose}
      >
        <Ionicons name="close" size={24} color={Colors.light.foreground} />
      </TouchableOpacity>

      <TouchableOpacity 
        style={[
          styles.reconnectButton,
          { backgroundColor: Colors.light.primary }
        ]}
        onPress={reconnect}
      >
        <Ionicons name="refresh" size={20} color={Colors.light.primaryForeground} />
      </TouchableOpacity>

      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>{connectionStatus}</Text>
      </View>

      <View style={styles.videoWrapper}>
        <View style={[
          styles.videoContainer,
          Shadows.lg,
          { backgroundColor: Colors.light.card }
        ]}>
          {currentFrame ? (
            <Image 
              source={{ uri: currentFrame }}
              style={styles.video}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.placeholder}>
              <Ionicons name="videocam-off" size={50} color={Colors.light.mutedForeground} />
              <Text style={styles.placeholderText}>Waiting for video stream...</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const videoWidth = Math.min(width * 0.9, 400);
const videoHeight = videoWidth * (9/16);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
    padding: 12,
    borderRadius: Radius.md,
    ...Shadows.sm,
  },
  reconnectButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
    padding: 12,
    borderRadius: Radius.md,
    ...Shadows.sm,
  },
  statusContainer: {
    position: 'absolute',
    top: 120,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  statusText: {
    color: Colors.light.mutedForeground,
    fontSize: 14,
    backgroundColor: Colors.light.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.md,
    ...Shadows.sm,
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
    borderRadius: Radius.lg,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.muted,
    width: '100%',
    height: '100%',
  },
  placeholderText: {
    marginTop: 10,
    color: Colors.light.mutedForeground,
    fontSize: 14,
    textAlign: 'center',
  },
});