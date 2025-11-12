import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "@react-navigation/native";
import {
  getClinicInventory,
  ClinicInventory,
  updateInventoryItem,
  deleteInventoryItem,
} from "../../utils/firebaseService";

export default function ClinicManagementScreen() {
  const router = useRouter();
  const [inventory, setInventory] = useState<ClinicInventory[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  // For demo purposes, using a hardcoded clinic ID
  // In production, this should come from user authentication
  const [clinicId] = useState("demo-clinic-001");

  const loadInventory = useCallback(async () => {
    try {
      const items = await getClinicInventory(clinicId);
      setInventory(items);
    } catch (error) {
      console.error("Error loading inventory:", error);
      Alert.alert("Error", "Failed to load inventory. Please try again.");
    }
  }, [clinicId]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadInventory();
    setRefreshing(false);
  }, [loadInventory]);

  useFocusEffect(
    useCallback(() => {
      loadInventory();
    }, [loadInventory])
  );

  const handleUpdateQuantity = async (item: ClinicInventory, newQuantity: number) => {
    try {
      if (item.id) {
        await updateInventoryItem(item.id, { quantity: newQuantity });
        await loadInventory();
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      Alert.alert("Error", "Failed to update quantity. Please try again.");
    }
  };

  const handleDeleteItem = async (item: ClinicInventory) => {
    Alert.alert(
      "Delete Item",
      `Are you sure you want to delete ${item.medicineName}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              if (item.id) {
                await deleteInventoryItem(item.id);
                await loadInventory();
              }
            } catch (error) {
              console.error("Error deleting item:", error);
              Alert.alert("Error", "Failed to delete item. Please try again.");
            }
          },
        },
      ]
    );
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) {
      return { status: "Out of Stock", color: "#F44336", backgroundColor: "#FFEBEE" };
    } else if (quantity <= 10) {
      return { status: "Low Stock", color: "#FF9800", backgroundColor: "#FFF3E0" };
    } else {
      return { status: "In Stock", color: "#4CAF50", backgroundColor: "#E8F5E9" };
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
          <Text style={styles.headerTitle}>Clinic Inventory</Text>
          <TouchableOpacity
            onPress={() => router.push("/clinic/add-inventory")}
            style={styles.addButton}
          >
            <Ionicons name="add" size={28} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.inventoryContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {inventory.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="medical-outline" size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>No medicines in inventory</Text>
              <TouchableOpacity
                style={styles.emptyAddButton}
                onPress={() => router.push("/clinic/add-inventory")}
              >
                <Text style={styles.emptyAddButtonText}>Add Medicine</Text>
              </TouchableOpacity>
            </View>
          ) : (
            inventory.map((item) => {
              const stockStatus = getStockStatus(item.quantity);

              return (
                <View key={item.id} style={styles.inventoryCard}>
                  <View style={styles.inventoryHeader}>
                    <View style={styles.inventoryInfo}>
                      <Text style={styles.medicineName}>{item.medicineName}</Text>
                      <Text style={styles.dosage}>{item.dosage}</Text>
                      {item.price && (
                        <Text style={styles.price}>Price: ${item.price}</Text>
                      )}
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: stockStatus.backgroundColor },
                      ]}
                    >
                      <Text style={[styles.statusText, { color: stockStatus.color }]}>
                        {stockStatus.status}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.quantityContainer}>
                    <Text style={styles.quantityLabel}>Quantity:</Text>
                    <View style={styles.quantityControls}>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => handleUpdateQuantity(item, Math.max(0, item.quantity - 10))}
                      >
                        <Ionicons name="remove" size={20} color="#1a8e2d" />
                      </TouchableOpacity>
                      <Text style={styles.quantityValue}>{item.quantity}</Text>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => handleUpdateQuantity(item, item.quantity + 10)}
                      >
                        <Ionicons name="add" size={20} color="#1a8e2d" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteItem(item)}
                    >
                      <Ionicons name="trash-outline" size={20} color="#F44336" />
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>

                  {item.lastUpdated && (
                    <Text style={styles.lastUpdated}>
                      Updated: {new Date(item.lastUpdated).toLocaleString()}
                    </Text>
                  )}
                </View>
              );
            })
          )}
        </ScrollView>
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
    justifyContent: "space-between",
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
    fontSize: 24,
    fontWeight: "700",
    color: "white",
    flex: 1,
    marginLeft: 15,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  inventoryContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  inventoryCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inventoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  inventoryInfo: {
    flex: 1,
  },
  medicineName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  dosage: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    color: "#1a8e2d",
    fontWeight: "600",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  quantityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginHorizontal: 16,
    minWidth: 40,
    textAlign: "center",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#FFEBEE",
  },
  deleteButtonText: {
    color: "#F44336",
    fontWeight: "600",
    marginLeft: 4,
  },
  lastUpdated: {
    fontSize: 12,
    color: "#999",
    marginTop: 8,
  },
  emptyState: {
    alignItems: "center",
    padding: 30,
    backgroundColor: "white",
    borderRadius: 16,
    marginTop: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
    marginBottom: 20,
  },
  emptyAddButton: {
    backgroundColor: "#1a8e2d",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  emptyAddButtonText: {
    color: "white",
    fontWeight: "600",
  },
});
