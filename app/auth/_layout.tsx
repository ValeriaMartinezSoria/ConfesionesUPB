import React from "react";
import { Stack } from "expo-router";
import { useThemeColors } from "../hooks/useThemeColors";

export default function AuthLayout() {
  const { colors } = useThemeColors();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackTitleVisible: false,
        headerTitle: "",
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Iniciar Sesión",
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          headerTitle: "Crear Cuenta",
          headerBackVisible: true,
        }}
      />
     <Stack.Screen
       name="onboarding"
        options={{
        headerShown: false,
      }}
      />
    </Stack>
  );
}
