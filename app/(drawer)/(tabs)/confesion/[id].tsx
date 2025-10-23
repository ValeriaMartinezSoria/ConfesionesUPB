import React from "react";
import { View, Text, StyleSheet, Platform, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useConfesionesStore } from "../../../store/useConfesionesStore";
import { useCommentsStore } from "../../../store/useCommentsStore";
import { useThemeColors } from "../../../hooks/useThemeColors";
import { Ionicons } from "@expo/vector-icons";

type ModerationLogEntry = {
  id?: string;
  action?: "approved" | "rejected";
  timestamp?: string;
  user?: { id?: string; name?: string };
  reason?: string;
};

type ModeratedFields = {
  status?: "pending" | "approved" | "rejected";
  approvedAt?: string | null;
  approvedBy?: string | null;
  rejectedAt?: string | null;
  rejectionReason?: string | null;
  moderationLogs?: ModerationLogEntry[];
};

export default function ConfesionDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();
  const { colors } = useThemeColors();
  const aprobadas = useConfesionesStore((s) => s.aprobadas);
  const confesion = aprobadas.find((c) => String(c.id) === String(id)) as (typeof aprobadas[number] & ModeratedFields) | undefined;

  if (!confesion) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Confesión no encontrada.</Text>
      </View>
    );
  }

  const cardShadow =
    Platform.OS === "ios"
      ? { shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } }
      : { elevation: 2 };

  const moderationLogs: ModerationLogEntry[] = confesion.moderationLogs ?? [];
  const status = confesion.status ?? "approved";
  const statusLabel =
    status === "approved"
      ? "Aprobada"
      : status === "rejected"
      ? "Rechazada"
      : "Pendiente";
  const statusTint =
    status === "approved" ? "#30d158" : status === "rejected" ? "#ff3b30" : "#ffd60a";
  const formatTimestamp = (value?: string | null) =>
    value ? new Date(value).toLocaleString() : undefined;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.category, { color: colors.primary }]}>
            {confesion.category.charAt(0).toUpperCase() +
              confesion.category.slice(1)}
          </Text>

        <Text style={[styles.content, { color: colors.text }]}>{confesion.content}</Text>

        <View style={styles.statusRow}>
          <View style={[styles.statusBadge, { borderColor: statusTint, backgroundColor: `${statusTint}22` }]}>
            <Ionicons name="shield-checkmark-outline" size={16} color={statusTint} />
            <Text style={[styles.statusText, { color: statusTint }]}>{statusLabel}</Text>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="school-outline" size={18} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.text }]}>
            {confesion.carrera || "Carrera no especificada"}
          </Text>
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="pricetag-outline" size={18} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.text }]}>
            {confesion.category.charAt(0).toUpperCase() + confesion.category.slice(1)}
          </Text>
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="heart-outline" size={18} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.text }]}>
            {confesion.likes} {confesion.likes === 1 ? "like" : "likes"}
          </Text>
        </View>

        {(confesion.approvedAt || confesion.rejectedAt) && (
          <View style={styles.metaContainer}>
            {confesion.approvedAt && (
              <Text style={[styles.metaText, { color: colors.subtle }]}>
                Aprobada el {formatTimestamp(confesion.approvedAt)} por {confesion.approvedBy ?? "—"}
              </Text>
            )}
            {confesion.rejectedAt && (
              <Text style={[styles.metaText, { color: colors.subtle }]}>
                Rechazada el {formatTimestamp(confesion.rejectedAt)}
              </Text>
            )}
            {!!confesion.rejectionReason && (
              <Text style={[styles.metaText, styles.metaReason]}>Motivo: {confesion.rejectionReason}</Text>
            )}
          </View>
        )}

        {moderationLogs.length > 0 && (
          <View style={styles.logsContainer}>
            <Text style={[styles.logsTitle, { color: colors.subtle }]}>Registro de auditoría</Text>
            {moderationLogs
              .slice()
              .reverse()
              .map((log, index) => (
                <View key={log.id ?? index} style={[styles.logRow, { borderColor: colors.border }]}>
                  <Text style={[styles.logAction, { color: log.action === "approved" ? "#30d158" : "#ff3b30" }]}>
                    {log.action === "approved" ? "Aprobado" : "Rechazado"}
                  </Text>
                  <Text style={[styles.logMeta, { color: colors.text }]}>
                    {formatTimestamp(log.timestamp)}
                  </Text>
                  {log.user?.name && (
                    <Text style={[styles.logMeta, { color: colors.subtle }]}>Por: {log.user.name}</Text>
                  )}
                  {!!log.reason && (
                    <Text style={[styles.logMeta, styles.metaReason]}>Motivo: {log.reason}</Text>
                  )}
                </View>
              ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16 },
  card: { borderWidth: 1, borderRadius: 16, padding: 16, gap: 10 },
  header: { flexDirection: "row", alignItems: "center", gap: 6 },
  nexo: { fontSize: 13, fontWeight: "600" },
  content: { fontSize: 16, lineHeight: 22, marginVertical: 8 },
  infoBox: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 6 },
  infoText: { fontSize: 14 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  statusRow: { flexDirection: "row", marginTop: 4 },
  statusBadge: { flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 4, paddingHorizontal: 10, borderRadius: 999, borderWidth: 1 },
  statusText: { fontSize: 12, fontWeight: "700" },
  metaContainer: { marginTop: 12, gap: 6 },
  metaText: { fontSize: 12 },
  metaReason: { fontStyle: "italic" },
  logsContainer: { marginTop: 16, gap: 10 },
  logsTitle: { fontSize: 13, fontWeight: "600", textTransform: "uppercase" },
  logRow: { borderWidth: 1, borderRadius: 12, padding: 12, gap: 4 },
  logAction: { fontSize: 14, fontWeight: "700" },
  logMeta: { fontSize: 12 },
});
