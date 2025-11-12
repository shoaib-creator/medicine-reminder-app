// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  initializeAuth,
  getReactNativePersistence,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithCredential,
  onAuthStateChanged,
  User
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  where,
  Timestamp 
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC_TmJwhxBjvi5ovKNZLfYZv-0NrZ5wvgs",
  authDomain: "mdicine-reminder.firebaseapp.com",
  projectId: "mdicine-reminder",
  storageBucket: "mdicine-reminder.firebasestorage.app",
  messagingSenderId: "15279474585",
  appId: "1:15279474585:web:0d830ecfc797866c79b508",
  measurementId: "G-Z8X946PDQY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence for React Native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore
const db = getFirestore(app);

// Analytics (only works on web)
let analytics = null;
try {
  analytics = getAnalytics(app);
} catch {
  console.log("Analytics not available in this environment");
}

// Export Firebase services
export { 
  app, 
  auth, 
  db, 
  analytics,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithCredential,
  onAuthStateChanged,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  Timestamp
};

export type { User };
