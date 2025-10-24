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
  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);
  const setLoading = useUserStore((s) => s.setLoading);
  const loading = useUserStore((s) => s.loading);
  const hasCompletedOnboarding = useUserStore((s) => s.hasCompletedOnboarding);
  const hasHydrated = useUserStore.persist?.hasHydrated();
  const [showSplash, setShowSplash] = useState(true);
  const [lastUserId, setLastUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log("🔐 Auth state changed:", firebaseUser?.email);
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, [setUser, setLoading]);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Check if this is a new user and reset onboarding
  useEffect(() => {
    if (user && hasHydrated) {
      const currentUserId = user.uid;
      if (lastUserId !== currentUserId) {
        console.log("👤 New user detected:", user.email);
        console.log("📋 hasCompletedOnboarding:", hasCompletedOnboarding);
        setLastUserId(currentUserId);
      }
    } else if (!user && lastUserId) {
      setLastUserId(null);
    }
  }, [user, hasHydrated, lastUserId, hasCompletedOnboarding]);

  if (loading || showSplash || !hasHydrated) {
    return <SplashScreen />;
  }

  console.log("🔍 Rendering state:", {
    user: user?.email,
    hasCompletedOnboarding,
    hasHydrated,
  });

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

 
  if (!hasCompletedOnboarding) {
    console.log("🚀 Showing onboarding wizard");
    return (
      <>
        <StatusBar
          style={effective === "dark" ? "light" : "dark"}
          backgroundColor={colors.headerBg}
        />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="auth" />
        </Stack>
      </>
    );
  }

  console.log("✅ Showing main app");

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

