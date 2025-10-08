import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useConfesionesStore } from "../../store/useConfesionesStore";
import { useUserStore } from "../../store/useUserStore";
import { useThemeColors } from "../../hooks/useThemeColors";
import type { Confesion, Category } from "../../data/seed";
import { Image } from "react-native"; 

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

const cardShadow =
  Platform.OS === "ios"
    ? {
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
    }
    : { elevation: 2 };

export default function ConfesionesList() {
  const { colors, effective } = useThemeColors();
  const isLight = effective === "light";
  const router = useRouter();

  const getAprobadasSorted = useConfesionesStore((s) => s.getAprobadasSorted);
  const toggleLike = useConfesionesStore((s) => s.toggleLike);
  const likedIds = useConfesionesStore((s) => s.likedIds);
  const hasHydrated = useConfesionesStore.persist.hasHydrated();

  
  const carrerasDeInteres = useUserStore((s) => s.carrerasDeInteres);


  if (!hasHydrated) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.subtle, marginTop: 10 }}>
          Cargando confesiones...
        </Text>
      </View>
    );
  }


  const [selectedCategory, setSelectedCategory] = useState<"all" | Category>("all");
  const categories: Array<"all" | Category> = ["all", "amor", "academico", "random"];

  const data = useMemo<Confesion[]>(() => {
    const sorted = getAprobadasSorted(carrerasDeInteres);
    if (selectedCategory === "all") return sorted;
    return sorted.filter((c) => c.category === selectedCategory);
  }, [getAprobadasSorted, carrerasDeInteres, selectedCategory]);

  const catColor = isLight ? colors.primary : colors.secondary;
  const likedColor = isLight ? colors.primary : colors.secondary;


  if (!data.length) {
    return (
      <View style={[styles.empty, { backgroundColor: colors.background }]}>
        <Ionicons name="chatbubbles-outline" size={40} color={colors.subtle} />
        <Text style={[styles.emptyText, { color: colors.subtle }]}>
          No hay confesiones aún.
        </Text>
      </View>
    );
  }

  const displayName = (cat: "all" | Category) => {
    if (cat === "all") return "Todos";
    if (cat === "academico") return "Académico";
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  };


  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Mostrar indicador de filtrado por interés */}
      {carrerasDeInteres.length > 0 && (
        <View style={[styles.interestBanner, { backgroundColor: colors.primary + "15", borderColor: colors.primary }]}>
          <Ionicons name="star" size={16} color={colors.primary} />
          <Text style={[styles.interestText, { color: colors.primary }]}>
            Mostrando primero: {carrerasDeInteres.slice(0, 2).join(", ")}{carrerasDeInteres.length > 2 ? ` y ${carrerasDeInteres.length - 2} más` : ""}
          </Text>
        </View>
      )}

      <View style={styles.filterRow}>
        {categories.map((cat) => (
          <Pressable
            key={cat}
            onPress={() => setSelectedCategory(cat)}
            style={[
              styles.filterPill,
              {
                borderColor: colors.border,
                backgroundColor:
                  selectedCategory === cat ? colors.primary : "transparent",
              },
            ]}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color:
                    selectedCategory === cat ? colors.surface : colors.text,
                },
              ]}
            >
              {displayName(cat)}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={data}
        contentContainerStyle={styles.list}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => {
          const liked = likedIds.includes(item.id);
          const isFromInterest = carrerasDeInteres.includes(item.carrera as any);

          return (
            <Pressable
              style={[
                styles.card,
                {
                  borderColor: isFromInterest ? colors.primary : colors.border,
                  backgroundColor: colors.surface,
                  borderWidth: isFromInterest ? 2 : 1,
                },
                cardShadow,
              ]}
              onPress={() =>
                router.push(`/(drawer)/(tabs)/confesion/${item.id}`)
              }
            >
              <View style={styles.rowBetween}>
                <View style={{ flex: 1 }}>
                  <View style={styles.row}>
                    <Ionicons
                      name="eye-off-outline"
                      size={14}
                      color={colors.subtle}
                    />
                    <Text style={[styles.nexo, { color: colors.subtle }]}>
                      {item.nexo}
                    </Text>
                    {isFromInterest && (
                      <Ionicons name="star" size={12} color={colors.primary} />
                    )}
                  </View>
                  <Text style={[styles.time, { color: colors.subtle }]}>
                    {timeAgo(item.date)}
                  </Text>
                </View>
                <View style={[styles.pill, { borderColor: catColor }]}>
                  <Text style={[styles.pillText, { color: catColor }]}>
                    {item.category.charAt(0).toUpperCase() +
                      item.category.slice(1)}
                  </Text>
                </View>
              </View>

              <Text
                style={[styles.content, { color: colors.text }]}
                numberOfLines={3}
              >
                {item.content}
              </Text>
              {item.image && (
              <Image
               source={item.image}
                style={{
               width: "100%",
               height: 200,
               borderRadius: 12,
                marginTop: 8,
    }}
    resizeMode="cover"
  />
)}


              <View style={styles.rowBetween}>
                <Text style={[styles.carrera, { color: isFromInterest ? colors.primary : colors.subtle }]}>
                  📚 {item.carrera}
                </Text>
              </View>

              <View style={styles.rowBetween}>
                <Text style={[styles.meta, { color: colors.subtle }]}>
                  {item.likes} {item.likes === 1 ? "like" : "likes"}
                </Text>
                <Pressable
                  hitSlop={8}
                  style={[
                    styles.likeBtn,
                    {
                      borderColor: colors.border,
                      backgroundColor: colors.surface,
                    },
                  ]}
                  onPress={() => toggleLike(item.id)}
                >
                  <Ionicons
                    name={liked ? "heart" : "heart-outline"}
                    size={18}
                    color={liked ? likedColor : colors.tabInactive}
                  />
                  <Text
                    style={[
                      styles.likeText,
                      {
                        color: liked ? likedColor : colors.tabInactive,
                      },
                    ]}
                  >
                    {liked ? "Te gusta" : "Me gusta"}
                  </Text>
                </Pressable>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, gap: 14 },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  filterPill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  filterText: { fontSize: 13, fontWeight: "600" },
  interestBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  interestText: {
    fontSize: 12,
    fontWeight: "600",
    flex: 1,
  },
  card: { borderRadius: 16, borderWidth: 1, padding: 14, gap: 10 },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  row: { flexDirection: "row", alignItems: "center", gap: 6 },
  nexo: { fontSize: 12, fontWeight: "600" },
  time: { fontSize: 11 },
  content: { fontSize: 16 },
  carrera: {
    fontSize: 12,
    fontWeight: "600",
    fontStyle: "italic",
  },
  meta: { fontSize: 12 },
  likeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  likeText: { fontSize: 12, fontWeight: "700" },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8 },
  emptyText: { fontSize: 13 },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  pillText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "capitalize",
  },
});
