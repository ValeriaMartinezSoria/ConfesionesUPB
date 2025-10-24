import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView, View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useConfesionesStore, type ModeratorInfo } from "./app/store/useConfesionesStore";

type Role = "admin" | "persona";

// ✅ Tipos locales simplificados (las categorías se toman del store)
type Category = "academico" | "amor" | "confesion";

export default function App() {
  const [role, setRole] = useState<Role>("persona");
  const [pendingReasons, setPendingReasons] = useState<Partial<Record<number, string>>>({});
  
  // ✅ Estados del formulario
  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category>("academico");
  const [selectedCarrera, setSelectedCarrera] = useState<string>("Ingeniería de Sistemas");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ ORDEN CORRECTO: Hooks del store primero
  const pendientes = useConfesionesStore((s) => s.pendientes);
  const rechazadas = useConfesionesStore((s) => s.rechazadas);
  const addPendiente = useConfesionesStore((s) => s.addPendiente);
  const getAprobadasSorted = useConfesionesStore((s) => s.getAprobadasSorted);
  const loadConfesiones = useConfesionesStore((s) => s.loadConfesiones);
  const approveConfesion = useConfesionesStore((s) => s.approve);
  const rejectConfesion = useConfesionesStore((s) => s.reject);

  // ✅ Ahora los useMemo pueden usar las variables anteriores
  const approvedConfesiones = useMemo(() => getAprobadasSorted([]), [getAprobadasSorted]);

  const categoryOptions: Category[] = ["academico", "amor", "confesion"];
  
  const carreraOptions = [
    "Ingeniería de Sistemas",
    "Administración de Empresas",
    "Psicología",
    "Derecho",
    "Medicina",
    "Arquitectura",
    "Comunicación",
  ];

  const currentUser = useMemo<ModeratorInfo>(
    () =>
      role === "admin"
        ? { id: "admin01", name: "Moderador General" }
        : { id: "persona01", name: "Estudiante Invitado" },
    [role]
  );

  useEffect(() => {
    loadConfesiones();
  }, [loadConfesiones]);
  useEffect(() => {
  const cargar = async () => {
    await loadConfesiones();
  };
  cargar();
}, []);

  const handleApprove = async (id: number) => {
    await approveConfesion(id, currentUser);
    setPendingReasons((prev) => ({ ...prev, [id]: "" }));
  };

  const handleReject = async (id: number) => {
    const reason = pendingReasons[id]?.trim();
    await rejectConfesion(id, reason, currentUser);
    setPendingReasons((prev) => ({ ...prev, [id]: "" }));
  };

  // ✅ Handler del formulario
  const handleSubmit = async () => {
    const trimmedContent = content.trim();
    if (trimmedContent.length < 10) {
      Alert.alert("⚠️ Incompleto", "Escribe al menos 10 caracteres.");
      return;
    }
    
    try {
      setIsSubmitting(true);
      const success = await addPendiente({
        content: trimmedContent,
        category: selectedCategory,
        carrera: selectedCarrera,
      });
      
      if (success) {
        setContent("");
        setSelectedCategory("academico");
        setSelectedCarrera("Ingeniería de Sistemas");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSubmitDisabled = isSubmitting || content.trim().length < 10;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      
      {/* Barra de cambio de rol */}
      <View style={styles.roleBar}>
        <Text style={styles.roleLabel}>
          Sesión actual: {role === "admin" ? "Administrador" : "Persona"}
        </Text>
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
            {/* VISTA ADMIN */}
            <Text style={styles.sectionTitle}>Pendientes por aprobar</Text>
            {pendientes.length === 0 ? (
              <Text style={styles.emptyText}>No hay confesiones pendientes.</Text>
            ) : (
              pendientes.map((conf) => (
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
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.approveButton]} 
                      onPress={() => handleApprove(conf.id)}
                    >
                      <Text style={styles.actionText}>Aprobar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.rejectButton]} 
                      onPress={() => handleReject(conf.id)}
                    >
                      <Text style={styles.actionText}>Rechazar</Text>
                    </TouchableOpacity>
                  </View>
                  
                  {/* Auditoría */}
                  {(conf.moderationLogs ?? []).length > 0 && (
                    <View style={styles.logContainer}>
                      <Text style={styles.logTitle}>Auditoría</Text>
                      {(conf.moderationLogs ?? []).map((log) => (
                        <View key={log.id} style={styles.logItem}>
                          <Text 
                            style={[
                              styles.logAction, 
                              log.action === "approved" ? styles.logApproved : styles.logRejected
                            ]}
                          >
                            {log.action === "approved" ? "Aprobado" : "Rechazado"}
                          </Text>
                          <Text style={styles.logMeta}>
                            {new Date(log.timestamp).toLocaleString()}
                          </Text>
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
            {rechazadas.length === 0 ? (
              <Text style={styles.emptyText}>No hay confesiones rechazadas.</Text>
            ) : (
              rechazadas.map((conf) => (
                <View key={conf.id} style={styles.cardMuted}>
                  <Text style={styles.cardTitle}>{conf.nexo}</Text>
                  <Text style={styles.cardContent}>{conf.content}</Text>
                  <Text style={styles.cardMeta}>
                    Rechazada el {conf.rejectedAt ? new Date(conf.rejectedAt).toLocaleString() : "—"}
                  </Text>
                  {!!conf.rejectionReason && (
                    <Text style={styles.cardMeta}>Motivo: {conf.rejectionReason}</Text>
                  )}
                </View>
              ))
            )}
          </>
        ) : (
          <>
            {/* VISTA PERSONA */}
            <Text style={styles.sectionTitle}>✍️ Enviar nueva confesión</Text>
            <View style={styles.formCard}>
              <TextInput
                style={styles.formTextArea}
                multiline
                placeholder="Escribe tu confesión..."
                placeholderTextColor="#8e8e93"
                value={content}
                onChangeText={setContent}
                numberOfLines={4}
              />
              
              <Text style={styles.sectionSubtitle}>Categoría</Text>
              <View style={styles.categoryButtons}>
                {categoryOptions.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryButton,
                      selectedCategory === cat && styles.categoryButtonActive
                    ]}
                    onPress={() => setSelectedCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.categoryButtonText,
                        selectedCategory === cat && styles.categoryButtonTextActive
                      ]}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <Text style={styles.sectionSubtitle}>Carrera</Text>
              <View style={styles.categoryButtons}>
                {carreraOptions.map((car) => (
                  <TouchableOpacity
                    key={car}
                    style={[
                      styles.categoryButton,
                      selectedCarrera === car && styles.categoryButtonActive
                    ]}
                    onPress={() => setSelectedCarrera(car)}
                  >
                    <Text
                      style={[
                        styles.categoryButtonText,
                        selectedCarrera === car && styles.categoryButtonTextActive
                      ]}
                    >
                      {car}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <TouchableOpacity
                style={[styles.submitButton, isSubmitDisabled && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={isSubmitDisabled}
              >
                <Text style={styles.submitButtonText}>
                  {isSubmitting ? "Enviando..." : "📤 Enviar Confesión"}
                </Text>
              </TouchableOpacity>
            </View>

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
  sectionTitle: { color: "#f2f2f7", fontSize: 18, fontWeight: "700", marginTop: 8 },
  sectionSubtitle: { color: "#f5f5f5", fontSize: 14, fontWeight: "600", marginTop: 8 },
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
  formCard: { backgroundColor: "#1c1c1e", borderRadius: 12, padding: 16, gap: 14 },
  formTextArea: { 
    backgroundColor: "#2c2c2e", 
    color: "#fff", 
    borderRadius: 12, 
    padding: 16, 
    minHeight: 120, 
    textAlignVertical: "top",
    fontSize: 15,
  },
  categoryButtons: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  categoryButton: { 
    backgroundColor: "#2c2c2e", 
    paddingVertical: 10, 
    paddingHorizontal: 16, 
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#3a3a3c",
  },
  categoryButtonActive: { 
    backgroundColor: "#0a84ff",
    borderColor: "#0a84ff",
  },
  categoryButtonText: { color: "#8e8e93", fontSize: 13, fontWeight: "600" },
  categoryButtonTextActive: { color: "#fff" },
  submitButton: { 
    backgroundColor: "#0a84ff", 
    borderRadius: 12, 
    paddingVertical: 16, 
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonDisabled: { opacity: 0.5 },
  submitButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});