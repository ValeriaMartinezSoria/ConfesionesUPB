import React, { useMemo, useState } from "react";
import { SafeAreaView, View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";

type Role = "admin" | "persona";
type ModerationLog = {
  id: string;
  action: "approved" | "rejected";
  timestamp: string;
  user: { id: string; name: string };
  reason?: string;
};
type Confesion = {
  id: string;
  nexo: string;
  content: string;
  carrera?: string;
  category: string;
  likes: number;
  status: "pending" | "approved" | "rejected";
  approvedAt?: string | null;
  approvedBy?: string | null;
  rejectedAt?: string | null;
  rejectionReason?: string | null;
  moderationLogs?: ModerationLog[];
};

const initialConfesiones: Confesion[] = [
  {
    id: "1",
    nexo: "Anónimo 01",
    content: "Necesito aprobar cálculos pero estudio de madrugada.",
    carrera: "Ingeniería",
    category: "academico",
    likes: 12,
    status: "pending",
    moderationLogs: [],
  },
  {
    id: "2",
    nexo: "Anónimo 02",
    content: "Me gusta alguien del salón pero no sé cómo decirlo.",
    carrera: "Psicología",
    category: "amor",
    likes: 34,
    status: "approved",
    approvedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    approvedBy: "Moderador General",
    moderationLogs: [
      {
        id: "seed-log-1",
        action: "approved",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        user: { id: "admin01", name: "Moderador General" },
      },
    ],
  },
  {
    id: "3",
    nexo: "Anónimo 03",
    content: "La cafetería debería abrir más tarde los fines de semana.",
    carrera: "Administración",
    category: "servicios",
    likes: 7,
    status: "rejected",
    rejectedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    rejectionReason: "Duplicada.",
    moderationLogs: [
      {
        id: "seed-log-2",
        action: "rejected",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
        user: { id: "admin02", name: "Turno Nocturno" },
        reason: "Duplicada.",
      },
    ],
  },
];

export default function App() {
  const [role, setRole] = useState<Role>("persona");
  const [confesiones, setConfesiones] = useState<Confesion[]>(initialConfesiones);
  const [pendingReasons, setPendingReasons] = useState<Record<string, string>>({});

  const currentUser = useMemo(
    () =>
      role === "admin"
        ? { id: "admin01", name: "Moderador General" }
        : { id: "persona01", name: "Estudiante Invitado" },
    [role]
  );

  const pendingConfesiones = useMemo(() => confesiones.filter((c) => c.status === "pending"), [confesiones]);
  const approvedConfesiones = useMemo(() => confesiones.filter((c) => c.status === "approved"), [confesiones]);
  const rejectedConfesiones = useMemo(() => confesiones.filter((c) => c.status === "rejected"), [confesiones]);

  const handleApprove = (id: string) => {
    const timestamp = new Date().toISOString();
    const logEntry: ModerationLog = {
      id: `log-${timestamp}`,
      action: "approved",
      timestamp,
      user: currentUser,
    };
    console.log(`[moderationLogs:${id}]`, logEntry);
    setConfesiones((prev) =>
      prev.map((conf) =>
        conf.id === id
          ? {
              ...conf,
              status: "approved",
              approvedAt: timestamp,
              approvedBy: currentUser.name,
              rejectedAt: null,
              rejectionReason: null,
              moderationLogs: [...(conf.moderationLogs ?? []), logEntry],
            }
          : conf
      )
    );
    setPendingReasons((prev) => ({ ...prev, [id]: "" }));
  };

  const handleReject = (id: string) => {
    const timestamp = new Date().toISOString();
    const reason = pendingReasons[id]?.trim() || undefined;
    const logEntry: ModerationLog = {
      id: `log-${timestamp}`,
      action: "rejected",
      timestamp,
      user: currentUser,
      reason,
    };
    console.log(`[moderationLogs:${id}]`, logEntry);
    setConfesiones((prev) =>
      prev.map((conf) =>
        conf.id === id
          ? {
              ...conf,
              status: "rejected",
              approvedAt: null,
              approvedBy: null,
              rejectedAt: timestamp,
              rejectionReason: reason ?? null,
              moderationLogs: [...(conf.moderationLogs ?? []), logEntry],
            }
          : conf
      )
    );
    setPendingReasons((prev) => ({ ...prev, [id]: "" }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.roleBar}>
        <Text style={styles.roleLabel}>Sesión actual: {role === "admin" ? "Administrador" : "Persona"}</Text>
        <View style={styles.roleButtons}>
          {(["persona", "admin"] as Role[]).map((option) => (
            <TouchableOpacity
              key={option}
              style={[styles.roleButton, role === option && styles.roleButtonActive]}
              onPress={() => setRole(option)}
            >
              <Text style={[styles.roleButtonText, role === option && styles.roleButtonTextActive]}>
                {option === "admin" ? "Cambiar a Admin" : "Cambiar a Persona"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {role === "admin" ? (
          <>
            <Text style={styles.sectionTitle}>Pendientes por aprobar</Text>
            {pendingConfesiones.length === 0 ? (
              <Text style={styles.emptyText}>No hay confesiones pendientes.</Text>
            ) : (
              pendingConfesiones.map((conf) => (
                <View key={conf.id} style={styles.card}>
                  <Text style={styles.cardTitle}>{conf.nexo}</Text>
                  <Text style={styles.cardContent}>{conf.content}</Text>
                  <Text style={styles.cardMeta}>{conf.carrera ?? "Carrera no especificada"}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Motivo del rechazo (opcional)"
                    placeholderTextColor="#8e8e93"
                    value={pendingReasons[conf.id] ?? ""}
                    onChangeText={(text) => setPendingReasons((prev) => ({ ...prev, [conf.id]: text }))}
                  />
                  <View style={styles.actionsRow}>
                    <TouchableOpacity style={[styles.actionButton, styles.approveButton]} onPress={() => handleApprove(conf.id)}>
                      <Text style={styles.actionText}>Aprobar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionButton, styles.rejectButton]} onPress={() => handleReject(conf.id)}>
                      <Text style={styles.actionText}>Rechazar</Text>
                    </TouchableOpacity>
                  </View>
                  {(conf.moderationLogs ?? []).length > 0 && (
                    <View style={styles.logContainer}>
                      <Text style={styles.logTitle}>Auditoría</Text>
                      {(conf.moderationLogs ?? []).map((log) => (
                        <View key={log.id} style={styles.logItem}>
                          <Text style={[styles.logAction, log.action === "approved" ? styles.logApproved : styles.logRejected]}>
                            {log.action === "approved" ? "Aprobado" : "Rechazado"}
                          </Text>
                          <Text style={styles.logMeta}>{new Date(log.timestamp).toLocaleString()}</Text>
                          <Text style={styles.logMeta}>{log.user.name}</Text>
                          {!!log.reason && <Text style={styles.logReason}>Motivo: {log.reason}</Text>}
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))
            )}

            <Text style={styles.sectionTitle}>Rechazadas recientemente</Text>
            {rejectedConfesiones.length === 0 ? (
              <Text style={styles.emptyText}>No hay confesiones rechazadas.</Text>
            ) : (
              rejectedConfesiones.map((conf) => (
                <View key={conf.id} style={styles.cardMuted}>
                  <Text style={styles.cardTitle}>{conf.nexo}</Text>
                  <Text style={styles.cardContent}>{conf.content}</Text>
                  <Text style={styles.cardMeta}>
                    Rechazada el {conf.rejectedAt ? new Date(conf.rejectedAt).toLocaleString() : "—"}
                  </Text>
                  {!!conf.rejectionReason && <Text style={styles.cardMeta}>Motivo: {conf.rejectionReason}</Text>}
                </View>
              ))
            )}
          </>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Confesiones aprobadas</Text>
            {approvedConfesiones.length === 0 ? (
              <Text style={styles.emptyText}>No hay confesiones aprobadas aún.</Text>
            ) : (
              approvedConfesiones.map((conf) => (
                <View key={conf.id} style={styles.card}>
                  <Text style={styles.cardTitle}>{conf.nexo}</Text>
                  <Text style={styles.cardContent}>{conf.content}</Text>
                  <Text style={styles.cardMeta}>Categoría: {conf.category}</Text>
                  <Text style={styles.cardMeta}>Likes: {conf.likes}</Text>
                  <Text style={styles.cardMeta}>
                    Publicada el {conf.approvedAt ? new Date(conf.approvedAt).toLocaleString() : "—"} por {conf.approvedBy ?? "—"}
                  </Text>
                </View>
              ))
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#111" },
  roleBar: { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: "#1c1c1e" },
  roleLabel: { color: "#fff", fontSize: 16, fontWeight: "600" },
  roleButtons: { flexDirection: "row", marginTop: 12, gap: 8 },
  roleButton: { flex: 1, padding: 10, borderRadius: 8, backgroundColor: "#2c2c2e" },
  roleButtonActive: { backgroundColor: "#0a84ff" },
  roleButtonText: { color: "#fff", textAlign: "center", fontWeight: "500" },
  roleButtonTextActive: { color: "#fff" },
  scrollContent: { padding: 16, gap: 16 },
  sectionTitle: { color: "#f2f2f7", fontSize: 18, fontWeight: "700" },
  emptyText: { color: "#8e8e93" },
  card: { backgroundColor: "#1c1c1e", borderRadius: 12, padding: 16, gap: 8 },
  cardMuted: { backgroundColor: "#2c2c2e", borderRadius: 12, padding: 16, gap: 8 },
  cardTitle: { color: "#f5f5f5", fontSize: 16, fontWeight: "600" },
  cardContent: { color: "#d1d1d6", fontSize: 15, lineHeight: 20 },
  cardMeta: { color: "#8e8e93", fontSize: 13 },
  input: { backgroundColor: "#2c2c2e", color: "#fff", padding: 10, borderRadius: 8, fontSize: 14 },
  actionsRow: { flexDirection: "row", gap: 10 },
  actionButton: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: "center" },
  approveButton: { backgroundColor: "#30d158" },
  rejectButton: { backgroundColor: "#ff3b30" },
  actionText: { color: "#fff", fontWeight: "600" },
  logContainer: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#2f2f31", gap: 8 },
  logTitle: { color: "#f5f5f5", fontWeight: "600" },
  logItem: { backgroundColor: "#2c2c2e", borderRadius: 8, padding: 10, gap: 4 },
  logAction: { fontSize: 13, fontWeight: "700" },
  logApproved: { color: "#30d158" },
  logRejected: { color: "#ff453a" },
  logMeta: { color: "#8e8e93", fontSize: 12 },
  logReason: { color: "#ffd60a", fontSize: 12 },
});
