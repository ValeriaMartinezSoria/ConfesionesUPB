
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCohpfAh-jLbQg2OWUrEvN7J4xGyZq6S1U",
  authDomain: "confesionesupb-7451d.firebaseapp.com",
  projectId: "confesionesupb-7451d",
  storageBucket: "confesionesupb-7451d.firebasestorage.app",
  messagingSenderId: "705802386231",
  appId: "1:705802386231:web:eee7c6e45ce4103e3ef8b2",
  measurementId: "G-ZL6MP43HTZ"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
