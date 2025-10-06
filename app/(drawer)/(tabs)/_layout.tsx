import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "../../hooks/useThemeColors";

export default function TabsLayout() {
  const { colors } = useThemeColors();
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitle: "Confesiones UPB",
        headerTitleAlign: "center",
        headerStyle: { backgroundColor: colors.headerBg },
        headerTintColor: colors.headerText,
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: { backgroundColor: colors.tabBarBg, borderTopColor: colors.border },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Confesiones",
          tabBarIcon: ({ color, size }) => <Ionicons name="chatbubbles-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="publicar"
        options={{
          title: "Nuevo",
          tabBarIcon: ({ color, size }) => <Ionicons name="add-circle-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => <Ionicons name="person-circle-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen name="feed/[id]" options={{ href: null }} />
    </Tabs>
  );
}
