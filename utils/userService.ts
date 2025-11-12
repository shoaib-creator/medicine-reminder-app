import { 
  db, 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  where,
  Timestamp 
} from "../config/firebase";

export type UserRole = "patient" | "clinic";

export interface UserProfile {
  id?: string;
  userId: string;
  email: string;
  role: UserRole;
  displayName?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Create or update user profile
export async function saveUserProfile(
  userId: string,
  email: string,
  role: UserRole,
  displayName?: string
): Promise<UserProfile> {
  try {
    // Check if user profile already exists
    const existingProfile = await getUserProfile(userId);
    
    if (existingProfile) {
      // Update existing profile
      const userRef = doc(db, "users", existingProfile.id!);
      await updateDoc(userRef, {
        role,
        displayName,
        updatedAt: Timestamp.now(),
      });
      return {
        ...existingProfile,
        role,
        displayName,
        updatedAt: new Date(),
      };
    } else {
      // Create new profile
      const usersRef = collection(db, "users");
      const docRef = await addDoc(usersRef, {
        userId,
        email,
        role,
        displayName,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return {
        id: docRef.id,
        userId,
        email,
        role,
        displayName,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
  } catch (error) {
    console.error("Error saving user profile:", error);
    throw error;
  }
}

// Get user profile by userId
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("userId", "==", userId));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return null;
    }
    
    const doc = snapshot.docs[0];
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId,
      email: data.email,
      role: data.role as UserRole,
      displayName: data.displayName,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    };
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
}

// Update user role
export async function updateUserRole(userId: string, role: UserRole): Promise<void> {
  try {
    const profile = await getUserProfile(userId);
    if (!profile || !profile.id) {
      throw new Error("User profile not found");
    }
    
    const userRef = doc(db, "users", profile.id);
    await updateDoc(userRef, {
      role,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
}
