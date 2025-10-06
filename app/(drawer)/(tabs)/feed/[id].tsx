import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { useLocalSearchParams, Redirect } from "expo-router";
import { useConfesionesStore } from "../../../store/useConfesionesStore";
import { useThemeColors } from "../../../hooks/useThemeColors";
import type { Confesion } from "../../../data/seed";

export default function FeedDetail() {
  const { colors } = useThemeColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const aprobadas = useConfesionesStore((s: { aprobadas: Confesion[] }) => s.aprobadas);
  const conf = aprobadas.find((c: Confesion) => String(c.id) === String(id));
  if (!conf) return <Redirect href="/(drawer)/(tabs)" />;
  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.nexo, { color: colors.subtle }]}>{conf.category}</Text>
        <Text style={[styles.content, { color: colors.text }]}>{conf.content}</Text>
        <Text style={[styles.meta, { color: colors.subtle }]}>{conf.likes} {conf.likes === 1 ? "like" : "likes"}</Text>
      </View>
    </View>
  );
}

const cardShadow = Platform.OS === "ios"
  ? { shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } }
  : { elevation: 2 };

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16 },
  card: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 10, ...cardShadow },
  nexo: { fontSize: 12, fontWeight: "600" },
  content: { fontSize: 16 },
  meta: { fontSize: 12 }
});
