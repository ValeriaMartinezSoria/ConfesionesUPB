import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../data/firebase";
import { useRouter } from "expo-router";
import { useThemeColors } from "../hooks/useThemeColors";

export default function Login() {
  const router = useRouter();
  const { colors } = useThemeColors();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert("Error", "Por favor completa todos los campos");
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Usuario autenticado:", userCredential.user.email);
      router.replace("/"); 
    } catch (error: any) {
      console.error(" Error de inicio de sesión:", error);
      Alert.alert("Error", "Correo o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  const goToRegister = () => {
    router.push("/auth/register");
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: colors.background,
      }}
    >
      <Text
        style={{
          fontSize: 26,
          fontWeight: "bold",
          color: colors.text,
          textAlign: "center",
          marginBottom: 20,
        }}
      >
        Iniciar Sesión
      </Text>

      <TextInput
        placeholder="Correo electrónico"
        placeholderTextColor={colors.inputPlaceholder}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
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
          marginBottom: 20,
        }}
      />

      <TouchableOpacity
        onPress={handleLogin}
        disabled={loading}
        style={{
          backgroundColor: loading ? colors.inputBg : colors.buttonBg,
          padding: 12,
          borderRadius: 8,
          alignItems: "center",
        }}
      >
        {loading ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <Text style={{ color: colors.buttonText, fontWeight: "bold" }}>Ingresar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={goToRegister}>
        <Text
          style={{
            color: colors.text,
            textAlign: "center",
            marginTop: 20,
          }}
        >
          ¿No tienes cuenta? Crear una nueva
        </Text>
      </TouchableOpacity>
    </View>
  );
}
