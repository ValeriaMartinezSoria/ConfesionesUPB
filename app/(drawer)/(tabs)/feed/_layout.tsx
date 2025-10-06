import React from "react";
import { Stack } from "expo-router";

export default function FeedStack() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Confesiones" }} />
      <Stack.Screen name="[id]" options={{ title: "Detalle" }} />
    </Stack>
  );
}
