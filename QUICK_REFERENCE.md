# Quick Reference: Firebase Auth with Role-Based Access

## 🎯 What Was Done

### Problem Statement Requirements
1. ✅ Replace Google Cloud Auth with Firebase Auth for login using Google
2. ✅ Add 2 different roles: "Clinic" and "Patient"
3. ✅ Add option to toggle which account type during sign-up
4. ✅ Save role in Firestore for next login
5. ✅ Create different screens for Clinic and Patient
6. ✅ Remove everything related to Appwrite

### Key Files Changed/Created

#### New Files
- `utils/userService.ts` - User profile management with role storage
- `app/clinic-home.tsx` - Dedicated home screen for clinic users
- `FIREBASE_AUTH_IMPLEMENTATION.md` - Technical documentation
- `TESTING_GUIDE.md` - Testing scenarios
- This file - Quick reference

#### Modified Files
- `app/auth.tsx` - Added role selection UI and logic
- `README.md` - Updated with Firebase setup instructions
- `package.json` - Removed Appwrite dependency

#### Deleted Files
- `config/appwrite.ts` - Appwrite configuration
- `utils/appwriteService.ts` - Appwrite service layer
- `APPWRITE_SETUP.md` - Appwrite documentation

## 🚀 How It Works

### Sign-Up Flow
```
User opens app
    ↓
Clicks "Sign Up"
    ↓
Selects Role (Patient/Clinic) ← NEW!
    ↓
Enters credentials OR uses Google Sign-In
    ↓
Firebase creates user
    ↓
Role saved to Firestore users collection ← NEW!
    ↓
Navigate to appropriate home:
  - Patient → /home
  - Clinic → /clinic-home ← NEW!
```

### Sign-In Flow
```
User opens app
    ↓
Enters credentials OR uses Google Sign-In
    ↓
Firebase authenticates user
    ↓
Fetch user profile from Firestore ← NEW!
    ↓
Check role ← NEW!
    ↓
Navigate to appropriate home:
  - Patient → /home
  - Clinic → /clinic-home ← NEW!
```

## 📱 User Interface Changes

### Auth Screen (app/auth.tsx)
**New UI Element:**
```
┌─────────────────────────────────┐
│  I am a:                        │
│  ┌─────────┐  ┌─────────┐      │
│  │ 👤      │  │ 🏢      │      │
│  │ Patient │  │ Clinic  │      │
│  └─────────┘  └─────────┘      │
└─────────────────────────────────┘
```
- Shows ONLY during sign-up
- Patient selected by default
- Green highlight for active selection
- Icons for visual clarity

### Patient Home (/home)
**Existing screen - No changes**
- Daily Progress circle
- Quick Actions: Add Medication, Find Medicine, Clinic Inventory, Calendar, History, Refills
- Today's Schedule
- Medication tracking

### Clinic Home (/clinic-home)
**NEW screen for clinic users**
```
┌─────────────────────────────────┐
│  Clinic Dashboard      [Logout] │
│  Manage your inventory          │
│                                 │
│  ┌──────┐ ┌──────┐ ┌──────┐    │
│  │  📦  │ │  ⚠️  │ │  ❌  │    │
│  │  0   │ │  0   │ │  0   │    │
│  │Total │ │ Low  │ │ Out  │    │
│  │Items │ │Stock │ │Stock │    │
│  └──────┘ └──────┘ └──────┘    │
│                                 │
│  Quick Actions                  │
│  ┌──────────┐ ┌──────────┐     │
│  │    +     │ │    📋    │     │
│  │   Add    │ │  Manage  │     │
│  │Inventory │ │Inventory │     │
│  └──────────┘ └──────────┘     │
│                                 │
│  Recent Inventory               │
│  [List of inventory items]      │
└─────────────────────────────────┘
```

## 🗄️ Firestore Collections

### users (NEW)
```typescript
{
  userId: string,           // Firebase Auth UID
  email: string,           // User email
  role: "patient" | "clinic", // User role ← KEY FIELD
  displayName?: string,    // Optional name
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### clinics (Existing - now uses Firebase)
```typescript
{
  name: string,
  address: string,
  phone: string,
  email: string,
  latitude: number,
  longitude: number,
  operatingHours: string,
  verified: boolean,
  createdAt: Timestamp
}
```

### clinicInventory (Existing - now uses Firebase)
```typescript
{
  clinicId: string,
  medicineName: string,
  dosage: string,
  quantity: number,
  price?: number,
  lastUpdated: Timestamp
}
```

## 🔧 Configuration Required

### 1. Firebase Configuration (DONE ✅)
File: `config/firebase.ts`
- Already configured with project credentials
- No changes needed

### 2. Google Client ID (TODO ⚠️)
File: `utils/authService.ts`
Line 18: `const GOOGLE_CLIENT_ID = "15279474585-YOUR_CLIENT_ID.apps.googleusercontent.com"`

**Action Required:**
1. Go to Google Cloud Console
2. Create OAuth 2.0 credentials
3. Replace placeholder with actual client ID

### 3. Firestore Security Rules (TODO ⚠️)
Navigate to Firebase Console → Firestore → Rules

**Recommended Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == resource.data.userId;
    }
    
    // Anyone can read clinics and inventory
    match /clinics/{clinicId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /clinicInventory/{itemId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 🧪 Quick Test

### Test Patient Flow
1. Open app → Sign Up
2. Keep "Patient" selected
3. Enter: `test.patient@example.com` / `Test1234!`
4. Should land on Patient Home with medication tracking

### Test Clinic Flow
1. Sign Out → Sign Up
2. Click "Clinic" button
3. Enter: `test.clinic@example.com` / `Test1234!`
4. Should land on Clinic Home with inventory dashboard

## 📊 What Changed vs What Stayed

### Changed ✏️
- Authentication system (Appwrite → Firebase)
- Auth screen UI (added role selection)
- Navigation logic (role-based routing)
- User data storage (now includes role)
- Dependencies (removed Appwrite)

### Stayed Same ✅
- Patient home screen functionality
- Medication tracking features
- Clinic inventory management
- Medicine finder
- Calendar, History, Refills
- Local storage for medications
- UI design and styling (except auth screen)

## 🎓 Important Notes

1. **Role is set during sign-up and persists** - Users cannot change their role after registration (by design)

2. **Demo Clinic ID** - Current implementation uses hardcoded clinic ID. In production, link inventory to authenticated user.

3. **Google Sign-In** - Requires proper OAuth configuration in Google Cloud Console

4. **Firebase SDK** - Uses web SDK (firebase) not native SDK (@react-native-firebase) for auth. This is intentional for Expo compatibility.

5. **Backward Compatibility** - Existing data structures for medications, clinics, and inventory remain unchanged

## 📞 Support

For issues or questions:
1. Check TESTING_GUIDE.md for test scenarios
2. Check FIREBASE_AUTH_IMPLEMENTATION.md for technical details
3. Verify Firebase configuration and Google Client ID
4. Check Firestore rules and permissions
5. Review console logs for error messages

## ✅ Checklist for Production

- [ ] Update Google Client ID in `utils/authService.ts`
- [ ] Set up Firestore security rules
- [ ] Link clinic inventory to authenticated clinic users
- [ ] Test all authentication flows
- [ ] Test role persistence across app restarts
- [ ] Configure Android/iOS OAuth credentials
- [ ] Set up proper error handling
- [ ] Add loading states
- [ ] Test on physical devices
- [ ] Deploy Firestore indexes if needed
