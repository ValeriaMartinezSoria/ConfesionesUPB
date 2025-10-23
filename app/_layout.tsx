
import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useThemeColors } from "./hooks/useThemeColors";
import { useConfesionesStore } from "./store/useConfesionesStore";
import { seedAprobadas, seedPendientes } from "./data/seed";
import SplashScreen from "./SplashScreen";

export default function RootLayout() {
  const { colors, effective } = useThemeColors();
  const seed = useConfesionesStore((s) => s.seed);

  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    seed(seedAprobadas, seedPendientes);
  }, [seed]);

 
  const handleSplashFinish = () => {
    setShowSplash(false);
  };


  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} durationMs={4000} />;
  }


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

