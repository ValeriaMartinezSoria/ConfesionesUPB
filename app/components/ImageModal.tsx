import React, { useEffect, useRef } from "react";
import { Modal, View, Image, Pressable, StyleSheet } from "react-native";
import { Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ImageModalProps {
  visible: boolean;
  image: any; 
  onClose: () => void;
}

export default function ImageModal({ visible, image, onClose }: ImageModalProps) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(anim, { toValue: 1, useNativeDriver: true, friction: 8 }).start();
    } else {
      Animated.timing(anim, { toValue: 0, duration: 140, useNativeDriver: true }).start();
    }
  }, [visible]);

  const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] });
  const opacity = anim;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.background} onPress={onClose} />
        <Animated.View style={[styles.modalContainer, { transform: [{ scale }], opacity }]}>
          <Image source={typeof image === "string" ? { uri: image } : image} style={styles.image} resizeMode="contain" />
          <Pressable style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={26} color="#fff" />
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    width: "90%",
    height: "70%",
    borderRadius: 20,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  closeBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 6,
  },
});
