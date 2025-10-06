import React from "react";
import { Link } from "expo-router";
import { View, Text, Pressable } from "react-native";

export default function NotFound() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 8 }}>
      <Text style={{ fontSize: 16, fontWeight: "700" }}>Pantalla no encontrada</Text>
      <Link href="/(drawer)/(tabs)" asChild>
        <Pressable style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, backgroundColor: "#0033A0" }}>
          <Text style={{ color: "white", fontWeight: "600" }}>Volver al inicio</Text>
        </Pressable>
      </Link>
    </View>
  );
}
