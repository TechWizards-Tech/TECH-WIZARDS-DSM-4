import React from "react";
import { View, StyleSheet } from "react-native";
import Constants from "expo-constants";

export default function Tres() {
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <View style={styles.left} />
        <View style={styles.right}>
            <View style={styles.righttop} />
            <View style={styles.rightbottom} />
        </View>
            
     </View>

      <View style={styles.bottom} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column", // Elementos empilhados em coluna
    paddingTop: Constants.statusBarHeight, // Espaço para status bar
  },
  top: {
    flex: 0.5,
    backgroundColor: "crimson",
    flexDirection: "row",
  },
  left: {
    flex:0.5,
    backgroundColor : "lime",
  },
  right: {
    flex: 0.5,
    backgroundColor: "aquamarine",
    flexDirection: "column",
  },
  righttop:{
    flex: 0.5,
    backgroundColor: "teal",
  },
  rightbottom: {
    flex: 0.5,
    backgroundColor: "skyblue",
  },

  bottom: {
    flex: 0.5,
    backgroundColor: "salmon",
  },
});
