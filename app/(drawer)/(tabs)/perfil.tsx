import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  Pressable,
  Alert,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "../../hooks/useThemeColors";
import { useUIStore, ThemePref } from "../../store/uiStore";
import {
  useUserStore,
  CARRERAS_DISPONIBLES,
  FACULTADES_DISPONIBLES,
} from "../../store/useUserStore";
import { useRouter } from "expo-router";
import type { Category, FacultadGrande } from "../../data/seed";
import { CARRERAS_FIA, CARRERAS_FACED } from "../../data/seed";

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

  const {
    carrerasDeInteres,
    addCarreraDeInteres,
    removeCarreraDeInteres,
    facultadesDeInteres,
    addFacultadDeInteres,
    removeFacultadDeInteres,
    preferences,
    addCategoryOfInterest,
    removeCategoryOfInterest,
    logout,
    user,
  } = useUserStore();

  const set = (t: ThemePref) => () => setTheme(t);

  const toggleSelection = (
    list: string[],
    item: string,
    add: (v: any) => void,
    remove: (v: any) => void
  ) => {
    list.includes(item) ? remove(item) : add(item);
  };

  const handleLogout = async () => {
    Alert.alert("Cerrar sesión", "¿Deseas cerrar sesión?", [
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
    ]);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[styles.contentContainer, { paddingTop: 10 }]}
        showsVerticalScrollIndicator={false}
      >
    
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.userHeader}>
            <View style={[styles.avatar, { backgroundColor: colors.primary + "20" }]}>
              <Ionicons name="person" size={32} color={colors.primary} />
            </View>
            <View style={styles.userInfo}>
              <Text style={[styles.userEmail, { color: colors.text }]}>
                {user?.email || "Usuario"}
              </Text>
              <Text style={[styles.userLabel, { color: colors.subtle }]}>Cuenta activa</Text>
            </View>
          </View>
        </View>


        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="school" size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Facultades de Interés</Text>
          </View>
          <Text style={[styles.subtitle, { color: colors.subtle }]}>
            Selecciona las facultades que te interesan para personalizar tu feed
          </Text>
          
          {/* Card FIA */}
          <View style={[styles.facultadCard, { 
            backgroundColor: colors.secondary + "15", 
            borderColor: colors.secondary 
          }]}>
            <View style={styles.facultadHeader}>
              <View style={[styles.facultadBadge, { backgroundColor: colors.secondary }]}>
                <Text style={[styles.facultadBadgeText, { color: colors.surface }]}>FIA</Text>
              </View>
              <Text style={[styles.facultadTitle, { color: colors.text }]}>
                Facultad de Ingenierías y Arquitectura
              </Text>
            </View>
            <View style={styles.carrerasChips}>
              {CARRERAS_FIA.map((carrera) => (
                <Chip
                  key={carrera}
                  label={carrera}
                  selected={carrerasDeInteres.includes(carrera)}
                  onPress={() =>
                    toggleSelection(
                      carrerasDeInteres,
                      carrera,
                      addCarreraDeInteres,
                      removeCarreraDeInteres
                    )
                  }
                  color={colors.secondary}
                  border={colors.border}
                  textColor={colors.text}
                  icon="construct-outline"
                />
              ))}
            </View>
          </View>

          {/* Card FACED */}
          <View style={[styles.facultadCard, { 
            backgroundColor: colors.success + "15", 
            borderColor: colors.success 
          }]}>
            <View style={styles.facultadHeader}>
              <View style={[styles.facultadBadge, { backgroundColor: colors.success }]}>
                <Text style={[styles.facultadBadgeText, { color: colors.surface }]}>FACED</Text>
              </View>
              <Text style={[styles.facultadTitle, { color: colors.text }]}>
                Facultad de Ciencias Empresariales y Derecho
              </Text>
            </View>
            <View style={styles.carrerasChips}>
              {CARRERAS_FACED.map((carrera) => (
                <Chip
                  key={carrera}
                  label={carrera}
                  selected={carrerasDeInteres.includes(carrera)}
                  onPress={() =>
                    toggleSelection(
                      carrerasDeInteres,
                      carrera,
                      addCarreraDeInteres,
                      removeCarreraDeInteres
                    )
                  }
                  color={colors.success}
                  border={colors.border}
                  textColor={colors.text}
                  icon="briefcase-outline"
                />
              ))}
            </View>
          </View>
        </View>

       
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="grid" size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Categorías Preferidas</Text>
          </View>
          <Text style={[styles.subtitle, { color: colors.subtle }]}>
            Personaliza el tipo de contenido que prefieres ver
          </Text>
          <View style={styles.chipsGrid}>
            {CATEGORIES_INFO.map((cat) => (
              <Chip
                key={cat.id}
                label={cat.name}
                selected={preferences.categoriesOfInterest.includes(cat.id)}
                onPress={() =>
                  toggleSelection(
                    preferences.categoriesOfInterest,
                    cat.id,
                    addCategoryOfInterest,
                    removeCategoryOfInterest
                  )
                }
                color={colors.primary}
                border={colors.border}
                textColor={colors.text}
                icon={cat.icon}
              />
            ))}
          </View>
        </View>

      
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="color-palette" size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Apariencia</Text>
          </View>
          <View style={styles.rowChips}>
            {["light", "dark", "system"].map((t) => (
              <Chip
                key={t}
                label={
                  t === "light" ? "Claro" : t === "dark" ? "Oscuro" : "Sistema"
                }
                selected={theme === t}
                onPress={set(t as ThemePref)}
                color={colors.primary}
                border={colors.border}
                textColor={colors.text}
                icon={
                  t === "light"
                    ? "sunny-outline"
                    : t === "dark"
                    ? "moon-outline"
                    : "phone-portrait-outline"
                }
              />
            ))}
          </View>
        </View>

       
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
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
  facultadCard: {
    borderRadius: 12,
    borderWidth: 2,
    padding: 14,
    gap: 12,
    marginTop: 8,
  },
  facultadHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  facultadBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  facultadBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  facultadTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 18,
  },
  carrerasChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
});
