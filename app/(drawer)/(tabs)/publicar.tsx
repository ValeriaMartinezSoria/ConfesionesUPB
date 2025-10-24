import React, { useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Platform, Image, ActivityIndicator, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "../../hooks/useThemeColors";
import { useConfesionesStore } from "../../store/useConfesionesStore";
import * as ImagePicker from "expo-image-picker";
import { uploadToCloudinary } from "../../services/cloudinary";
import type { Confesion } from "../../data/seed";
import { Keyboard, TouchableWithoutFeedback } from "react-native";



type Category = "amor" | "academico" | "random";

const cardShadow = Platform.OS === "ios"
  ? { shadowColor: "black", shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } }
  : { elevation: 2 };

const alpha = (hex: string, a: number) => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return hex;
  const r = parseInt(m[1], 16), g = parseInt(m[2], 16), b = parseInt(m[3], 16);
  return `rgba(${r},${g},${b},${a})`;
};

export default function NuevaConfesion() {
  const { colors, effective } = useThemeColors();
  const isLight = effective === "light";

  const addPendiente = useConfesionesStore((s) => s.addPendiente);
  const [texto, setTexto] = useState("");
  const [categoria, setCategoria] = useState<Category>("amor");
  const [carrera, setCarrera] = useState("Administración de Empresas");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const carreras = [
    "Administración de Empresas",
    "Comunicación",
    "Derecho",
    "Economía",
    "Ingeniería Comercial",
    "Ingeniería Financiera",
    "Ingeniería de Sistemas",
    "Diseño Gráfico",
  ];

  const len = texto.trim().length;
  const valid = len >= 10 && len <= 500;

  const counterColor = useMemo(() => {
    if (len === 0) return colors.subtle;
    if (!valid) return colors.secondary;
    return colors.primary;
  }, [len, valid, colors]);

const pickImage = async () => {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) return;
  const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
  if (!result.canceled) {
    const uri = (result as any).uri ?? (result as any).assets?.[0]?.uri;
    if (uri) setImageUri(uri);
  }
};

const submit = async () => {
  if (!valid) return;
  let image: any = undefined;
  try {
    if (imageUri) {
      setUploading(true);
      const res = await uploadToCloudinary(imageUri);
      image = { uri: res.secure_url ?? res.url };
    }

    const confPayload = {
      content: texto.trim(),
      category: categoria,
      carrera: carrera,
      image,
    };
    addPendiente(confPayload);
    Keyboard.dismiss();
    setTexto("");
    setCategoria("amor");
    setCarrera("Administración de Empresas");
    setImageUri(null);
  } catch (err) {
    console.error("Error subiendo imagen:", err);
  } finally {
    setUploading(false);
  }
};

  const chipColor = isLight ? colors.primary : colors.secondary;
  const label = (c: Category) => (c === "amor" ? "Amor" : c === "academico" ? "Académico" : "Random");

  const ctaBg = isLight ? colors.surface : colors.secondary;
  const ctaBorder = isLight ? colors.primary : alpha(colors.secondary, 0.3);
  const ctaFg = isLight ? colors.primary : "white";
  const ctaRipple = alpha(isLight ? colors.primary : colors.secondary, 0.2);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }, cardShadow]}>
        <Text style={[styles.label, { color: colors.text }]}>Tu confesión</Text>
        <TextInput
          value={texto}
          onChangeText={setTexto}
          placeholder="Escribe de forma anónima..."
          placeholderTextColor={colors.subtle}
          multiline
          maxLength={500}
          style={[styles.input, { color: colors.text }]}
        />
        <Pressable style={styles.cameraButton} onPress={pickImage}>
          <Ionicons name="camera-outline" size={22} color={colors.subtle} />
          <Text style={[styles.cameraText, { color: colors.subtle }]}>Agregar imagen</Text>
        </Pressable>

        {imageUri ? (
          <View style={{ marginTop: 8 }}>
            <Image source={{ uri: imageUri }} style={{ width: "100%", height: 200, borderRadius: 12 }} />
          </View>
        ) : null}

        <View style={styles.rowBetween}>
          <Text style={[styles.hint, { color: counterColor }]}>{len}/500</Text>
          <Text style={[styles.hint, { color: colors.subtle }]}>mín. 10 caracteres</Text>
        </View>
      </View>


      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.label, { color: colors.text }]}>Categoría</Text>
        <View style={styles.rowChips}>
          {(["amor", "academico", "random"] as Category[]).map((c) => {
            const selected = categoria === c;
            return (
              <Pressable
                key={c}
                onPress={() => setCategoria(c)}
                style={[
                  styles.chip,
                  { borderColor: selected ? chipColor : colors.border, backgroundColor: selected ? alpha(chipColor, 0.12) : "transparent" },
                ]}
                android_ripple={{ color: alpha(chipColor, 0.2) }}
              >
                <Text style={[styles.chipText, { color: selected ? chipColor : colors.text }]}>{label(c)}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.label, { color: colors.text }]}>Carrera</Text>
        <View style={styles.rowChips}>
          {carreras.map((c) => {
            const selected = carrera === c;
            return (
              <Pressable
                key={c}
                onPress={() => setCarrera(c)}
                style={[
                  styles.chip,
                  {
                    borderColor: selected ? chipColor : colors.border,
                    backgroundColor: selected ? alpha(chipColor, 0.12) : "transparent",
                  },
                ]}
                android_ripple={{ color: alpha(chipColor, 0.2) }}
              >
                <Text style={[styles.chipText, { color: selected ? chipColor : colors.text }]}>{c}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Pressable
        onPress={submit}
        disabled={!valid || uploading}
        style={({ pressed }) => [
          styles.btn,
          { backgroundColor: ctaBg, borderColor: ctaBorder, opacity: valid ? 1 : 0.6 },
          !isLight && valid
            ? { shadowColor: colors.secondary, shadowOpacity: 0.25, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } }
            : null,
          pressed && valid ? { transform: [{ scale: 0.98 }] } : null,
        ]}
        android_ripple={valid ? { color: ctaRipple } : undefined}
      >
        {uploading ? (
          <ActivityIndicator color={ctaFg} />
        ) : (
          <>
            <Ionicons name="send" size={18} color={ctaFg} />
            <Text style={[styles.btnText, { color: ctaFg }]}>Enviar para moderación</Text>
          </>
        )}
      </Pressable>
      </ScrollView>
    </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16, backgroundColor: "transparent" },
  scrollContent: { gap: 16, paddingBottom: 24 },
  card: { borderRadius: 16, borderWidth: 1, padding: 14, gap: 10 },
  label: { fontSize: 14, fontWeight: "700" },
  input: { minHeight: 120, textAlignVertical: "top", fontSize: 16, lineHeight: 22 },
  hint: { fontSize: 12, fontWeight: "600" },
  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  rowChips: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  chip: { paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1, borderRadius: 999 },
  chipText: { fontSize: 13, fontWeight: "700" },
  cameraButton: {
  flexDirection: "row",
  alignItems: "center",
  gap: 6,
  marginTop: 8,
},
cameraText: {
  fontSize: 13,
  fontWeight: "500",
},
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  btnText: { fontWeight: "800", fontSize: 14, letterSpacing: 0.3 },
});
