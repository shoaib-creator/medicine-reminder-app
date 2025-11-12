import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { 
  signUpWithEmail, 
  signInWithEmail, 
  useGoogleSignIn, 
  handleGoogleSignIn,
  onAuthChange 
} from "../utils/authService";

const { width } = Dimensions.get("window");

export default function AuthScreen() {
  const router = useRouter();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Google Sign-In
  const { request, response, promptAsync } = useGoogleSignIn();

  useEffect(() => {
    // Check if user is already authenticated
    const unsubscribe = onAuthChange((user) => {
      if (user) {
        router.replace("/home");
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      handleGoogleAuth(id_token);
    }
  }, [response]);

  const handleGoogleAuth = async (idToken: string) => {
    try {
      setIsAuthenticating(true);
      setError(null);
      await handleGoogleSignIn(idToken);
      router.replace("/home");
    } catch (err: any) {
      setError(err.message || "Google sign-in failed");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleEmailAuth = async () => {
    try {
      setIsAuthenticating(true);
      setError(null);

      if (!email || !password) {
        setError("Please fill in all fields");
        return;
      }

      if (isSignUp && password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      if (isSignUp) {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
      
      router.replace("/home");
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <LinearGradient colors={["#4CAF50", "#2E7D32"]} style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Ionicons name="medical" size={80} color="white" />
            </View>

            <Text style={styles.title}>MedRemind</Text>
            <Text style={styles.subtitle}>Your Personal Medication Assistant</Text>

            <View style={styles.card}>
              <Text style={styles.welcomeText}>
                {isSignUp ? "Create Account" : "Welcome Back!"}
              </Text>
              <Text style={styles.instructionText}>
                {isSignUp 
                  ? "Sign up to start managing your medications" 
                  : "Sign in to access your medications"}
              </Text>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>

              {/* Confirm Password (Sign Up Only) */}
              {isSignUp && (
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    placeholderTextColor="#999"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    autoCapitalize="none"
                  />
                </View>
              )}

              {/* Email/Password Auth Button */}
              <TouchableOpacity
                style={[styles.button, isAuthenticating && styles.buttonDisabled]}
                onPress={handleEmailAuth}
                disabled={isAuthenticating}
              >
                <Ionicons
                  name="mail-outline"
                  size={24}
                  color="white"
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>
                  {isAuthenticating 
                    ? "Processing..." 
                    : isSignUp 
                    ? "Sign Up" 
                    : "Sign In"}
                </Text>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Google Sign-In Button */}
              <TouchableOpacity
                style={[styles.googleButton, isAuthenticating && styles.buttonDisabled]}
                onPress={() => promptAsync()}
                disabled={!request || isAuthenticating}
              >
                <Ionicons
                  name="logo-google"
                  size={24}
                  color="#DB4437"
                  style={styles.buttonIcon}
                />
                <Text style={styles.googleButtonText}>
                  Sign in with Google
                </Text>
              </TouchableOpacity>

              {/* Toggle Sign Up/Sign In */}
              <TouchableOpacity
                style={styles.toggleButton}
                onPress={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                  setConfirmPassword("");
                }}
              >
                <Text style={styles.toggleButtonText}>
                  {isSignUp 
                    ? "Already have an account? Sign In" 
                    : "Don't have an account? Sign Up"}
                </Text>
              </TouchableOpacity>

              {error && (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={20} color="#f44336" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: 120,
    height: 120,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 40,
    textAlign: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    width: width - 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e0e0e0",
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#999",
    fontSize: 14,
  },
  googleButton: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  googleButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
  toggleButton: {
    marginTop: 20,
  },
  toggleButtonText: {
    color: "#4CAF50",
    fontSize: 14,
    fontWeight: "600",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    padding: 10,
    backgroundColor: "#ffebee",
    borderRadius: 8,
  },
  errorText: {
    color: "#f44336",
    marginLeft: 8,
    fontSize: 14,
  },
});
