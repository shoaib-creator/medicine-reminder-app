# Appwrite Setup Guide

This guide will help you set up Appwrite for the Medicine Reminder App.

## Prerequisites

- An Appwrite Cloud account (https://cloud.appwrite.io) or self-hosted Appwrite instance
- Node.js and npm/yarn installed

## Steps

### 1. Create an Appwrite Project

1. Sign in to your Appwrite console
2. Create a new project named "medicine-reminder-app"
3. Copy your Project ID

### 2. Create a Database

1. Navigate to "Databases" in the Appwrite console
2. Create a new database named "main"
3. Copy the Database ID

### 3. Create Collections

Create the following collections with their attributes:

#### Collection: `clinics`
Attributes:
- `name` (string, required)
- `address` (string, required)
- `phone` (string, required)
- `email` (string, required)
- `latitude` (double, required)
- `longitude` (double, required)
- `operatingHours` (string, required)
- `verified` (boolean, default: false)
- `createdAt` (datetime, required)

Indexes:
- Create a key index on `verified`
- Create a key index on `createdAt`

#### Collection: `clinic_inventory`
Attributes:
- `clinicId` (string, required)
- `medicineName` (string, required)
- `dosage` (string, required)
- `quantity` (integer, required)
- `price` (double, optional)
- `lastUpdated` (datetime, required)

Indexes:
- Create a key index on `clinicId`
- Create a fulltext index on `medicineName` for search
- Create a key index on `quantity`

#### Collection: `medications`
Attributes:
- `userId` (string, required)
- `name` (string, required)
- `dosage` (string, required)
- `times` (string array, required)
- `startDate` (datetime, required)
- `duration` (string, required)
- `color` (string, required)
- `reminderEnabled` (boolean, default: true)
- `currentSupply` (integer, required)
- `totalSupply` (integer, required)
- `refillAt` (integer, required)
- `refillReminder` (boolean, default: false)
- `lastRefillDate` (datetime, optional)

Indexes:
- Create a key index on `userId`
- Create a key index on `startDate`

### 4. Update Configuration

1. Open `config/appwrite.ts`
2. Update the configuration with your values:
   ```typescript
   export const APPWRITE_CONFIG = {
     endpoint: "https://cloud.appwrite.io/v1", // or your self-hosted URL
     projectId: "YOUR_PROJECT_ID", // from step 1
     databaseId: "YOUR_DATABASE_ID", // from step 2
     collections: {
       medications: "YOUR_MEDICATIONS_COLLECTION_ID",
       clinics: "YOUR_CLINICS_COLLECTION_ID",
       clinicInventory: "YOUR_CLINIC_INVENTORY_COLLECTION_ID",
       users: "YOUR_USERS_COLLECTION_ID",
     },
   };
   ```

### 5. Set Permissions

For each collection, set the appropriate permissions:

#### For `clinics` and `clinic_inventory`:
- **Read**: Any (to allow all users to search for medicines)
- **Create**: Role: users (authenticated users can create clinics and add inventory)
- **Update**: Role: users (users can update their own data)
- **Delete**: Role: users (users can delete their own data)

#### For `medications`:
- **Read**: Role: users (only authenticated users can read)
- **Create**: Role: users
- **Update**: Role: users
- **Delete**: Role: users

### 6. Enable Location Services

Make sure location permissions are configured in your `app.json`:

```json
"plugins": [
  [
    "expo-location",
    {
      "locationAlwaysAndWhenInUsePermission": "Allow $(PRODUCT_NAME) to use your location to find nearby clinics with available medicines."
    }
  ]
]
```

### 7. Test the Integration

1. Start your app: `yarn start`
2. Test adding a clinic through the Clinic Inventory screen
3. Test adding medicines to clinic inventory
4. Test searching for medicines through the Find Medicine screen

## Features

### For Clinics
- **Clinic Management**: Register clinic with location details
- **Inventory Management**: Add, update, and track medicine stock
- **Real-time Updates**: Inventory updates are immediately available to patients

### For Patients
- **Medicine Finder**: Search for medicines by name
- **Location-based Search**: Find nearby clinics with available medicines
- **Direct Communication**: Call clinics or get directions
- **Low Stock Alerts**: Get notified when medicine supply is low

## Troubleshooting

### Common Issues

1. **Connection Error**: Make sure your Appwrite endpoint and project ID are correct
2. **Permission Denied**: Check that permissions are properly set for each collection
3. **Location Not Working**: Ensure location permissions are granted in your device settings
4. **Search Not Working**: Verify that fulltext index is created on `medicineName` field

## Security Notes

- Always validate user input on the client side
- Consider implementing authentication for clinic registration
- Use Appwrite's built-in security features like API keys and JWT tokens
- Regularly backup your database
- Monitor API usage to prevent abuse

## Next Steps

- Implement user authentication with Appwrite Auth
- Add real-time updates using Appwrite Realtime
- Implement push notifications for low stock alerts
- Add image upload for medicine photos
- Implement rating and review system for clinics
