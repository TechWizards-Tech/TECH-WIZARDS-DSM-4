import React from "react";
import { View, StyleSheet, Image } from "react-native";
import Constants from "expo-constants";

// Importando a imagem
import logo from "../assets/adaptive-icon.png";

export default function Quatro() {
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <View style={styles.left}>
          <Image source={logo} style={styles.image} resizeMode="contain" />
        </View>
        <View style={styles.right}>
          <View style={styles.righttop}>
            <Image source={logo} style={styles.image} resizeMode="contain" />
          </View>
          <View style={styles.rightbottom}>
            <Image source={logo} style={styles.image} resizeMode="contain" />
          </View>
        </View>
      </View>

      <View style={styles.bottom}>
        <Image source={logo} style={styles.image} resizeMode="contain" />
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
    flex: 1,
    alignSelf: "center",
    width: "100%",
  },
});
