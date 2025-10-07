import React from "react";
import { View, Text } from "react-native";
import { useThemeColors } from "../hooks/useThemeColors";

export default function About() {
  const { colors } = useThemeColors();
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 16, gap: 8, backgroundColor: colors.background }}>
      <Text style={{ fontSize: 18, fontWeight: "900", color: colors.text }}>Confesiones UPB</Text>
      <Text style={{ textAlign: "center", color: colors.subtle }}>Anónimo, publlicación simple y con buena vibra.</Text>
    </View>
  );
}
