import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../_data/firebase";
import { useRouter } from "expo-router";
import { useThemeColors } from "../_hooks/useThemeColors";
import { Ionicons } from "@expo/vector-icons";

export default function ForgotPassword() {
  const router = useRouter();
  const { colors } = useThemeColors();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleResetPassword = async () => {
    if (!email || !email.includes("@")) {
      return Alert.alert("Error", "Por favor ingresa un correo válido");
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setEmailSent(true);
      Alert.alert(
        "Correo enviado",
        "Se ha enviado un enlace de recuperación a tu correo electrónico. Revisa tu bandeja de entrada.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      console.error("Error al enviar correo:", error);
      let errorMessage = "No se pudo enviar el correo de recuperación";
      
      if (error.code === "auth/user-not-found") {
        errorMessage = "No existe una cuenta con este correo electrónico";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Correo electrónico inválido";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Demasiados intentos. Intenta más tarde";
      }
      
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
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
      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          position: "absolute",
          top: 50,
          left: 20,
          padding: 8,
        }}
      >
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>

      <View style={{ alignItems: "center", marginBottom: 30 }}>
        <Ionicons name="lock-closed-outline" size={64} color={colors.primary} />
      </View>

      <Text
        style={{
          fontSize: 26,
          fontWeight: "bold",
          color: colors.text,
          textAlign: "center",
          marginBottom: 10,
        }}
      >
        Recuperar Contraseña
      </Text>

      <Text
        style={{
          fontSize: 14,
          color: colors.subtle,
          textAlign: "center",
          marginBottom: 30,
          paddingHorizontal: 20,
        }}
      >
        Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
      </Text>

      <TextInput
        placeholder="Correo electrónico"
        placeholderTextColor={colors.inputPlaceholder}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        editable={!emailSent}
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
        onPress={handleResetPassword}
        disabled={loading || emailSent}
        style={{
          backgroundColor: loading || emailSent ? colors.inputBg : colors.buttonBg,
          padding: 12,
          borderRadius: 8,
          alignItems: "center",
        }}
      >
        {loading ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <Text style={{ color: colors.buttonText, fontWeight: "bold" }}>
            {emailSent ? "Correo Enviado" : "Enviar Enlace"}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text
          style={{
            color: colors.text,
            textAlign: "center",
            marginTop: 20,
          }}
        >
          Volver al inicio de sesión
        </Text>
      </TouchableOpacity>
    </View>
  );
}
