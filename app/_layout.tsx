import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useThemeColors } from "./hooks/useThemeColors";
import { useConfesionesStore } from "./store/useConfesionesStore";
import { seedAprobadas, seedPendientes } from "./data/seed";

export default function RootLayout() {
  const { colors, effective } = useThemeColors();
  const seed = useConfesionesStore((s) => s.seed);

  useEffect(() => {
    seed(seedAprobadas, seedPendientes);
  }, [seed]);

  return (
    <>
      <StatusBar style={effective === "dark" ? "light" : "dark"} backgroundColor={colors.headerBg} />
      <Stack screenOptions={{ contentStyle: { backgroundColor: colors.background } }}>
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        <Stack.Screen
          name="moderacion"
          options={{
            title: "Moderación",
            presentation: "modal",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: colors.headerBg },
            headerTintColor: colors.headerText
          }}
        />
      </Stack>
    </>
  );
}
