import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export default function Um() {
  return (
    <>
      <View style={styles.container}>
        <Text>1111111111111111111!</Text>
        <StatusBar style="auto" />
      </View>
      <View style={styles.container2}>
        <Text>222222222222222222222!</Text>
        <StatusBar style="auto" />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#dc143b",
    alignItems: "center",
    justifyContent: "center",
  },

  container2: {
    flex: 1,
    backgroundColor: "#fa8071",
    alignItems: "center",
    justifyContent: "center",
  },

});
