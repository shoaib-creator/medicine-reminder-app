# Testing Guide for Firebase Auth with Role-Based Access

## Prerequisites
Before testing, ensure:
1. Firebase project is set up and configured
2. Google Client ID is updated in `utils/authService.ts`
3. Firebase config is updated in `config/firebase.ts` (already done)
4. Firestore collections are created: `users`, `clinics`, `clinicInventory`

## Test Scenarios

### 1. Patient Sign-Up Flow (Email/Password)

**Steps:**
1. Open the app
2. Click "Don't have an account? Sign Up"
3. Select "Patient" role (should be selected by default)
4. Enter email: `patient@test.com`
5. Enter password: `Test1234!`
6. Enter confirm password: `Test1234!`
7. Click "Sign Up"

**Expected Results:**
- ✅ User should be created in Firebase Authentication
- ✅ User profile should be saved in Firestore `users` collection with `role: "patient"`
- ✅ User should be redirected to Patient Home screen (`/home`)
- ✅ Home screen should show:
  - Daily Progress
  - Quick Actions (Add Medication, Find Medicine, Clinic Inventory, Calendar View, History Log, Refill Tracker)
  - Today's Schedule
  - Sign out button

### 2. Clinic Sign-Up Flow (Email/Password)

**Steps:**
1. Open the app (or sign out if already signed in)
2. Click "Don't have an account? Sign Up"
3. Select "Clinic" role by clicking the Clinic button
4. Enter email: `clinic@test.com`
5. Enter password: `Test1234!`
6. Enter confirm password: `Test1234!`
7. Click "Sign Up"

**Expected Results:**
- ✅ User should be created in Firebase Authentication
- ✅ User profile should be saved in Firestore `users` collection with `role: "clinic"`
- ✅ User should be redirected to Clinic Home screen (`/clinic-home`)
- ✅ Clinic Home screen should show:
  - Clinic Dashboard header
  - Statistics cards (Total Items, Low Stock, Out of Stock)
  - Quick Actions (Add Inventory, Manage Inventory)
  - Recent Inventory section
  - Sign out button

### 3. Patient Sign-In Flow

**Steps:**
1. Open the app
2. Enter email: `patient@test.com`
3. Enter password: `Test1234!`
4. Click "Sign In"

**Expected Results:**
- ✅ User should be authenticated
- ✅ System should fetch user profile from Firestore
- ✅ User should be redirected to Patient Home screen (`/home`)
- ✅ Role should persist (even after app restart)

### 4. Clinic Sign-In Flow

**Steps:**
1. Open the app (or sign out)
2. Enter email: `clinic@test.com`
3. Enter password: `Test1234!`
4. Click "Sign In"

**Expected Results:**
- ✅ User should be authenticated
- ✅ System should fetch user profile from Firestore
- ✅ User should be redirected to Clinic Home screen (`/clinic-home`)
- ✅ Role should persist (even after app restart)

### 5. Google Sign-In as Patient (First Time)

**Steps:**
1. Open the app
2. Click "Don't have an account? Sign Up"
3. Select "Patient" role
4. Click "Sign in with Google"
5. Select Google account
6. Authorize the app

**Expected Results:**
- ✅ User should be created in Firebase Authentication
- ✅ User profile should be saved with `role: "patient"`
- ✅ User should be redirected to Patient Home screen

### 6. Google Sign-In as Clinic (First Time)

**Steps:**
1. Open the app (use different Google account or clear data)
2. Click "Don't have an account? Sign Up"
3. Select "Clinic" role
4. Click "Sign in with Google"
5. Select Google account
6. Authorize the app

**Expected Results:**
- ✅ User should be created in Firebase Authentication
- ✅ User profile should be saved with `role: "clinic"`
- ✅ User should be redirected to Clinic Home screen

### 7. Google Sign-In (Returning User)

**Steps:**
1. Sign out if signed in
2. Click "Sign in with Google"
3. Select previously used Google account

**Expected Results:**
- ✅ User should be authenticated
- ✅ System should fetch existing user profile
- ✅ User should be redirected to correct home screen based on saved role
- ✅ Role selection should NOT be visible (only for new sign-ups)

### 8. Sign Out Functionality

**Steps:**
1. Sign in as any user (patient or clinic)
2. Click the sign out button
3. Confirm sign out in the alert

**Expected Results:**
- ✅ User should be signed out from Firebase
- ✅ User should be redirected to auth screen
- ✅ No user session should remain

### 9. Role Persistence

**Steps:**
1. Sign up as Patient
2. Close the app completely
3. Reopen the app

**Expected Results:**
- ✅ User should still be authenticated
- ✅ User should be redirected to Patient Home screen
- ✅ No need to sign in again

### 10. Toggle Between Roles During Sign-Up

**Steps:**
1. Open auth screen
2. Click "Don't have an account? Sign Up"
3. Click "Patient" button (should be active)
4. Click "Clinic" button
5. Click "Patient" button again
6. Observe UI changes

**Expected Results:**
- ✅ Only one role should be active at a time
- ✅ Active role should have green background (#E8F5E9)
- ✅ Active role should have green text and icon (#4CAF50)
- ✅ Inactive role should have gray background (#f5f5f5)
- ✅ Inactive role should have gray text and icon (#666)

### 11. Error Handling

**Test Cases:**

#### Invalid Email Format
- Try to sign up with email: `notanemail`
- Expected: Firebase should show validation error

#### Password Mismatch
- Enter password: `Test1234!`
- Enter confirm password: `Different123!`
- Expected: Error message "Passwords do not match"

#### Empty Fields
- Leave email or password empty
- Expected: Error message "Please fill in all fields"

#### Existing Email
- Try to sign up with already registered email
- Expected: Firebase error about existing account

#### Wrong Password
- Try to sign in with correct email but wrong password
- Expected: Authentication error from Firebase

### 12. Clinic Features

**Steps (as Clinic user):**
1. Sign in as clinic user
2. From Clinic Home, click "Add Inventory"
3. Add a medicine:
   - Name: "Paracetamol"
   - Dosage: "500mg"
   - Quantity: 50
   - Price: 5.99
4. Click Save

**Expected Results:**
- ✅ Medicine should be added to Firestore `clinicInventory` collection
- ✅ User should be redirected back to inventory screen
- ✅ Medicine should appear in the inventory list
- ✅ Statistics should update on Clinic Home screen

### 13. Patient Features

**Steps (as Patient user):**
1. Sign in as patient user
2. Click "Add Medication"
3. Add a medication
4. Return to home screen

**Expected Results:**
- ✅ Medication should be saved locally
- ✅ Today's Schedule should update
- ✅ Progress circle should update

## Firestore Data Verification

### Check Users Collection
Navigate to Firebase Console → Firestore → `users` collection

Expected documents:
```
Document ID: auto-generated
{
  userId: "firebase-auth-uid",
  email: "patient@test.com",
  role: "patient",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Check Authentication
Navigate to Firebase Console → Authentication

Expected users:
- patient@test.com
- clinic@test.com
- Google authenticated users

## Common Issues & Solutions

### Issue: Google Sign-In not working
**Solution:** Update `GOOGLE_CLIENT_ID` in `utils/authService.ts` with your actual client ID

### Issue: User redirected to wrong screen
**Solution:** Check Firestore `users` collection to verify role is saved correctly

### Issue: Role not persisting
**Solution:** Ensure AsyncStorage permissions are granted and Firestore is accessible

### Issue: Firebase configuration error
**Solution:** Verify `config/firebase.ts` has correct project credentials

## Security Testing

1. Try to access `/clinic-home` as a patient user (manually change URL)
2. Try to access `/home` as a clinic user
3. Verify Firestore security rules prevent unauthorized access
4. Test sign-out removes all local session data

## Performance Testing

1. Sign in and check load time
2. Switch between screens
3. Verify smooth navigation without lag
4. Check memory usage with large inventory lists

## Notes

- The demo currently uses hardcoded clinic ID ("demo-clinic-001")
- In production, link inventory to authenticated clinic user's profile
- Implement Firestore security rules to enforce role-based access
- Consider adding role verification middleware for sensitive operations
