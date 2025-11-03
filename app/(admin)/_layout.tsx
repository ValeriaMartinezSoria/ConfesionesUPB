import React from "react";
import { Stack } from "expo-router";
import RequireAdmin from "../../src/auth/RequireAdmin";

export default function AdminLayout() {
  return (
    <RequireAdmin>
      <Stack
        screenOptions={{
          headerShown: true,
          title: "Moderación",
        }}
      />
    </RequireAdmin>
  );
}
