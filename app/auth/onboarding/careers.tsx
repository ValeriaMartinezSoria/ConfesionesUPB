import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "../../hooks/useThemeColors";
import { useUserStore } from "../../store/useUserStore";
import {
  CARRERAS_DISPONIBLES,
  CARRERAS_POR_FACULTAD,
  type Carrera,
} from "../../data/seed";

export default function CareersScreen() {
  const { colors } = useThemeColors();
  const router = useRouter();

  const carrerasDeInteres = useUserStore((s) => s.carrerasDeInteres);
  const facultadesDeInteres = useUserStore((s) => s.facultadesDeInteres);
  const setCarrerasDeInteres = useUserStore((s) => s.setCarrerasDeInteres);

  const [selected, setSelected] = useState<Carrera[]>(carrerasDeInteres);

  // Get recommended careers based on selected faculties
  const recommendedCareers = useMemo(() => {
    if (facultadesDeInteres.length === 0) return [];
    return facultadesDeInteres.flatMap((facultad) => CARRERAS_POR_FACULTAD[facultad]);
  }, [facultadesDeInteres]);

  const otherCareers = useMemo(() => {
    return CARRERAS_DISPONIBLES.filter(
      (carrera) => !recommendedCareers.includes(carrera)
    );
  }, [recommendedCareers]);

  const toggleCarrera = (carrera: Carrera) => {
    if (selected.includes(carrera)) {
      setSelected(selected.filter((c) => c !== carrera));
    } else {
      setSelected([...selected, carrera]);
    }
  };

  const handleContinue = () => {
    setCarrerasDeInteres(selected);
    router.push("/auth/onboarding/categories");
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Pressable onPress={handleBack} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <View style={styles.progressContainer}>
          <View style={[styles.progressDot, { backgroundColor: colors.primary }]} />
          <View style={[styles.progressDot, { backgroundColor: colors.primary }]} />
          <View style={[styles.progressDot, { backgroundColor: colors.border }]} />
        </View>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.text }]}>
            Selecciona tus Carreras
          </Text>
          <Text style={[styles.subtitle, { color: colors.subtle }]}>
            Elige las carreras que te interesan para ver confesiones relevantes
          </Text>
        </View>

        {recommendedCareers.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="star" size={18} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.primary }]}>
                Recomendadas para ti
              </Text>
            </View>
            <View style={styles.chipsContainer}>
              {recommendedCareers.map((carrera) => {
                const isSelected = selected.includes(carrera);
                return (
                  <Pressable
                    key={carrera}
                    onPress={() => toggleCarrera(carrera)}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: isSelected
                          ? colors.primary
                          : colors.surface,
                        borderColor: isSelected ? colors.primary : colors.border,
                      },
                    ]}
                  >
                    <Ionicons
                      name={isSelected ? "checkmark-circle" : "ellipse-outline"}
                      size={18}
                      color={isSelected ? colors.surface : colors.text}
                    />
                    <Text
                      style={[
                        styles.chipText,
                        { color: isSelected ? colors.surface : colors.text },
                      ]}
                    >
                      {carrera}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {otherCareers.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="list" size={18} color={colors.text} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Otras carreras
              </Text>
            </View>
            <View style={styles.chipsContainer}>
              {otherCareers.map((carrera) => {
                const isSelected = selected.includes(carrera);
                return (
                  <Pressable
                    key={carrera}
                    onPress={() => toggleCarrera(carrera)}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: isSelected
                          ? colors.primary
                          : colors.surface,
                        borderColor: isSelected ? colors.primary : colors.border,
                      },
                    ]}
                  >
                    <Ionicons
                      name={isSelected ? "checkmark-circle" : "ellipse-outline"}
                      size={18}
                      color={isSelected ? colors.surface : colors.text}
                    />
                    <Text
                      style={[
                        styles.chipText,
                        { color: isSelected ? colors.surface : colors.text },
                      ]}
                    >
                      {carrera}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {selected.length > 0 && (
          <View
            style={[
              styles.selectedBanner,
              { backgroundColor: colors.primary + "15", borderColor: colors.primary },
            ]}
          >
            <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
            <Text style={[styles.selectedText, { color: colors.primary }]}>
              {selected.length} {selected.length === 1 ? "carrera seleccionada" : "carreras seleccionadas"}
            </Text>
          </View>
        )}

        <Pressable
          style={[
            styles.button,
            {
              backgroundColor: selected.length > 0 ? colors.primary : colors.border,
            },
          ]}
          onPress={handleContinue}
          disabled={selected.length === 0}
        >
          <Text
            style={[
              styles.buttonText,
              { color: selected.length > 0 ? colors.surface : colors.subtle },
            ]}
          >
            Continuar
          </Text>
          <Ionicons
            name="arrow-forward"
            size={20}
            color={selected.length > 0 ? colors.surface : colors.subtle}
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  progressContainer: {
    flexDirection: "row",
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  titleContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "600",
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 16,
    gap: 12,
  },
  selectedBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  selectedText: {
    fontSize: 14,
    fontWeight: "600",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
  },
});
