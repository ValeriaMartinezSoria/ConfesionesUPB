import React from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { useConfesionesStore } from "./store/useConfesionesStore";
import { useThemeColors } from "./hooks/useThemeColors";
import type { Confesion } from "./data/seed";

export default function Moderacion() {
  const { colors } = useThemeColors();
  const pendientes = useConfesionesStore((s) => s.pendientes);
  const approve = useConfesionesStore((s) => s.approve);
  const reject = useConfesionesStore((s) => s.reject);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <FlatList
        data={pendientes}
        keyExtractor={(x) => String(x.id)}
        contentContainerStyle={{ gap: 12, padding: 16 }}
        ListEmptyComponent={<Text style={{ color: colors.subtle, textAlign: "center" }}>No hay pendientes</Text>}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.category, { color: colors.subtle }]}>{item.category}</Text>
            <Text style={[styles.content, { color: colors.text }]}>{item.content}</Text>
            <View style={styles.row}>
              <Pressable style={[styles.btn, { borderColor: colors.border }]} onPress={() => approve(item.id)}>
                <Text style={[styles.btnText, { color: colors.primary }]}>Aprobar</Text>
              </Pressable>
              <Pressable style={[styles.btn, { borderColor: colors.border }]} onPress={() => reject(item.id)}>
                <Text style={[styles.btnText, { color: "#E5484D" }]}>Rechazar</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  card: { borderRadius: 16, borderWidth: 1, padding: 14, gap: 10 },
  category: { fontSize: 12, fontWeight: "600" },
  content: { fontSize: 16 },
  row: { flexDirection: "row", gap: 10, justifyContent: "flex-end", marginTop: 6 },
  btn: { borderWidth: 1, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 12 },
  btnText: { fontWeight: "700" }
});
