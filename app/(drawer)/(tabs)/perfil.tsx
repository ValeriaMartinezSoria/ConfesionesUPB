import React from "react";
import { View, Text, StyleSheet, Switch, Pressable } from "react-native";
import { useThemeColors } from "../../hooks/useThemeColors";
import { useUIStore, ThemePref } from "../../store/uiStore";
import { useUserStore, CARRERAS_DISPONIBLES } from "../../store/useUserStore";
import { useRouter } from "expo-router";

function Chip({
  label,
  selected,
  onPress,
  color,
  border,
  textColor,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  color: string;
  border: string;
  textColor: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          borderColor: selected ? color : border,
          backgroundColor: selected ? color : "transparent"
        },
      ]}
      android_ripple={{ color: border }}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      <Text style={[styles.chipText, { color: selected ? "white" : textColor }]}>{label}</Text>
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

  
  const carrerasDeInteres = useUserStore((s) => s.carrerasDeInteres);
  const addCarreraDeInteres = useUserStore((s) => s.addCarreraDeInteres);
  const removeCarreraDeInteres = useUserStore((s) => s.removeCarreraDeInteres);

  const set = (t: ThemePref) => () => setTheme(t);

  const handleCarreraPress = (carrera: string) => {
    if (carrerasDeInteres.includes(carrera as any)) {
      removeCarreraDeInteres(carrera as any);
    } else {
      addCarreraDeInteres(carrera as any);
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>

      {/* Carreras de InterÃ©s */}
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Carreras de Intereces</Text>
        <Text style={[styles.subtitle, { color: colors.subtle }]}>
          Selecciona las carreras que te interesan para ver sus confesiones primero
        </Text>
        <View style={styles.carrerasGrid}>
          {CARRERAS_DISPONIBLES.map((carrera) => {
            const isSelected = carrerasDeInteres.includes(carrera);
            return (
              <Chip
                key={carrera}
                label={carrera}
                selected={isSelected}
                onPress={() => handleCarreraPress(carrera)}
                color={colors.primary}
                border={colors.border}
                textColor={colors.text}
              />
            );
          })}
        </View>
        {carrerasDeInteres.length > 0 && (
          <Text style={[styles.selectedCount, { color: colors.primary }]}>
            {carrerasDeInteres.length} carrera{carrerasDeInteres.length !== 1 ? 's' : ''} seleccionada{carrerasDeInteres.length !== 1 ? 's' : ''}
          </Text>
        )}
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Apariencia</Text>
        <View style={styles.rowChips}>
          <Chip label="Claro" selected={theme === "light"} onPress={set("light")} color={colors.primary} border={colors.border} textColor={colors.subtle} />
          <Chip label="Oscuro" selected={theme === "dark"} onPress={set("dark")} color={colors.primary} border={colors.border} textColor={colors.subtle} />
          <Chip label="Sistema" selected={theme === "system"} onPress={set("system")} color={colors.primary} border={colors.border} textColor={colors.subtle} />
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
  subtitle: { fontSize: 14, color: '#666', marginBottom: 8 },
  carrerasGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  selectedCount: { fontSize: 12, fontWeight: "600", textAlign: "center", marginTop: 4 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  label: { fontSize: 16, fontWeight: "600" },
  btn: { borderWidth: 1, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 12, alignSelf: "flex-start" },
  btnText: { fontWeight: "700" },
  rowChips: { flexDirection: "row", gap: 8 },
  chip: { paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1, borderRadius: 999 },
  chipText: { fontSize: 13, fontWeight: "700" },
});










