import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import {
  findNearbyMedicine,
  MedicineLocation,
} from "../../utils/firebaseService";

export default function MedicineFinderScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<MedicineLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationPermission, setLocationPermission] = useState(false);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        setLocationPermission(true);
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } else {
        Alert.alert(
          "Location Permission",
          "Please enable location permission to find nearby clinics"
        );
      }
    } catch (error) {
      console.error("Error requesting location permission:", error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert("Error", "Please enter a medicine name to search");
      return;
    }

    if (!userLocation) {
      Alert.alert(
        "Location Required",
        "Please enable location permission to find nearby clinics"
      );
      return;
    }

    setLoading(true);
    try {
      const locations = await findNearbyMedicine(
        searchQuery,
        userLocation.latitude,
        userLocation.longitude
      );
      setResults(locations);
      
      if (locations.length === 0) {
        Alert.alert(
          "No Results",
          `No clinics found with ${searchQuery} in your area`
        );
      }
    } catch (error) {
      console.error("Search error:", error);
      Alert.alert("Error", "Failed to search for medicine. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const openMaps = (latitude: number, longitude: number, name: string) => {
    const scheme = Platform.select({
      ios: "maps:0,0?q=",
      android: "geo:0,0?q=",
    });
    const latLng = `${latitude},${longitude}`;
    const label = name;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    if (url) {
      Linking.openURL(url);
    }
  };

  const callClinic = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
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
          <Text style={styles.headerTitle}>Find Medicine</Text>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for medicine..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
            />
          </View>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearch}
            disabled={loading}
          >
            <LinearGradient
              colors={["#1a8e2d", "#146922"]}
              style={styles.searchButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.searchButtonText}>
                {loading ? "Searching..." : "Search"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {!locationPermission && (
          <View style={styles.warningContainer}>
            <Ionicons name="warning" size={20} color="#FF9800" />
            <Text style={styles.warningText}>
              Location permission required to find nearby clinics
            </Text>
            <TouchableOpacity
              style={styles.enableButton}
              onPress={requestLocationPermission}
            >
              <Text style={styles.enableButtonText}>Enable</Text>
            </TouchableOpacity>
          </View>
        )}

        <ScrollView
          style={styles.resultsContainer}
          showsVerticalScrollIndicator={false}
        >
          {results.length > 0 && (
            <Text style={styles.resultsCount}>
              Found {results.length} clinic{results.length !== 1 ? "s" : ""}
            </Text>
          )}

          {results.map((location, index) => (
            <View key={`${location.clinic.id}-${index}`} style={styles.resultCard}>
              <View style={styles.clinicHeader}>
                <View style={styles.clinicIconContainer}>
                  <Ionicons name="medical" size={24} color="#1a8e2d" />
                </View>
                <View style={styles.clinicInfo}>
                  <Text style={styles.clinicName}>{location.clinic.name}</Text>
                  {location.distance !== undefined && (
                    <Text style={styles.distance}>
                      {location.distance.toFixed(1)} km away
                    </Text>
                  )}
                </View>
              </View>

              <View style={styles.medicineInfo}>
                <Text style={styles.medicineLabel}>Available Medicine:</Text>
                <Text style={styles.medicineName}>
                  {location.inventory.medicineName} - {location.inventory.dosage}
                </Text>
                <Text style={styles.quantity}>
                  Quantity: {location.inventory.quantity} units
                </Text>
                {location.inventory.price && (
                  <Text style={styles.price}>
                    Price: ${location.inventory.price}
                  </Text>
                )}
              </View>

              <View style={styles.contactInfo}>
                <Text style={styles.address}>{location.clinic.address}</Text>
                <Text style={styles.phone}>{location.clinic.phone}</Text>
                {location.clinic.operatingHours && (
                  <Text style={styles.hours}>
                    Hours: {location.clinic.operatingHours}
                  </Text>
                )}
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => callClinic(location.clinic.phone)}
                >
                  <Ionicons name="call" size={20} color="white" />
                  <Text style={styles.actionButtonText}>Call</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.directionsButton]}
                  onPress={() =>
                    openMaps(
                      location.clinic.latitude,
                      location.clinic.longitude,
                      location.clinic.name
                    )
                  }
                >
                  <Ionicons name="navigate" size={20} color="white" />
                  <Text style={styles.actionButtonText}>Directions</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
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
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  searchButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  searchButtonGradient: {
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  searchButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  warningContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3E0",
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
  },
  warningText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: "#666",
  },
  enableButton: {
    backgroundColor: "#FF9800",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  enableButtonText: {
    color: "white",
    fontWeight: "600",
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  resultsCount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  resultCard: {
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
  clinicHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  clinicIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  clinicInfo: {
    flex: 1,
  },
  clinicName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  distance: {
    fontSize: 14,
    color: "#1a8e2d",
    fontWeight: "600",
  },
  medicineInfo: {
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  medicineLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  quantity: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  price: {
    fontSize: 14,
    color: "#1a8e2d",
    fontWeight: "600",
  },
  contactInfo: {
    marginBottom: 16,
  },
  address: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  phone: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  hours: {
    fontSize: 14,
    color: "#666",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1a8e2d",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  directionsButton: {
    backgroundColor: "#2196F3",
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
