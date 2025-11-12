import { 
  auth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithCredential,
  onAuthStateChanged,
  User
} from "../config/firebase";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

// Complete the authentication session
WebBrowser.maybeCompleteAuthSession();

// Google Sign-In Configuration
const GOOGLE_CLIENT_ID = "15279474585-YOUR_CLIENT_ID.apps.googleusercontent.com"; // Update this with actual client ID

export interface AuthService {
  signUpWithEmail: (email: string, password: string) => Promise<User>;
  signInWithEmail: (email: string, password: string) => Promise<User>;
  signInWithGoogle: () => Promise<User | null>;
  signOut: () => Promise<void>;
  onAuthChange: (callback: (user: User | null) => void) => () => void;
  getCurrentUser: () => User | null;
}

// Sign up with email and password
export async function signUpWithEmail(email: string, password: string): Promise<User> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error("Error signing up:", error);
    throw new Error(error.message || "Failed to sign up");
  }
}

// Sign in with email and password
export async function signInWithEmail(email: string, password: string): Promise<User> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error("Error signing in:", error);
    throw new Error(error.message || "Failed to sign in");
  }
}

// Sign out
export async function signOutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error("Error signing out:", error);
    throw new Error(error.message || "Failed to sign out");
  }
}

// Get current user
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

// Listen to auth state changes
export function onAuthChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

// Google Sign-In hook
export function useGoogleSignIn() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: GOOGLE_CLIENT_ID,
    iosClientId: GOOGLE_CLIENT_ID,
    androidClientId: GOOGLE_CLIENT_ID,
    webClientId: GOOGLE_CLIENT_ID,
  });

  return { request, response, promptAsync };
}

// Handle Google Sign-In
export async function handleGoogleSignIn(idToken: string): Promise<User | null> {
  try {
    const credential = GoogleAuthProvider.credential(idToken);
    const userCredential = await signInWithCredential(auth, credential);
    return userCredential.user;
  } catch (error: any) {
    console.error("Error signing in with Google:", error);
    throw new Error(error.message || "Failed to sign in with Google");
  }
}

export const authService: AuthService = {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle: async () => {
    throw new Error("Please use the Google Sign-In button in the UI");
  },
  signOut: signOutUser,
  onAuthChange,
  getCurrentUser,
};
