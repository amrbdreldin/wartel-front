import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeFirestore, getFirestore } from "firebase/firestore";

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Debug: verify env vars are loaded
console.log("[Firebase] projectId:", firebaseConfig.projectId, "| apiKey loaded:", !!firebaseConfig.apiKey);

// Initialize Firebase only once and ensure it is SSR-safe
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Use initializeFirestore with experimentalForceLongPolling to bypass WebSocket/gRPC stream blocking from local ISPs (e.g. in Egypt)
let firestoreDb;
try {
  firestoreDb = initializeFirestore(app, {
    experimentalForceLongPolling: true,
  });
  console.log("[Firebase] ✅ Firestore initialized WITH long polling");
} catch (error) {
  firestoreDb = getFirestore(app);
  console.log("[Firebase] ⚠️ Firestore fallback (already initialized):", (error as Error).message);
}

export const db = firestoreDb;

