import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "../../hooks/useThemeColors";
import { useUserStore } from "../../store/useUserStore";

export default function WelcomeScreen() {
  const { colors } = useThemeColors();
  const router = useRouter();
  const setHasCompletedOnboarding = useUserStore(
    (s) => s.setHasCompletedOnboarding
  );

  const handleSkip = () => {
    setHasCompletedOnboarding(true);
    router.replace("/(drawer)/(tabs)");
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: colors.primary + "20" },
            ]}
          >
            <Ionicons name="chatbubbles" size={60} color={colors.primary} />
          </View>
        </View>

        <Text style={[styles.title, { color: colors.text }]}>
          Bienvenido a ConfesionesUPB
        </Text>

        <Text style={[styles.subtitle, { color: colors.subtle }]}>
          Configuremos tu experiencia personalizada
        </Text>

        <View style={styles.stepsContainer}>
          <StepItem
            icon="school-outline"
            title="Selecciona tu Facultad"
            description="Elige las facultades de tu interés"
            colors={colors}
          />
          <StepItem
            icon="book-outline"
            title="Elige tus Carreras"
            description="Selecciona las carreras que te interesan"
            colors={colors}
          />
          <StepItem
            icon="heart-outline"
            title="Personaliza tus Categorías"
            description="Escoge los temas que más te gustan"
            colors={colors}
          />
        </View>

        <View style={styles.footer}>
          <Pressable
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={() => router.push("/auth/onboarding/faculties")}
          >
            <Text style={[styles.buttonText, { color: colors.surface }]}>
              Comenzar
            </Text>
            <Ionicons name="arrow-forward" size={20} color={colors.surface} />
          </Pressable>

          <Pressable
            onPress={handleSkip}
            style={styles.skipButton}
          >
            <Text style={[styles.skipText, { color: colors.subtle }]}>
              Omitir por ahora
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

function StepItem({
  icon,
  title,
  description,
  colors,
}: {
  icon: any;
  title: string;
  description: string;
  colors: any;
}) {
  return (
    <View style={styles.stepItem}>
      <View
        style={[
          styles.stepIcon,
          { backgroundColor: colors.primary + "15", borderColor: colors.primary },
        ]}
      >
        <Ionicons name={icon} size={24} color={colors.primary} />
      </View>
      <View style={styles.stepContent}>
        <Text style={[styles.stepTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.stepDescription, { color: colors.subtle }]}>
          {description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 48,
  },
  stepsContainer: {
    flex: 1,
    gap: 24,
  },
  stepItem: {
    flexDirection: "row",
    gap: 16,
    alignItems: "flex-start",
  },
  stepIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  stepContent: {
    flex: 1,
    paddingTop: 4,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    gap: 16,
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
  skipButton: {
    alignItems: "center",
    paddingVertical: 12,
  },
  skipText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
