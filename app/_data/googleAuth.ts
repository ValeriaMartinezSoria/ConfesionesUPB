// Utilidades para Google Sign-In
// NOTA: Necesitas instalar: expo install @react-native-google-signin/google-signin

import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";

/**
 * Iniciar sesión con Google
 * @param idToken - Token de Google obtenido de @react-native-google-signin/google-signin
 * @returns Usuario autenticado
 */
export async function signInWithGoogle(idToken: string) {
  try {
    // Crear credencial de Firebase con el token de Google
    const credential = GoogleAuthProvider.credential(idToken);
    
    // Autenticar con Firebase
    const userCredential = await signInWithCredential(auth, credential);
    const user = userCredential.user;

    // Verificar si el usuario ya existe en Firestore
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    // Si es un nuevo usuario, crear documento en Firestore
    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
        pushToken: null,
        provider: "google",
      });
    }

    return user;
  } catch (error: any) {
    console.error("Error en Google Sign-In:", error);
    throw error;
  }
}

/**
 * EJEMPLO DE USO:
 * 
 * import { GoogleSignin } from '@react-native-google-signin/google-signin';
 * import { signInWithGoogle } from '../_data/googleAuth';
 * 
 * // Configurar en _layout.tsx:
 * GoogleSignin.configure({
 *   webClientId: 'TU_WEB_CLIENT_ID.apps.googleusercontent.com',
 * });
 * 
 * // En el componente de Login:
 * const handleGoogleSignIn = async () => {
 *   try {
 *     await GoogleSignin.hasPlayServices();
 *     const { idToken } = await GoogleSignin.signIn();
 *     
 *     if (idToken) {
 *       const user = await signInWithGoogle(idToken);
 *       router.replace('/');
 *     }
 *   } catch (error) {
 *     Alert.alert('Error', 'No se pudo iniciar sesión con Google');
 *   }
 * };
 */
