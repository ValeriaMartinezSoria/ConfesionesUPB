import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../_data/firebase";
import { useAuth } from "../../src/auth/authProvider";

export type UserRole = "admin" | "user";

export interface UserProfile {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  role: UserRole;
}

export function useAppProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const docRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const rawRole = data.role ?? data.rol;
          const normalizedRole = typeof rawRole === "string"
            ? rawRole.toLowerCase().trim()
            : "";
          const role: UserRole = normalizedRole === "admin" ? "admin" : "user";

          setProfile({
            uid: user.uid,
            email: user.email || undefined,
            displayName: user.displayName || undefined,
            photoURL: user.photoURL || undefined,
            role,
          });
        } else {
          setProfile({
            uid: user.uid,
            email: user.email || undefined,
            displayName: user.displayName || undefined,
            photoURL: user.photoURL || undefined,
            role: "user",
          });
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error loading profile:", error);
        setProfile({
          uid: user.uid,
          email: user.email || undefined,
          displayName: user.displayName || undefined,
          photoURL: user.photoURL || undefined,
          role: "user",
        });
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return { profile, loading };
}
