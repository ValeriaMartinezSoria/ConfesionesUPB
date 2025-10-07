import React from "react";
import { View, Text, StyleSheet, Platform, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, Redirect, useRouter, Stack } from "expo-router";
import { useConfesionesStore } from "../../../store/useConfesionesStore";
import { useThemeColors } from "../../../hooks/useThemeColors";
import type { Confesion } from "../../../data/seed";
import { Ionicons } from "@expo/vector-icons";

export default function ConfesionDetail() {
  const { id } = useLocalSearchParams();
  const { colors } = useThemeColors();
  const confesion = useConfesionesStore((s) =>
    s.aprobadas.find((c) => String(c.id) === String(id))
  );

  if (!confesion) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Confesión no encontrada.</Text>
      </View>
    );
  }

  const cardShadow =
    Platform.OS === "ios"
      ? { shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } }
      : { elevation: 2 };

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
    >
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.border },
          cardShadow,
        ]}
      >
        <View style={styles.header}>
          <Ionicons name="eye-off-outline" size={16} color={colors.subtle} />
          <Text style={[styles.nexo, { color: colors.subtle }]}>{confesion.nexo}</Text>
        </View>

        <Text style={[styles.content, { color: colors.text }]}>{confesion.content}</Text>

        {/* 🎓 Nueva sección con la carrera */}
        <View style={styles.infoBox}>
          <Ionicons name="school-outline" size={18} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.text }]}>
            {confesion.carrera || "Carrera no especificada"}
          </Text>
        </View>

        {/* 📂 Categoría */}
        <View style={styles.infoBox}>
          <Ionicons name="pricetag-outline" size={18} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.text }]}>
            {confesion.category.charAt(0).toUpperCase() + confesion.category.slice(1)}
          </Text>
        </View>

        {/* ❤️ Likes */}
        <View style={styles.infoBox}>
          <Ionicons name="heart-outline" size={18} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.text }]}>
            {confesion.likes} {confesion.likes === 1 ? "like" : "likes"}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16 },
  card: { borderWidth: 1, borderRadius: 16, padding: 16, gap: 10 },
  header: { flexDirection: "row", alignItems: "center", gap: 6 },
  nexo: { fontSize: 13, fontWeight: "600" },
  content: { fontSize: 16, lineHeight: 22, marginVertical: 8 },
  infoBox: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 6 },
  infoText: { fontSize: 14 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});