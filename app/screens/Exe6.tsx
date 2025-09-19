import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  SafeAreaView,
} from "react-native";

export default function Exe7() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [savedData, setSavedData] = useState<{
    email: string;
    password: string;
  } | null>(null);

  const handleLogin = () => {
    if (email && password) {
      setSavedData({ email, password });
      Keyboard.dismiss();
    }

    setEmail("");
    setPassword("");
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={styles.master}>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email:</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Digite seu email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Senha:</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Digite sua senha"
            secureTextEntry={true}
            maxLength={8}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Logar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Cadastrar</Text>
          </TouchableOpacity>

        </View>

        {savedData && (
          <View style={styles.savedDataContainer}>
            <Text style={styles.text}>Dados de Login:</Text>
            <Text style={styles.text}>Email: {savedData.email}</Text>
            <Text style={styles.text}>Senha: {savedData.password}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  master: {
    flex: 1,
    backgroundColor: "#2F2F2F",
  },
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    padding: 20,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "600",
    color: "white",
  },
  input: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#F6B108",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    flex: 1,
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  savedDataContainer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: "#3F3F3F",
    borderRadius: 8,
  },
  text: {
    color: "white",
    fontSize: 16,
    marginBottom: 5,
  },
  buttonContainer: {
    gap: 20,
    justifyContent: "center",
    flexDirection: "row",
    },
});
