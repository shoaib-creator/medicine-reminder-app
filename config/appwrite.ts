import { Client, Account, Databases, Query, ID, Models } from "appwrite";

// Appwrite configuration
export const APPWRITE_CONFIG = {
  endpoint: "https://cloud.appwrite.io/v1", // Update with your Appwrite endpoint
  projectId: "medicine-reminder-app", // Update with your project ID
  databaseId: "main", // Update with your database ID
  collections: {
    medications: "medications",
    clinics: "clinics",
    clinicInventory: "clinic_inventory",
    users: "users",
  },
};

// Initialize Appwrite client
const client = new Client();

client
  .setEndpoint(APPWRITE_CONFIG.endpoint)
  .setProject(APPWRITE_CONFIG.projectId);

export const account = new Account(client);
export const databases = new Databases(client);

export { client, Query, ID };
export type { Models };
