import React from "react";
import { View, Text, StyleSheet, Switch, Pressable, Alert, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "../../hooks/useThemeColors";
import { useUIStore, ThemePref } from "../../store/uiStore";
import { useUserStore, CARRERAS_DISPONIBLES, FACULTADES_DISPONIBLES } from "../../store/useUserStore";
import { useRouter } from "expo-router";
import type { Category } from "../../data/seed";

const CATEGORIES_INFO: Array<{ id: Category; name: string; icon: any }> = [
  { id: "amor", name: "Amor", icon: "heart" },
  { id: "academico", name: "Académico", icon: "book" },
  { id: "random", name: "Random", icon: "chatbubbles" },
  { id: "confesion", name: "Confesión", icon: "lock-closed" },
];

function Chip({
  label,
  selected,
  onPress,
  color,
  border,
  textColor,
  icon,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  color: string;
  border: string;
  textColor: string;
  icon?: any;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          borderColor: selected ? color : border,
          backgroundColor: selected ? color + "15" : "transparent",
          borderWidth: selected ? 2 : 1,
        },
      ]}
      android_ripple={{ color: border }}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={14}
          color={selected ? color : textColor}
        />
      )}
      <Text style={[styles.chipText, { color: selected ? color : textColor }]}>
        {label}
      </Text>
      {selected && (
        <Ionicons name="checkmark-circle" size={14} color={color} />
      )}
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

  const facultadesDeInteres = useUserStore((s) => s.facultadesDeInteres);
  const addFacultadDeInteres = useUserStore((s) => s.addFacultadDeInteres);
  const removeFacultadDeInteres = useUserStore((s) => s.removeFacultadDeInteres);

  const preferences = useUserStore((s) => s.preferences);
  const addCategoryOfInterest = useUserStore((s) => s.addCategoryOfInterest);
  const removeCategoryOfInterest = useUserStore((s) => s.removeCategoryOfInterest);

  const logout = useUserStore((s) => s.logout);
  const user = useUserStore((s) => s.user);

  const set = (t: ThemePref) => () => setTheme(t);

  const handleCarreraPress = (carrera: string) => {
    if (carrerasDeInteres.includes(carrera as any)) {
      removeCarreraDeInteres(carrera as any);
    } else {
      addCarreraDeInteres(carrera as any);
    }
  };

  const handleFacultadPress = (facultad: string) => {
    if (facultadesDeInteres.includes(facultad as any)) {
      removeFacultadDeInteres(facultad as any);
    } else {
      addFacultadDeInteres(facultad as any);
    }
  };

  const handleCategoryPress = (category: Category) => {
    if (preferences.categoriesOfInterest.includes(category)) {
      removeCategoryOfInterest(category);
    } else {
      addCategoryOfInterest(category);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro de que deseas cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar sesión",
          style: "destructive",
          onPress: async () => {
            try {
              await logout();
              router.replace("/auth");
            } catch (error) {
              console.error("Error al cerrar sesión:", error);
              Alert.alert("Error", "No se pudo cerrar sesión. Intenta nuevamente.");
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <View style={styles.userHeader}>
          <View style={[styles.avatar, { backgroundColor: colors.primary + "20" }]}>
            <Ionicons name="person" size={32} color={colors.primary} />
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.userEmail, { color: colors.text }]}>
              {user?.email || "Usuario"}
            </Text>
            <Text style={[styles.userLabel, { color: colors.subtle }]}>
              Cuenta activa
            </Text>
          </View>
        </View>
      </View>

     
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <View style={styles.sectionHeader}>
          <Ionicons name="school" size={20} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Facultades de Interés
          </Text>
        </View>
        <Text style={[styles.subtitle, { color: colors.subtle }]}>
          Selecciona las facultades que te interesan
        </Text>
        <View style={styles.chipsGrid}>
          {FACULTADES_DISPONIBLES.map((facultad) => {
            const isSelected = facultadesDeInteres.includes(facultad);
            return (
              <Chip
                key={facultad}
                label={facultad}
                selected={isSelected}
                onPress={() => handleFacultadPress(facultad)}
                color={colors.primary}
                border={colors.border}
                textColor={colors.text}
                icon="school-outline"
              />
            );
          })}
        </View>
        {facultadesDeInteres.length > 0 && (
          <View style={[styles.badge, { backgroundColor: colors.primary + "15" }]}>
            <Ionicons name="checkmark-circle" size={14} color={colors.primary} />
            <Text style={[styles.badgeText, { color: colors.primary }]}>
              {facultadesDeInteres.length} seleccionada{facultadesDeInteres.length !== 1 ? "s" : ""}
            </Text>
          </View>
        )}
      </View>

     
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <View style={styles.sectionHeader}>
          <Ionicons name="book" size={20} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Carreras de Interés
          </Text>
        </View>
        <Text style={[styles.subtitle, { color: colors.subtle }]}>
          Las confesiones de estas carreras aparecerán primero en tu feed
        </Text>
        <View style={styles.chipsGrid}>
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
                icon="ribbon-outline"
              />
            );
          })}
        </View>
        {carrerasDeInteres.length > 0 && (
          <View style={[styles.badge, { backgroundColor: colors.primary + "15" }]}>
            <Ionicons name="checkmark-circle" size={14} color={colors.primary} />
            <Text style={[styles.badgeText, { color: colors.primary }]}>
              {carrerasDeInteres.length} seleccionada{carrerasDeInteres.length !== 1 ? "s" : ""}
            </Text>
          </View>
        )}
      </View>

     
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <View style={styles.sectionHeader}>
          <Ionicons name="grid" size={20} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Categorías Preferidas
          </Text>
        </View>
        <Text style={[styles.subtitle, { color: colors.subtle }]}>
          Personaliza el tipo de contenido que prefieres ver
        </Text>
        <View style={styles.chipsGrid}>
          {CATEGORIES_INFO.map((cat) => {
            const isSelected = preferences.categoriesOfInterest.includes(cat.id);
            return (
              <Chip
                key={cat.id}
                label={cat.name}
                selected={isSelected}
                onPress={() => handleCategoryPress(cat.id)}
                color={colors.primary}
                border={colors.border}
                textColor={colors.text}
                icon={cat.icon}
              />
            );
          })}
        </View>
      </View>

      {/* Apariencia */}
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <View style={styles.sectionHeader}>
          <Ionicons name="color-palette" size={20} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Apariencia
          </Text>
        </View>
        <Text style={[styles.subtitle, { color: colors.subtle }]}>
          Selecciona el tema de la aplicación
        </Text>
        <View style={styles.rowChips}>
          <Chip
            label="Claro"
            selected={theme === "light"}
            onPress={set("light")}
            color={colors.primary}
            border={colors.border}
            textColor={colors.text}
            icon="sunny-outline"
          />
          <Chip
            label="Oscuro"
            selected={theme === "dark"}
            onPress={set("dark")}
            color={colors.primary}
            border={colors.border}
            textColor={colors.text}
            icon="moon-outline"
          />
          <Chip
            label="Sistema"
            selected={theme === "system"}
            onPress={set("system")}
            color={colors.primary}
            border={colors.border}
            textColor={colors.text}
            icon="phone-portrait-outline"
          />
        </View>
      </View>

     
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="shield-checkmark" size={20} color={colors.text} />
            <Text style={[styles.label, { color: colors.text }]}>Modo Administrador</Text>
          </View>
          <Switch
            value={isAdmin}
            onValueChange={toggleAdmin}
            trackColor={{ false: colors.border, true: colors.primary + "60" }}
            thumbColor={isAdmin ? colors.primary : colors.subtle}
          />
        </View>
        {isAdmin && (
          <Pressable
            style={[
              styles.adminBtn,
              { backgroundColor: colors.primary, borderColor: colors.primary },
            ]}
            onPress={() => router.push("/moderacion" as never)}
            android_ripple={{ color: colors.primary + "80" }}
          >
            <Ionicons name="shield" size={18} color={colors.surface} />
            <Text style={[styles.adminBtnText, { color: colors.surface }]}>
              Abrir Panel de Moderación
            </Text>
          </Pressable>
        )}
      </View>

    
      <Pressable
        style={[
          styles.logoutBtn,
          { borderColor: "#e74c3c", backgroundColor: "#e74c3c" },
        ]}
        onPress={handleLogout}
        android_ripple={{ color: "#c0392b" }}
      >
        <Ionicons name="log-out" size={20} color="white" />
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </Pressable>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 16,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  userHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  userInfo: {
    flex: 1,
    gap: 4,
  },
  userEmail: {
    fontSize: 16,
    fontWeight: "700",
  },
  userLabel: {
    fontSize: 13,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  chipsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  rowChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
  },
  adminBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  adminBtnText: {
    fontWeight: "700",
    fontSize: 14,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 14,
    marginTop: 8,
  },
  logoutText: {
    color: "white",
    fontWeight: "700",
    fontSize: 15,
  },
  bottomSpacer: {
    height: 20,
  },
});
