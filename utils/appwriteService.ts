import { databases, APPWRITE_CONFIG, ID, Query } from "../config/appwrite";

export interface Clinic {
  $id?: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  latitude: number;
  longitude: number;
  operatingHours: string;
  verified: boolean;
  createdAt?: string;
}

export interface ClinicInventory {
  $id?: string;
  clinicId: string;
  medicineName: string;
  dosage: string;
  quantity: number;
  price?: number;
  lastUpdated?: string;
}

export interface MedicineLocation {
  clinic: Clinic;
  inventory: ClinicInventory;
  distance?: number;
}

// Clinic Management
export async function createClinic(clinic: Omit<Clinic, "$id" | "createdAt">): Promise<Clinic> {
  try {
    const response = await databases.createDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.clinics,
      ID.unique(),
      {
        ...clinic,
        createdAt: new Date().toISOString(),
      }
    );
    return response as unknown as Clinic;
  } catch (error) {
    console.error("Error creating clinic:", error);
    throw error;
  }
}

export async function getClinics(): Promise<Clinic[]> {
  try {
    const response = await databases.listDocuments(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.clinics
    );
    return response.documents as unknown as Clinic[];
  } catch (error) {
    console.error("Error getting clinics:", error);
    return [];
  }
}

export async function updateClinic(clinicId: string, updates: Partial<Clinic>): Promise<void> {
  try {
    await databases.updateDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.clinics,
      clinicId,
      updates
    );
  } catch (error) {
    console.error("Error updating clinic:", error);
    throw error;
  }
}

// Clinic Inventory Management
export async function addInventoryItem(
  item: Omit<ClinicInventory, "$id" | "lastUpdated">
): Promise<ClinicInventory> {
  try {
    const response = await databases.createDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.clinicInventory,
      ID.unique(),
      {
        ...item,
        lastUpdated: new Date().toISOString(),
      }
    );
    return response as unknown as ClinicInventory;
  } catch (error) {
    console.error("Error adding inventory item:", error);
    throw error;
  }
}

export async function getClinicInventory(clinicId: string): Promise<ClinicInventory[]> {
  try {
    const response = await databases.listDocuments(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.clinicInventory,
      [Query.equal("clinicId", clinicId)]
    );
    return response.documents as unknown as ClinicInventory[];
  } catch (error) {
    console.error("Error getting clinic inventory:", error);
    return [];
  }
}

export async function updateInventoryItem(
  itemId: string,
  updates: Partial<ClinicInventory>
): Promise<void> {
  try {
    await databases.updateDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.clinicInventory,
      itemId,
      {
        ...updates,
        lastUpdated: new Date().toISOString(),
      }
    );
  } catch (error) {
    console.error("Error updating inventory item:", error);
    throw error;
  }
}

export async function deleteInventoryItem(itemId: string): Promise<void> {
  try {
    await databases.deleteDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.clinicInventory,
      itemId
    );
  } catch (error) {
    console.error("Error deleting inventory item:", error);
    throw error;
  }
}

// Search for medicine by name
export async function searchMedicineInClinics(
  medicineName: string
): Promise<MedicineLocation[]> {
  try {
    const response = await databases.listDocuments(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.clinicInventory,
      [
        Query.search("medicineName", medicineName),
        Query.greaterThan("quantity", 0),
      ]
    );

    const inventoryItems = response.documents as unknown as ClinicInventory[];
    const locations: MedicineLocation[] = [];

    for (const item of inventoryItems) {
      try {
        const clinic = await databases.getDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.clinics,
          item.clinicId
        );
        locations.push({
          clinic: clinic as unknown as Clinic,
          inventory: item,
        });
      } catch (error) {
        console.error("Error fetching clinic for inventory item:", error);
      }
    }

    return locations;
  } catch (error) {
    console.error("Error searching medicine in clinics:", error);
    return [];
  }
}

// Calculate distance between two coordinates (Haversine formula)
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Find nearby clinics with specific medicine
export async function findNearbyMedicine(
  medicineName: string,
  userLat: number,
  userLon: number,
  maxDistance: number = 50 // km
): Promise<MedicineLocation[]> {
  try {
    const locations = await searchMedicineInClinics(medicineName);

    // Calculate distances and filter by maxDistance
    const locationsWithDistance = locations
      .map((location) => ({
        ...location,
        distance: calculateDistance(
          userLat,
          userLon,
          location.clinic.latitude,
          location.clinic.longitude
        ),
      }))
      .filter((location) => location.distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance);

    return locationsWithDistance;
  } catch (error) {
    console.error("Error finding nearby medicine:", error);
    return [];
  }
}
