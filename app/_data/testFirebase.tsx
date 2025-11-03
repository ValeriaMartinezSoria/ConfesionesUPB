import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { auth } from "../_data/firebase";

export default function TestFirebase() {
  useEffect(() => {
    console.log("Firebase Auth conectado:", auth);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Probando conexión con Firebase...</Text>
    </View>
  );
}
