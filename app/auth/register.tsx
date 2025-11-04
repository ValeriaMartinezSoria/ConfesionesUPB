import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../_data/firebase";
import { useRouter } from "expo-router";
import { useThemeColors } from "../_hooks/useThemeColors";

export default function Register() {
  const router = useRouter();
  const { colors } = useThemeColors();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password) {
      return Alert.alert("Error", "Por favor completa email y contraseña");
    }

    if (password !== confirm) {
      return Alert.alert("Error", "Las contraseñas no coinciden");
    }

    setLoading(true);
    try {
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Actualizar displayName si se proporcionó nombre
      if (name.trim()) {
        await updateProfile(user, {
          displayName: name.trim(),
        });
      }

      // Guardar datos del usuario en Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        displayName: name.trim() || null,
        createdAt: serverTimestamp(),
        pushToken: null, // Para futuras notificaciones push
      });

      Alert.alert("Cuenta creada", "Tu cuenta se creó correctamente");
      router.replace("/");
    } catch (error: any) {
      console.error("Error al registrar:", error);
      let errorMessage = "Ocurrió un error al crear la cuenta";
      
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Este correo ya está registrado";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Correo electrónico inválido";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "La contraseña debe tener al menos 6 caracteres";
      }
      
      Alert.alert("Error", errorMessage);
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
        placeholder="Nombre (opcional)"
        placeholderTextColor={colors.inputPlaceholder}
        value={name}
        onChangeText={setName}
        style={{
          backgroundColor: colors.inputBg,
          color: colors.text,
          borderWidth: 1,
          borderColor: colors.inputBorder,
          borderRadius: 8,
          padding: 12,
          marginBottom: 10,
        }}
        autoCapitalize="words"
      />

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
        {loading ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <Text style={{ color: colors.buttonText, fontWeight: "bold" }}>
            Registrarse
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/auth")}>
        <Text style={{ color: colors.text, textAlign: "center", marginTop: 20 }}>
          ¿Ya tienes cuenta? Inicia sesión
        </Text>
      </TouchableOpacity>
    </View>
  );
}
