import { Stack } from "expo-router";
import { useThemeColors } from "../../hooks/useThemeColors";

export default function OnboardingLayout() {
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
        animation: "slide_from_right",
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="welcome"
        options={{
          headerTitle: "Configuración Inicial",
          headerBackVisible: true,
        }}
      />
      <Stack.Screen
        name="faculties"
        options={{
          headerTitle: "Selecciona tus Facultades",
          headerBackVisible: true,
        }}
      />
      <Stack.Screen
        name="careers"
        options={{
          headerTitle: "Selecciona tus Carreras",
          headerBackVisible: true,
        }}
      />
      <Stack.Screen
        name="categories"
        options={{
          headerTitle: "Selecciona tus Categorías",
          headerBackVisible: true,
        }}
      />
    </Stack>
  );
}
