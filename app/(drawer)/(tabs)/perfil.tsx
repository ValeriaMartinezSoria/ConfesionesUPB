import React from "react";
import { View, Text, StyleSheet, Switch, Pressable } from "react-native";
import { useThemeColors } from "../../hooks/useThemeColors";
import { useUIStore, ThemePref } from "../../store/uiStore";
import { useRouter } from "expo-router";

function Chip({
  label,
  selected,
  onPress,
  color,
  border,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  color: string;
  border: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        { borderColor: selected ? color : border, backgroundColor: "transparent" },
      ]}
      android_ripple={{ color: border }}
      accessibilityRole="button"
    >
      <Text style={[styles.chipText, { color: selected ? color : border }]}>{label}</Text>
    </Pressable>
  );
}

export default function Perfil() {
  const { colors } = useThemeColors();
  const router = useRouter();
  const isAdmin = useUIStore((s) => s.isAdmin);
  const toggleAdmin = useUIStore((s) => s.toggleAdmin);
  const theme = useUIStore((s) => s.theme);
  const setTheme = useUIStore((s) => s.setTheme);

  const set = (t: ThemePref) => () => setTheme(t);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Apariencia</Text>
        <View style={styles.rowChips}>
          <Chip label="Claro" selected={theme === "light"} onPress={set("light")} color={colors.primary} border={colors.border} />
          <Chip label="Oscuro" selected={theme === "dark"} onPress={set("dark")} color={colors.secondary} border={colors.border} />
          <Chip label="Sistema" selected={theme === "system"} onPress={set("system")} color={colors.text} border={colors.border} />
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.text }]}>Modo admin</Text>
          <Switch value={isAdmin} onValueChange={toggleAdmin} />
        </View>
        <Pressable
          style={[styles.btn, { borderColor: colors.border }]}
          onPress={() => router.push("/moderacion" as never)}
          disabled={!isAdmin}
          android_ripple={{ color: colors.border }}
        >
          <Text style={[styles.btnText, { color: isAdmin ? colors.primary : colors.subtle }]}>Abrir Moderación</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16, gap: 16 },
  card: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 12 },
  sectionTitle: { fontSize: 16, fontWeight: "700" },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  label: { fontSize: 16, fontWeight: "600" },
  btn: { borderWidth: 1, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 12, alignSelf: "flex-start" },
  btnText: { fontWeight: "700" },
  rowChips: { flexDirection: "row", gap: 8 },
  chip: { paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1, borderRadius: 999 },
  chipText: { fontSize: 13, fontWeight: "700" },
});
