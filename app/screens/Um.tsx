// Um.tsx
import React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "./App"; // 👈 import the type from App.tsx

type UmScreenNavigationProp = StackNavigationProp<RootStackParamList, "FirstScreen">;

export default function Um() {
  const navigation = useNavigation<UmScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate("Dois")}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
});
