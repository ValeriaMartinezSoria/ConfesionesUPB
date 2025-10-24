import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, Alert } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../data/firebase";
import { useRouter } from "expo-router";
import { useThemeColors } from "../hooks/useThemeColors";

export default function Register() {
  const router = useRouter();
  const { colors } = useThemeColors();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (password !== confirm) {
      return Alert.alert("Error", "Las contraseñas no coinciden");
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // No redirect - let _layout.tsx handle navigation to onboarding
    } catch (error: any) {
      console.error("Error al registrar:", error);
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20, backgroundColor: colors.background }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center", color: colors.text, marginBottom: 20 }}>
        Crear cuenta
      </Text>

      <TextInput
        placeholder="Correo electrónico"
        placeholderTextColor={colors.inputPlaceholder}
        value={email}
        onChangeText={setEmail}
        style={{
          backgroundColor: colors.inputBg,
          color: colors.text,
          borderWidth: 1,
          borderColor: colors.inputBorder,
          borderRadius: 8,
          padding: 12,
          marginBottom: 10,
        }}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Contraseña"
        placeholderTextColor={colors.inputPlaceholder}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          backgroundColor: colors.inputBg,
          color: colors.text,
          borderWidth: 1,
          borderColor: colors.inputBorder,
          borderRadius: 8,
          padding: 12,
          marginBottom: 10,
        }}
      />

      <TextInput
        placeholder="Confirmar contraseña"
        placeholderTextColor={colors.inputPlaceholder}
        value={confirm}
        onChangeText={setConfirm}
        secureTextEntry
        style={{
          backgroundColor: colors.inputBg,
          color: colors.text,
          borderWidth: 1,
          borderColor: colors.inputBorder,
          borderRadius: 8,
          padding: 12,
          marginBottom: 20,
        }}
      />

      <TouchableOpacity
        onPress={handleRegister}
        disabled={loading}
        style={{
          backgroundColor: loading ? colors.inputBg : colors.buttonBg,
          padding: 12,
          borderRadius: 8,
          alignItems: "center",
        }}
      >
        <Text style={{ color: colors.buttonText, fontWeight: "bold" }}>
          {loading ? "Creando..." : "Registrarse"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/auth")}>
        <Text style={{ color: colors.text, textAlign: "center", marginTop: 20 }}>
          ¿Ya tienes cuenta? Inicia sesión
        </Text>
      </TouchableOpacity>
    </View>
  );
}
