import React from "react";
import { View, Text, FlatList, Button, StyleSheet } from "react-native";
import { useThemeColors } from "./hooks/useThemeColors";
import { useConfesionesStore } from "./store/useConfesionesStore";
import type { Confesion } from "./data/seed";

export default function Moderacion() {
  const { colors } = useThemeColors();
  const { pendientes, approve, reject } = useConfesionesStore();

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <FlatList
        data={pendientes}
        keyExtractor={(x: Confesion) => String(x.id)}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.texto, { color: colors.text }]}>{item.content}</Text>
            <View style={styles.row}>
              <Button title="Aprobar" onPress={() => approve(item.id)} />
              <Button title="Rechazar" color="#DC2626" onPress={() => reject(item.id)} />
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: colors.subtle, padding: 16 }}>Sin pendientes</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  card: { borderRadius: 12, borderWidth: 1, padding: 16, marginBottom: 12 },
  texto: { fontSize: 16 },
  row: { flexDirection: "row", gap: 12, marginTop: 8 }
});
