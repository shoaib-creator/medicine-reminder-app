import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "@react-navigation/native";
import {
  getClinicInventory,
  ClinicInventory,
} from "../utils/firebaseService";
import { signOutUser } from "../utils/authService";
import { getCurrentUser } from "../utils/authService";

const { width } = Dimensions.get("window");

const CLINIC_QUICK_ACTIONS = [
  {
    icon: "add-circle-outline" as const,
    label: "Add\nInventory",
    route: "/clinic/add-inventory" as const,
    color: "#2E7D32",
    gradient: ["#4CAF50", "#2E7D32"] as [string, string],
  },
  {
    icon: "business-outline" as const,
    label: "Manage\nInventory",
    route: "/clinic" as const,
    color: "#F57C00",
    gradient: ["#FF9800", "#F57C00"] as [string, string],
  },
];

export default function ClinicHomeScreen() {
  const router = useRouter();
  const [inventory, setInventory] = useState<ClinicInventory[]>([]);
  const [clinicId] = useState("demo-clinic-001"); // In production, get from user profile
  const [lowStockCount, setLowStockCount] = useState(0);
  const [outOfStockCount, setOutOfStockCount] = useState(0);

  const loadInventory = useCallback(async () => {
    try {
      const items = await getClinicInventory(clinicId);
      setInventory(items);
      
      // Calculate stock statistics
      const lowStock = items.filter(item => item.quantity > 0 && item.quantity <= 10).length;
      const outOfStock = items.filter(item => item.quantity === 0).length;
      setLowStockCount(lowStock);
      setOutOfStockCount(outOfStock);
    } catch (error) {
      console.error("Error loading inventory:", error);
    }
  }, [clinicId]);

  useEffect(() => {
    loadInventory();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadInventory();
    }, [loadInventory])
  );

  const handleSignOut = async () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            try {
              await signOutUser();
              router.replace("/auth");
            } catch (error) {
              Alert.alert("Error", "Failed to sign out. Please try again.");
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={["#1a8e2d", "#146922"]} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View style={styles.flex1}>
              <Text style={styles.greeting}>Clinic Dashboard</Text>
              <Text style={styles.subGreeting}>Manage your inventory</Text>
            </View>
            <TouchableOpacity
              style={styles.signOutButton}
              onPress={handleSignOut}
            >
              <Ionicons name="log-out-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Statistics Cards */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Ionicons name="cube-outline" size={32} color="#4CAF50" />
              </View>
              <Text style={styles.statValue}>{inventory.length}</Text>
              <Text style={styles.statLabel}>Total Items</Text>
            </View>
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Ionicons name="alert-circle-outline" size={32} color="#FF9800" />
              </View>
              <Text style={styles.statValue}>{lowStockCount}</Text>
              <Text style={styles.statLabel}>Low Stock</Text>
            </View>
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Ionicons name="close-circle-outline" size={32} color="#F44336" />
              </View>
              <Text style={styles.statValue}>{outOfStockCount}</Text>
              <Text style={styles.statLabel}>Out of Stock</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {CLINIC_QUICK_ACTIONS.map((action) => (
              <TouchableOpacity
                key={action.label}
                style={styles.actionButton}
                onPress={() => router.push(action.route)}
              >
                <LinearGradient
                  colors={action.gradient}
                  style={styles.actionGradient}
                >
                  <View style={styles.actionContent}>
                    <View style={styles.actionIcon}>
                      <Ionicons name={action.icon} size={28} color="white" />
                    </View>
                    <Text style={styles.actionLabel}>{action.label}</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Inventory</Text>
            <TouchableOpacity onPress={() => router.push("/clinic")}>
              <Text style={styles.seeAllButton}>See All</Text>
            </TouchableOpacity>
          </View>
          {inventory.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="medical-outline" size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>
                No inventory items yet
              </Text>
              <TouchableOpacity
                style={styles.addInventoryButton}
                onPress={() => router.push("/clinic/add-inventory")}
              >
                <Text style={styles.addInventoryButtonText}>
                  Add Inventory
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            inventory.slice(0, 5).map((item) => {
              const getStockStatus = (quantity: number) => {
                if (quantity === 0) return { color: "#F44336", text: "Out of Stock" };
                if (quantity <= 10) return { color: "#FF9800", text: "Low Stock" };
                return { color: "#4CAF50", text: "In Stock" };
              };
              
              const status = getStockStatus(item.quantity);
              
              return (
                <View key={item.id} style={styles.inventoryCard}>
                  <View style={styles.inventoryIcon}>
                    <Ionicons name="medical" size={24} color="#4CAF50" />
                  </View>
                  <View style={styles.inventoryInfo}>
                    <Text style={styles.medicineName}>{item.medicineName}</Text>
                    <Text style={styles.dosage}>{item.dosage}</Text>
                    <View style={styles.quantityRow}>
                      <Text style={styles.quantityLabel}>Qty: </Text>
                      <Text style={[styles.quantityValue, { color: status.color }]}>
                        {item.quantity}
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: `${status.color}15` }]}>
                    <Text style={[styles.statusText, { color: status.color }]}>
                      {status.text}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
  },
  subGreeting: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
  },
  flex1: {
    flex: 1,
  },
  signOutButton: {
    padding: 8,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 12,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 15,
  },
  actionButton: {
    width: (width - 52) / 2,
    height: 110,
    borderRadius: 16,
    overflow: "hidden",
  },
  actionGradient: {
    flex: 1,
    padding: 15,
  },
  actionContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
    marginTop: 8,
  },
  section: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 5,
  },
  seeAllButton: {
    color: "#2E7D32",
    fontWeight: "600",
  },
  inventoryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  inventoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  inventoryInfo: {
    flex: 1,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  dosage: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityLabel: {
    fontSize: 14,
    color: "#666",
  },
  quantityValue: {
    fontSize: 14,
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
  emptyState: {
    alignItems: "center",
    padding: 30,
    backgroundColor: "white",
    borderRadius: 16,
    marginTop: 10,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
    marginBottom: 20,
  },
  addInventoryButton: {
    backgroundColor: "#1a8e2d",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  addInventoryButtonText: {
    color: "white",
    fontWeight: "600",
  },
});
