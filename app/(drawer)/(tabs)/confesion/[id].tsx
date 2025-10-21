import React, { useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useConfesionesStore } from "../../../store/useConfesionesStore";
import { useThemeColors } from "../../../hooks/useThemeColors";
import CommentsModal from "../../../components/CommentsModal"; // ✅ import corregido (sin llaves)

export default function ConfesionDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();
  const { colors } = useThemeColors();

  const confesion = useConfesionesStore((s) =>
    s.aprobadas.find((c) => c.id === Number(id))
  );

  // Estado de comentarios
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const addComment = () => {
    if (newComment.trim()) {
      setComments((prev) => [...prev, newComment.trim()]);
      setNewComment("");
    }
  };

  // Header con flecha y título
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "ConfesionesUPB",
      headerLeft: () => (
        <Ionicons
          name="arrow-back"
          size={24}
          color={colors.text}
          onPress={() => router.back()}
          style={{ marginLeft: 10 }}
        />
      ),
    });
  }, [navigation, colors.text]);

  if (!confesion) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Confesión no encontrada.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.category, { color: colors.primary }]}>
            {confesion.category.charAt(0).toUpperCase() +
              confesion.category.slice(1)}
          </Text>

          <Text style={[styles.content, { color: colors.text }]}>
            {confesion.content}
          </Text>

          {confesion.image && (
            <Image
              source={confesion.image}
              style={styles.image}
              resizeMode="cover"
            />
          )}

          <Text style={[styles.meta, { color: colors.subtle }]}>
            📚 {confesion.carrera}
          </Text>
          <Text style={[styles.meta, { color: colors.subtle }]}>
            ❤️ {confesion.likes}{" "}
            {confesion.likes === 1 ? "like" : "likes"}
          </Text>
        </View>

        {/* Sección de comentarios */}
        <View style={[styles.commentSection, { borderColor: colors.border }]}>
          <Pressable onPress={() => setModalVisible(true)}>
            <Text style={{ color: colors.primary, fontWeight: "600" }}>
              Ver comentarios
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Modal profesional de comentarios */}
      <CommentsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        comments={comments}
        newComment={newComment}
        setNewComment={setNewComment}
        addComment={addComment}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  scroll: { padding: 16 },
  card: { borderRadius: 16, padding: 16, gap: 10 },
  category: { fontSize: 13, fontWeight: "700" },
  content: { fontSize: 16, lineHeight: 22 },
  image: { width: "100%", height: 220, borderRadius: 12, marginTop: 8 },
  meta: { fontSize: 12 },
  commentSection: { marginTop: 20, borderTopWidth: 1, paddingTop: 14 },
});
