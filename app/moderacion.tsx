import React, { useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet, Modal, Image } from "react-native";
import { useConfesionesStore } from "./store/useConfesionesStore";
import { useThemeColors } from "./hooks/useThemeColors";
import type { Confesion } from "./data/seed";

export default function Moderacion() {
  const { colors } = useThemeColors();
  const pendientes = useConfesionesStore((s) => s.pendientes);
  const approve = useConfesionesStore((s) => s.approve);
  const reject = useConfesionesStore((s) => s.reject);

  const [selected, setSelected] = useState<Confesion | null>(null);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <FlatList
        data={pendientes}
        keyExtractor={(x) => String(x.id)}
        contentContainerStyle={{ gap: 12, padding: 16 }}
        ListEmptyComponent={
          <Text style={{ color: colors.subtle, textAlign: "center" }}>
            No hay pendientes
          </Text>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => setSelected(item)}
            style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <Text style={[styles.category, { color: colors.subtle }]}>{item.category}</Text>
            <Text
              numberOfLines={3}
              style={[styles.content, { color: colors.text }]}
            >
              {item.content}
            </Text>
            {item.image ? (
              <Image source={item.image} style={{ width: "100%", height: 180, borderRadius: 10, marginTop: 8 }} />
            ) : null}
            <View style={styles.row}>
              <Pressable
                style={[styles.btn, { borderColor: colors.border }]}
                onPress={() => approve(item.id)}
              >
                <Text style={[styles.btnText, { color: colors.primary }]}>Aprobar</Text>
              </Pressable>
              <Pressable
                style={[styles.btn, { borderColor: colors.border }]}
                onPress={() => reject(item.id)}
              >
                <Text style={[styles.btnText, { color: "#E5484D" }]}>Rechazar</Text>
              </Pressable>
            </View>
          </Pressable>
        )}
      />

    
      <Modal
        visible={!!selected}
        transparent
        animationType="slide"
        onRequestClose={() => setSelected(null)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: colors.primary }]}>
          <View style={[styles.modalBox, { backgroundColor: colors.surface }]}>
            {selected && (
              <>
                <Text style={[styles.modalCategory, { color: colors.subtle }]}>
                  {selected.category}
                </Text>
                <Text style={[styles.modalContent, { color: colors.text }]}>
                  {selected.content}
                </Text>
                {selected.image ? (
                  <Image source={selected.image} style={{ width: "100%", height: 220, borderRadius: 10, marginTop: 8 }} />
                ) : null}
                <View style={styles.modalButtons}>
                  <Pressable
                    style={[styles.btn, { borderColor: colors.border }]}
                    onPress={() => {
                      approve(selected.id);
                      setSelected(null);
                    }}
                  >
                    <Text style={[styles.btnText, { color: colors.primary }]}>
                      Aprobar
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[styles.btn, { borderColor: colors.border }]}
                    onPress={() => {
                      reject(selected.id);
                      setSelected(null);
                    }}
                  >
                    <Text style={[styles.btnText, { color: "#E5484D" }]}>
                      Rechazar
                    </Text>
                  </Pressable>
                  <Pressable onPress={() => setSelected(null)}>
                    <Text style={{ color: colors.subtle, marginTop: 10, textAlign: "center" }}>
                      Cerrar
                    </Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
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
  btnText: { fontWeight: "700" },


  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 24,
  },
  modalBox: {
    borderRadius: 16,
    padding: 20,
    width: "100%",
    gap: 10,
  },
  modalCategory: { fontSize: 14, fontWeight: "600" },
  modalContent: { fontSize: 18, marginVertical: 8 },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
});
