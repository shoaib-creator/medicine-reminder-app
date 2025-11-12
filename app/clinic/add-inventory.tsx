import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { addInventoryItem } from "../../utils/appwriteService";

export default function AddInventoryScreen() {
  const router = useRouter();
  const [form, setForm] = useState({
    medicineName: "",
    dosage: "",
    quantity: "",
    price: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  // For demo purposes, using a hardcoded clinic ID
  const clinicId = "demo-clinic-001";

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!form.medicineName.trim()) {
      newErrors.medicineName = "Medicine name is required";
    }

    if (!form.dosage.trim()) {
      newErrors.dosage = "Dosage is required";
    }

    if (!form.quantity.trim()) {
      newErrors.quantity = "Quantity is required";
    } else if (isNaN(Number(form.quantity)) || Number(form.quantity) < 0) {
      newErrors.quantity = "Quantity must be a valid number";
    }

    if (form.price && (isNaN(Number(form.price)) || Number(form.price) < 0)) {
      newErrors.price = "Price must be a valid number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    try {
      if (!validateForm()) {
        Alert.alert("Error", "Please fill in all required fields correctly");
        return;
      }

      if (isSubmitting) return;
      setIsSubmitting(true);

      await addInventoryItem({
        clinicId,
        medicineName: form.medicineName,
        dosage: form.dosage,
        quantity: Number(form.quantity),
        price: form.price ? Number(form.price) : undefined,
      });

      Alert.alert(
        "Success",
        "Medicine added to inventory successfully",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error("Save error:", error);
      Alert.alert(
        "Error",
        "Failed to add medicine to inventory. Please try again.",
        [{ text: "OK" }],
        { cancelable: false }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1a8e2d", "#146922"]}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={28} color="#1a8e2d" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Medicine</Text>
        </View>

        <ScrollView
          style={styles.formContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.formContentContainer}
        >
          <View style={styles.section}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Medicine Name *</Text>
              <TextInput
                style={[styles.input, errors.medicineName && styles.inputError]}
                placeholder="e.g., Aspirin"
                placeholderTextColor="#999"
                value={form.medicineName}
                onChangeText={(text) => {
                  setForm({ ...form, medicineName: text });
                  if (errors.medicineName) {
                    setErrors({ ...errors, medicineName: "" });
                  }
                }}
              />
              {errors.medicineName && (
                <Text style={styles.errorText}>{errors.medicineName}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Dosage *</Text>
              <TextInput
                style={[styles.input, errors.dosage && styles.inputError]}
                placeholder="e.g., 500mg"
                placeholderTextColor="#999"
                value={form.dosage}
                onChangeText={(text) => {
                  setForm({ ...form, dosage: text });
                  if (errors.dosage) {
                    setErrors({ ...errors, dosage: "" });
                  }
                }}
              />
              {errors.dosage && (
                <Text style={styles.errorText}>{errors.dosage}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Quantity *</Text>
              <TextInput
                style={[styles.input, errors.quantity && styles.inputError]}
                placeholder="e.g., 100"
                placeholderTextColor="#999"
                value={form.quantity}
                onChangeText={(text) => {
                  setForm({ ...form, quantity: text });
                  if (errors.quantity) {
                    setErrors({ ...errors, quantity: "" });
                  }
                }}
                keyboardType="numeric"
              />
              {errors.quantity && (
                <Text style={styles.errorText}>{errors.quantity}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Price (Optional)</Text>
              <TextInput
                style={[styles.input, errors.price && styles.inputError]}
                placeholder="e.g., 9.99"
                placeholderTextColor="#999"
                value={form.price}
                onChangeText={(text) => {
                  setForm({ ...form, price: text });
                  if (errors.price) {
                    setErrors({ ...errors, price: "" });
                  }
                }}
                keyboardType="decimal-pad"
              />
              {errors.price && (
                <Text style={styles.errorText}>{errors.price}</Text>
              )}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.saveButton,
              isSubmitting && styles.saveButtonDisabled,
            ]}
            onPress={handleSave}
            disabled={isSubmitting}
          >
            <LinearGradient
              colors={["#1a8e2d", "#146922"]}
              style={styles.saveButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.saveButtonText}>
                {isSubmitting ? "Adding..." : "Add to Inventory"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
            disabled={isSubmitting}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  headerGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: Platform.OS === "ios" ? 140 : 120,
  },
  content: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 50 : 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
    zIndex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "white",
    marginLeft: 15,
  },
  formContainer: {
    flex: 1,
  },
  formContentContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  inputError: {
    borderColor: "#FF5252",
  },
  errorText: {
    color: "#FF5252",
    fontSize: 12,
    marginTop: 4,
  },
  footer: {
    padding: 20,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  saveButton: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
  },
  saveButtonGradient: {
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  cancelButton: {
    paddingVertical: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
});
