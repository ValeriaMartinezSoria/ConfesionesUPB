import React from "react";
import { Stack } from "expo-router";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { useThemeColors } from "../hooks/useThemeColors";
import { useAppearance, type Mode } from "../store/useAppearance";

type ThemeColors = ReturnType<typeof useThemeColors>["colors"];

const createStyles = (c: ThemeColors) => StyleSheet.create({
  container: { flex: 1, gap: 16, alignItems: "center", justifyContent: "center", backgroundColor: c.background, padding: 24 },
  title: { fontSize: 24, fontWeight: "700", color: c.text },
  row: { flexDirection: "row", gap: 10 },
  chip: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1, borderColor: c.border, backgroundColor: c.surface },
  chipActive: { borderColor: c.primary },
  chipText: { color: c.text, fontWeight: "700" },
  copy: { textAlign: "center", color: c.subtle }
});

const modes: { key: Mode; label: string }[] = [
  { key: "system", label: "Sistema" },
  { key: "light", label: "Claro" },
  { key: "dark", label: "Oscuro" }
];

export default function ProfileScreen() {
  const { colors } = useThemeColors();
  const mode = useAppearance((s) => s.mode);
  const setMode = useAppearance((s) => s.setMode);
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Perfil" }} />
      <Text style={styles.title}>Apariencia</Text>
      <View style={styles.row}>
        {modes.map((m) => (
          <Pressable key={m.key} onPress={() => setMode(m.key)} style={[styles.chip, mode === m.key && styles.chipActive]}>
            <Text style={styles.chipText}>{m.label}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.copy}>TATA QUISPE.</Text>
    </View>
  );
}
