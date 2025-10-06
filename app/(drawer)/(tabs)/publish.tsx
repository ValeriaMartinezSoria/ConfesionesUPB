import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useThemeColors } from "../../hooks/useThemeColors";
export default function Publish() {
  const { colors } = useThemeColors();
  const styles = React.useMemo(() => StyleSheet.create({
    screen: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background, padding: 24 },
    title: { fontSize: 22, fontWeight: "700", color: colors.text },
    subtitle: { marginTop: 8, color: colors.subtle }
  }), [colors]);
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Publicar</Text>
      <Text style={styles.subtitle}>Próximamente</Text>
    </View>
  );
}
