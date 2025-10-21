import React from "react";
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
} from "react-native";

interface CommentsModalProps {
  visible: boolean;
  onClose: () => void;
  comments: string[];
  newComment: string;
  setNewComment: (text: string) => void;
  addComment: () => void;
}

const CommentsModal: React.FC<CommentsModalProps> = ({
  visible,
  onClose,
  comments,
  newComment,
  setNewComment,
  addComment,
}) => {
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
                <Text style={styles.user}>Anónimo</Text>
                <Text style={styles.commentText}>{item}</Text>
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
            <Pressable style={styles.button} onPress={addComment}>
              <Text style={styles.buttonText}>Enviar</Text>
            </Pressable>
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
    height: "50%", // ✅ como Instagram
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
});
