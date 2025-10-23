import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { uploadToCloudinary } from "../services/cloudinary";

interface CommentsModalProps {
  visible: boolean;
  onClose: () => void;
  comments: any[]; // Comment[]
  newComment: string;
  setNewComment: (text: string) => void;
  addComment: (payload: { user: string; content: string; image?: string }) => void;
}

const CommentsModal: React.FC<CommentsModalProps> = ({
  visible,
  onClose,
  comments,
  newComment,
  setNewComment,
  addComment,
}) => {
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
      // expo sdk 48+ uses result.assets
      // support both shapes
      // @ts-ignore
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

      await addComment({ user: "Anónimo", content: newComment.trim(), image: imageUrl });
      setNewComment("");
      setImageUri(null);
    } catch (err) {
      console.error("Error enviando comentario:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Comentarios</Text>
            <Pressable onPress={onClose}>
              <Text style={styles.close}>✕</Text>
            </Pressable>
          </View>

          <FlatList
            data={comments || []}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.commentItem}>
                <Text style={styles.user}>{item.user ?? "Anónimo"}</Text>
                <Text style={styles.commentText}>{item.content ?? item}</Text>
                {item.image ? (
                  <Image source={{ uri: item.image }} style={{ width: "100%", height: 180, borderRadius: 10, marginTop: 8 }} />
                ) : null}
                <Text style={styles.time}>Hace un momento · ❤️ 0</Text>
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.noComments}>Aún no hay comentarios.</Text>
            }
          />

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Escribe un comentario..."
              placeholderTextColor="#aaa"
              value={newComment}
              onChangeText={setNewComment}
            />
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Pressable style={styles.cameraButton} onPress={pickImage}>
                <Text style={{ color: "#3171b4ff", fontWeight: "700" }}>📷</Text>
              </Pressable>

              {imageUri ? (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Image source={{ uri: imageUri }} style={{ width: 48, height: 48, borderRadius: 8 }} />
                  <Pressable onPress={removeImage}>
                    <Text style={{ color: "#888" }}>Eliminar</Text>
                  </Pressable>
                </View>
              ) : null}

              <Pressable style={styles.button} onPress={handleSend}>
                {uploading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Enviar</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CommentsModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: "50%", 
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
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  close: {
    fontSize: 18,
    color: "#777",
  },
  commentItem: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
  },
  user: {
    fontWeight: "600",
    fontSize: 13,
    color: "#333",
  },
  commentText: {
    fontSize: 14,
    color: "#333",
    marginTop: 2,
  },
  time: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  noComments: {
    textAlign: "center",
    color: "#888",
    marginTop: 20,
  },
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
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
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
