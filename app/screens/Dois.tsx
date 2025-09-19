// Dois.tsx
import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";

export default function Dois() {
  return (
    <View style={styles.container}>
      {/* Logo top-left */}
      <Image source={require("../assets/logo.png")} style={styles.logo} />

      {/* Mini player centered */}
      <View style={styles.miniPlayer}>
        <Text style={styles.trackTitle}>Video Title</Text>
        <View style={styles.controls}>
          <Text style={styles.controlButton}>⏮️</Text>
          <Text style={styles.controlButton}>⏯️</Text>
          <Text style={styles.controlButton}>⏭️</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  logo: {
    width: 80,
    height: 80,
    marginTop: 50, // below status bar
    marginLeft: 20,
    resizeMode: "contain",
    position: "absolute",
  },
  miniPlayer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -150 }, { translateY: -75 }],
    width: 300,
    height: 150,
    backgroundColor: "#000",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
  },
  controlButton: {
    fontSize: 20,
    color: "#fff",
  },
});
