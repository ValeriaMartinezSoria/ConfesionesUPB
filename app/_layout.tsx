import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./data/firebase";
import { useThemeColors } from "./hooks/useThemeColors";
import { useUserStore } from "./store/useUserStore";
import SplashScreen from "./SplashScreen";

export default function RootLayout() {
  const { colors, effective } = useThemeColors();
  const { user, setUser, setLoading, loading } = useUserStore();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, [setUser, setLoading]);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);


  if (loading || showSplash) {
    return <SplashScreen />;
  }


  if (!user) {
    return (
      <>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="auth" />
        </Stack>
      </>
    );
  }


  return (
    <>
      <StatusBar
        style={effective === "dark" ? "light" : "dark"}
        backgroundColor={colors.headerBg}
      />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >

        <Stack.Screen name="(drawer)" />


        <Stack.Screen
          name="moderacion"
          options={{
            title: "Moderación",
            presentation: "modal", 
            headerShown: true,
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: colors.headerBg },
            headerTintColor: colors.headerText,
          }}
        />
      </Stack>
    </>
  );
}

