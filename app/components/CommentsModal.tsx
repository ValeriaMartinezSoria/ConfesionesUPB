import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "../hooks/useThemeColors";
import { db } from "../data/firebase";
import { doc, updateDoc, increment } from "firebase/firestore";

type Comment = {
  id: string;
  text: string;
  createdAt: number;
  confessionId: number;
  likes?: number; // Nuevo campo
};

type Props = {
  visible: boolean;
  onClose: () => void;
  comments: Comment[];
  newComment: string;
  setNewComment: (text: string) => void;
  addComment: () => void;
};

export default function CommentsModal({
  visible,
  onClose,
  comments,
  newComment,
  setNewComment,
  addComment,
}: Props) {
  const { colors } = useThemeColors();

  // Estado local para saber qué comentarios están likeados
  const [likedComments, setLikedComments] = useState<Record<string, boolean>>({});

  // 🔹 Manejar like / unlike
  const handleLike = async (commentId: string, liked: boolean) => {
    try {
      const ref = doc(db, "comments", commentId);
      await updateDoc(ref, {
        likes: increment(liked ? -1 : 1),
      });

      setLikedComments((prev) => ({
        ...prev,
        [commentId]: !liked,
      }));
    } catch (error) {
      console.error("Error al actualizar likes:", error);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.overlay}
      >
        <View
          style={[styles.modalContainer, { backgroundColor: colors.surface }]}
        >
          {/* 🔹 Encabezado */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              Comentarios
            </Text>
            <Pressable onPress={onClose}>
              <Text style={styles.close}>✕</Text>
            </Pressable>
          </View>

          {/* 🔹 Lista de comentarios */}
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingVertical: 8 }}
            ListEmptyComponent={
              <Text style={[styles.empty, { color: colors.subtle }]}>
                Aún no hay comentarios.
              </Text>
            }
            renderItem={({ item }) => {
              const liked = likedComments[item.id] || false;
              const likeCount = item.likes ?? 0;

              return (
                <View style={styles.commentItem}>
                  <Text style={styles.user}>Anónimo</Text>
                  <Text style={[styles.commentText, { color: colors.text }]}>
                    {item.text}
                  </Text>
                  <View style={styles.likeRow}>
                    <Pressable onPress={() => handleLike(item.id, liked)}>
                      <Ionicons
                        name={liked ? "heart" : "heart-outline"}
                        size={18}
                        color={liked ? "red" : colors.subtle}
                      />
                    </Pressable>
                    <Text style={[styles.time, { color: colors.subtle }]}>
                      {" "}
                      {likeCount + (liked && !item.likes ? 1 : 0)}{" "}
                      {likeCount === 1 ? "like" : "likes"}
                    </Text>
                  </View>
                </View>
              );
            }}
          />

          {/* 🔹 Campo de nuevo comentario */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Escribe un comentario..."
              placeholderTextColor="#aaa"
              value={newComment}
              onChangeText={setNewComment}
            />
            <Pressable style={styles.button} onPress={addComment}>
              <Text style={styles.buttonText}>Enviar</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: "60%",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: { fontSize: 18, fontWeight: "bold" },
  close: { fontSize: 18, color: "#777" },
  commentItem: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
  },
  user: { fontWeight: "600", fontSize: 13, color: "#333" },
  commentText: { fontSize: 14, marginTop: 2 },
  likeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  time: { fontSize: 12 },
  empty: { textAlign: "center", color: "#888", marginTop: 20 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  button: {
    backgroundColor: "#3171b4ff",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginLeft: 8,
  },
  buttonText: { color: "#fff", fontWeight: "600" },
});
