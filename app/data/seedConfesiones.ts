
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import { seedAprobadas } from "./seed";

export const subirSeed = async () => {
  try {
    for (const conf of seedAprobadas) {
      await addDoc(collection(db, "confesiones"), {
        ...conf,
        status: "approved",
        approvedAt: Date.now(),
        approvedBy: "Seed",
        moderationLogs: [],
      });
    }
    console.log("Seed subida correctamente a Firestore");
  } catch (error) {
    console.error(" Error al subir el seed:", error);
  }
};
