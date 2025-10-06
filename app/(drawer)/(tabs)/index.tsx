import React, { useMemo } from "react";
import { View, Text, FlatList, Pressable, StyleSheet, Platform } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useConfesionesStore } from "../../store/useConfesionesStore";
import { useThemeColors } from "../../hooks/useThemeColors";
import type { Confesion } from "../../data/seed";

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Ahora";
  if (m < 60) return `Hace ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `Hace ${h} h`;
  const d = Math.floor(h / 24);
  if (d < 2) return "Hace un día";
  return `Hace ${d} d`;
}

const cardShadow = Platform.OS === "ios"
  ? { shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } }
  : { elevation: 2 };

export default function ConfesionesList() {
  const { colors, effective } = useThemeColors();
  const isLight = effective === "light";
  const router = useRouter();
  const aprobadas = useConfesionesStore((s) => s.aprobadas);
  const toggleLike = useConfesionesStore((s) => s.toggleLike);
  const likedIds = useConfesionesStore((s) => s.likedIds);
  const data = useMemo<Confesion[]>(() => [...aprobadas].sort((a, b) => b.date - a.date), [aprobadas]);

  const catColor = isLight ? colors.primary : colors.secondary;
  const likedColor = isLight ? colors.primary : colors.secondary;

  if (!data.length) {
    return (
      <View style={[styles.empty, { backgroundColor: colors.background }]}>
        <Ionicons name="chatbubbles-outline" size={40} color={colors.subtle} />
        <Text style={[styles.emptyText, { color: colors.subtle }]}>No hay confesiones aún.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.list}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => {
        const liked = likedIds.includes(item.id);
        return (
          <Pressable
            style={[styles.card, { borderColor: colors.border, backgroundColor: colors.surface }, cardShadow]}
            onPress={() => router.push(`/(drawer)/(tabs)/confesion/${item.id}`)}
          >
            <View style={styles.rowBetween}>
              <View style={{ flex: 1 }}>
                <View style={styles.row}>
                  <Ionicons name="eye-off-outline" size={14} color={colors.subtle} />
                  <Text style={[styles.nexo, { color: colors.subtle }]}>{item.nexo}</Text>
                </View>
                <Text style={[styles.time, { color: colors.subtle }]}>{timeAgo(item.date)}</Text>
              </View>
              <View style={[styles.pill, { borderColor: catColor, backgroundColor: "transparent" }]}>
                <Text style={[styles.pillText, { color: catColor }]}>{item.category}</Text>
              </View>
            </View>
            <Text style={[styles.content, { color: colors.text }]} numberOfLines={3}>{item.content}</Text>
            <View style={styles.rowBetween}>
              <Text style={[styles.meta, { color: colors.subtle }]}>{item.likes} {item.likes === 1 ? "like" : "likes"}</Text>
              <Pressable
                hitSlop={8}
                style={[styles.likeBtn, { borderColor: colors.border, backgroundColor: colors.surface }]}
                onPress={() => toggleLike(item.id)}
              >
                <Ionicons name={liked ? "heart" : "heart-outline"} size={18} color={liked ? likedColor : colors.tabInactive} />
                <Text style={[styles.likeText, { color: liked ? likedColor : colors.tabInactive }]}>{liked ? "Te gusta" : "Me gusta"}</Text>
              </Pressable>
            </View>
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, gap: 14 },
  card: { borderRadius: 16, borderWidth: 1, padding: 14, gap: 10 },
  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  row: { flexDirection: "row", alignItems: "center", gap: 6 },
  nexo: { fontSize: 12, fontWeight: "600" },
  time: { fontSize: 11 },
  content: { fontSize: 16 },
  meta: { fontSize: 12 },
  likeBtn: { flexDirection: "row", alignItems: "center", gap: 6, borderWidth: 1, borderRadius: 10, paddingVertical: 6, paddingHorizontal: 10 },
  likeText: { fontSize: 12, fontWeight: "700" },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8 },
  emptyText: { fontSize: 13 },
  pill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, borderWidth: 1 },
  pillText: { fontSize: 11, fontWeight: "700", textTransform: "capitalize" }
});
