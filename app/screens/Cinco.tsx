import React from "react";
import { View, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import Constants from "expo-constants";
import logo from "../assets/adaptive-icon.png"; // ajuste o caminho conforme seu projeto

export default function Cinco() {
  const handlePress = () => {
    Alert.alert("Boa noite!");
  };

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <View style={styles.left}>
          <TouchableOpacity onPress={handlePress}>
            <Image source={logo} style={styles.image} resizeMode="stretch" />
          </TouchableOpacity>
        </View>
        <View style={styles.right}>
          <View style={styles.righttop}>
            <TouchableOpacity onPress={handlePress}>
              <Image source={logo} style={styles.image} resizeMode="stretch" />
            </TouchableOpacity>
          </View>
          <View style={styles.rightbottom}>
            <TouchableOpacity onPress={handlePress}>
              <Image source={logo} style={styles.image} resizeMode="stretch" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.bottom}>
        <TouchableOpacity onPress={handlePress}>
          <Image source={logo} style={styles.image} resizeMode="stretch" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    paddingTop: Constants.statusBarHeight,
  },
  top: {
    flex: 0.5,
    flexDirection: "row",
  },
  left: {
    flex: 0.5,
    backgroundColor: "lime",
    justifyContent: "center",
    alignItems: "center",
  },
  right: {
    flex: 0.5,
    flexDirection: "column",
  },
  righttop: {
    flex: 0.5,
    backgroundColor: "teal",
    justifyContent: "center",
    alignItems: "center",
  },
  rightbottom: {
    flex: 0.5,
    backgroundColor: "skyblue",
    justifyContent: "center",
    alignItems: "center",
  },
  bottom: {
    flex: 0.5,
    backgroundColor: "salmon",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 64,
    height: 64,
  },
});
