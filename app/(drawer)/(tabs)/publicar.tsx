import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useThemeColors } from "../../hooks/useThemeColors";
import { useConfesionesStore } from "../../store/useConfesionesStore";
import type { Confesion } from "../../data/seed";

type Category = Confesion["category"];

const CATEGORIES: ReadonlyArray<{ label: string; value: Category }> = [
  { label: "Amor", value: "amor" as Category },
  { label: "Académico", value: "academico" as Category },
  { label: "Random", value: "random" as Category },
];

export default function Publicar() {
  const { colors } = useThemeColors();
  const addPendiente = useConfesionesStore((s) => s.addPendiente);
  const [texto, setTexto] = useState("");
  const [categoria, setCategoria] = useState<Category | null>(null);
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.status !== "granted") {
      Alert.alert("Permiso requerido", "Autoriza el acceso a tus imágenes.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const len = texto.trim().length;
  const disabled = len < 10 || len > 500 || !categoria;

  const enviar = () => {
    if (disabled) return;
    addPendiente({ content: texto.trim(), category: categoria as Category, imageUri } as any);
    setTexto("");
    setCategoria(null);
    setImageUri(undefined);
    Alert.alert("Enviado", "Tu confesión fue enviada a Pendientes.");
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Nueva Confesión</Text>
        <TextInput
          value={texto}
          onChangeText={setTexto}
          placeholder="Escribe tu confesión (10–500)"
          placeholderTextColor={colors.subtle}
          multiline
          style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]}
        />
        <View style={styles.chips}>
          {CATEGORIES.map((c) => (
            <Text
              key={c.value as string}
              onPress={() => setCategoria(c.value)}
              style={[
                styles.chip,
                {
                  borderColor: categoria === c.value ? colors.text : colors.border,
                  color: categoria === c.value ? colors.text : colors.subtle,
                },
              ]}
            >
              {c.label}
            </Text>
          ))}
        </View>
        <Button title={imageUri ? "Cambiar imagen" : "Elegir imagen (opcional)"} onPress={pickImage} />
        <Button title="Enviar" onPress={enviar} disabled={disabled} />
        {disabled && (
          <Text style={[styles.hint, { color: colors.subtle }]}>
            Debe tener entre 10 y 500 caracteres y seleccionar categoría.
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16 },
  card: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 16 },
  title: { fontSize: 18, fontWeight: "700" },
  input: { minHeight: 120, borderWidth: 1, borderRadius: 12, padding: 12 },
  chips: { flexDirection: "row", gap: 8 },
  chip: { paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1, borderRadius: 16 },
  hint: { fontSize: 12 }
});
