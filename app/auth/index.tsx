import React from "react";
import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import { useThemeColors } from "../hooks/useThemeColors";

export default function Auth() {
  const { colors } = useThemeColors();
  return (
    <View style={{ flex: 1, gap: 12, alignItems: "center", justifyContent: "center", padding: 24 }}>
      <Text style={{ fontSize: 22, fontWeight: "900", color: colors.text }}>Confesiones UPB</Text>
      <Text style={{ color: colors.subtle, textAlign: "center" }}>Ingreso simple para comenzar.</Text>
      <Pressable onPress={() => router.replace("/(drawer)/(tabs)")} style={{ marginTop: 8, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 14, backgroundColor: colors.primary }}>
        <Text style={{ color: "white", fontWeight: "700" }}>Entrar</Text>
      </Pressable>
    </View>
  );
}
