import { 
  db, 
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
} from "../config/firebase";

export interface Clinic {
  id?: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  latitude: number;
  longitude: number;
  operatingHours: string;
  verified: boolean;
  createdAt?: Date;
}

export interface ClinicInventory {
  id?: string;
  clinicId: string;
  medicineName: string;
  dosage: string;
  quantity: number;
  price?: number;
  lastUpdated?: Date;
}

export interface MedicineLocation {
  clinic: Clinic;
  inventory: ClinicInventory;
  distance?: number;
}

// Clinic Management
export async function createClinic(clinic: Omit<Clinic, "id" | "createdAt">): Promise<Clinic> {
  try {
    const clinicsRef = collection(db, "clinics");
    const docRef = await addDoc(clinicsRef, {
      ...clinic,
      createdAt: Timestamp.now(),
    });
    return {
      id: docRef.id,
      ...clinic,
      createdAt: new Date(),
    };
  } catch (error) {
    console.error("Error creating clinic:", error);
    throw error;
  }
}

export async function getClinics(): Promise<Clinic[]> {
  try {
    const clinicsRef = collection(db, "clinics");
    const snapshot = await getDocs(clinicsRef);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
      } as Clinic;
    });
  } catch (error) {
    console.error("Error getting clinics:", error);
    return [];
  }
}

export async function updateClinic(clinicId: string, updates: Partial<Clinic>): Promise<void> {
  try {
    const clinicRef = doc(db, "clinics", clinicId);
    await updateDoc(clinicRef, updates);
  } catch (error) {
    console.error("Error updating clinic:", error);
    throw error;
  }
}

// Clinic Inventory Management
export async function addInventoryItem(
  item: Omit<ClinicInventory, "id" | "lastUpdated">
): Promise<ClinicInventory> {
  try {
    const inventoryRef = collection(db, "clinicInventory");
    const docRef = await addDoc(inventoryRef, {
      ...item,
      lastUpdated: Timestamp.now(),
    });
    return {
      id: docRef.id,
      ...item,
      lastUpdated: new Date(),
    };
  } catch (error) {
    console.error("Error adding inventory item:", error);
    throw error;
  }
}

export async function getClinicInventory(clinicId: string): Promise<ClinicInventory[]> {
  try {
    const inventoryRef = collection(db, "clinicInventory");
    const q = query(inventoryRef, where("clinicId", "==", clinicId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        lastUpdated: data.lastUpdated?.toDate(),
      } as ClinicInventory;
    });
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
    const itemRef = doc(db, "clinicInventory", itemId);
    await updateDoc(itemRef, {
      ...updates,
      lastUpdated: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating inventory item:", error);
    throw error;
  }
}

export async function deleteInventoryItem(itemId: string): Promise<void> {
  try {
    const itemRef = doc(db, "clinicInventory", itemId);
    await deleteDoc(itemRef);
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
    const inventoryRef = collection(db, "clinicInventory");
    const snapshot = await getDocs(inventoryRef);
    
    // Filter by medicine name (case-insensitive) and quantity > 0
    const inventoryItems = snapshot.docs
      .map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          lastUpdated: data.lastUpdated?.toDate(),
        } as ClinicInventory;
      })
      .filter((item) => 
        item.medicineName.toLowerCase().includes(medicineName.toLowerCase()) && 
        item.quantity > 0
      );

    const locations: MedicineLocation[] = [];

    for (const item of inventoryItems) {
      try {
        const clinicRef = doc(db, "clinics", item.clinicId);
        const clinicDoc = await getDoc(clinicRef);
        if (clinicDoc.exists()) {
          const clinicData = clinicDoc.data();
          locations.push({
            clinic: {
              id: clinicDoc.id,
              ...clinicData,
              createdAt: clinicData.createdAt?.toDate(),
            } as Clinic,
            inventory: item,
          });
        }
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
