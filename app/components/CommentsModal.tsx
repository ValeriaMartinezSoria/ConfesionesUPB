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
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "../hooks/useThemeColors";
import { db } from "../data/firebase";
import { doc, updateDoc, increment } from "firebase/firestore";
import { useUserStore } from "../store/useUserStore"; 
import * as ImagePicker from "expo-image-picker";
import { uploadToCloudinary } from "../services/cloudinary";

type Comment = {
  id: string;
  text: string;
  createdAt: number;
  confessionId: number;
  image?: string;
  likes?: number;
  userId?: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  comments: Comment[];
  newComment: string;
  setNewComment: (text: string) => void;
  addComment: (image?: string) => void;
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
  const [likedComments, setLikedComments] = useState<Record<string, boolean>>({});
  const { user } = useUserStore(); 

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      const uri = (result as any).uri ?? (result as any).assets?.[0]?.uri;
      if (uri) setImageUri(uri);
    }
  };

  const removeImage = () => setImageUri(null);

  const handleSend = async () => {
    if (!newComment.trim() && !imageUri) return;
    let imageUrl: string | undefined;
    try {
      if (imageUri) {
        setUploading(true);
        const res = await uploadToCloudinary(imageUri);
        imageUrl = res.secure_url ?? res.url;
      }

      await addComment(imageUrl);
      setNewComment("");
      setImageUri(null);
    } catch (err) {
      console.error("Error enviando comentario:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleLike = async (commentId: string, liked: boolean) => {
    try {
      const ref = doc(db, "comments", commentId);
      await updateDoc(ref, { likes: increment(liked ? -1 : 1) });
      setLikedComments((prev) => ({
        ...prev,
        [commentId]: !liked,
      }));
    } catch (error) {
      console.error("Error al actualizar likes:", error);
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.overlay}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.surface }]}>
       
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Comentarios</Text>
            <Pressable onPress={onClose}>
              <Text style={[styles.close, { color: colors.textSecondary }]}>✕</Text>
            </Pressable>
          </View>

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
              const mockAvatar = `https://i.pravatar.cc/40?u=${item.id}`;

           
              const userName =
                item.userId === user?.uid ? "Tú" : "Anónimo";

              return (
                <View style={[styles.commentRow, { backgroundColor: colors.commentBg }]}>
                  <Image source={{ uri: mockAvatar }} style={[styles.avatar, { backgroundColor: colors.avatarBg }]} />
                  <View style={styles.commentContent}>
                    <Text style={[styles.user, { color: colors.text }]}>{userName}</Text>
                    <Text style={[styles.commentText, { color: colors.text }]}>
                      {item.text}
                    </Text>
                    {item.image ? (
                      <Image 
                        source={{ uri: item.image }} 
                        style={{ width: "100%", height: 180, borderRadius: 10, marginTop: 8 }} 
                      />
                    ) : null}
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
                        {likeCount === 1 ? "like" : "likes"} ·{" "}
                        {formatTime(item.createdAt)}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            }}
          />

          <View style={[styles.inputContainer, { borderTopColor: colors.border }]}>
            <TextInput
              style={[styles.input, { color: colors.text, backgroundColor: colors.inputBg }]}
              placeholder="Escribe un comentario..."
              placeholderTextColor={colors.inputPlaceholder}
              value={newComment}
              onChangeText={setNewComment}
            />
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Pressable style={styles.cameraButton} onPress={pickImage}>
                <Ionicons name="image-outline" size={20} color={colors.primary} />
              </Pressable>

              {imageUri ? (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Image source={{ uri: imageUri }} style={{ width: 48, height: 48, borderRadius: 8 }} />
                  <Pressable onPress={removeImage}>
                    <Text style={{ color: colors.danger }}>Eliminar</Text>
                  </Pressable>
                </View>
              ) : null}

              <Pressable style={[styles.button, { backgroundColor: colors.buttonBg }]} onPress={handleSend}>
                {uploading ? (
                  <ActivityIndicator color={colors.buttonText} />
                ) : (
                  <Text style={[styles.buttonText, { color: colors.buttonText }]}>Enviar</Text>
                )}
              </Pressable>
            </View>
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
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
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
  close: { fontSize: 18 },
  commentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  commentContent: { flex: 1 },
  user: { fontWeight: "600", fontSize: 13 },
  commentText: { fontSize: 14, marginTop: 2 },
  likeRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  time: { fontSize: 12 },
  empty: { textAlign: "center", marginTop: 20 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  button: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginLeft: 8,
  },
  buttonText: { fontWeight: "600" },
  cameraButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
});
