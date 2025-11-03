import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { Redirect } from "expo-router";
import { useUserStore } from "../_store/useUserStore";
import { useAppProfile } from "../_hooks/useAppProfile";
import { useThemeColors } from "../_hooks/useThemeColors";

interface RequireAdminProps {
  children: React.ReactNode;
}

export default function RequireAdmin({ children }: RequireAdminProps) {
  const user = useUserStore((s) => s.user);
  const userLoading = useUserStore((s) => s.loading);
  const { profile, loading: profileLoading } = useAppProfile();
  const { colors } = useThemeColors();

  if (userLoading || profileLoading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/auth" />;
  }

  if (profile?.role !== "admin") {
    return <Redirect href="/(drawer)/(tabs)/perfil" />;
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
