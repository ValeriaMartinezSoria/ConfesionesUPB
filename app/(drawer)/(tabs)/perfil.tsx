import React from "react";
import { View, Text, Switch, Button, StyleSheet } from "react-native";
import { useThemeColors } from "../../hooks/useThemeColors";
import { useRouter } from "expo-router";
import { useUIStore } from "../../store/uiStore";

export default function Perfil() {
  const { colors } = useThemeColors();
  const router = useRouter();
  const isAdmin = useUIStore((s) => s.isAdmin);
  const toggleAdmin = useUIStore((s) => s.toggleAdmin);
  const theme = useUIStore((s) => s.theme);
  const toggleTheme = useUIStore((s) => s.toggleTheme);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.text }]}>Modo admin</Text>
          <Switch value={isAdmin} onValueChange={toggleAdmin} />
        </View>
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.text }]}>Tema</Text>
          <Button title={theme === "dark" ? "Dark" : "Light"} onPress={toggleTheme} />
        </View>
        <Button title="Moderación" onPress={() => router.push("/moderacion")} disabled={!isAdmin} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16 },
  card: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 16 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  label: { fontSize: 16, fontWeight: "600" }
});
