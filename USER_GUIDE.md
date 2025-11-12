# Medicine Reminder App - User Guide

## Overview

This app helps you manage your medications and find nearby clinics when you need to refill your prescriptions. It now includes cloud-based features powered by Appwrite for real-time medicine availability tracking.

## Features

### 1. Medication Management
- **Add Medications**: Track your daily medications with dosage, timing, and duration
- **Reminders**: Get notified when it's time to take your medicine
- **Refill Tracking**: Monitor your medicine supply and get alerts when running low
- **History**: View your medication history and adherence

### 2. Clinic Inventory Management (For Clinics)
- **Manage Stock**: Add and update medicine inventory
- **Real-time Updates**: Stock levels are immediately visible to patients
- **Location Tracking**: Clinics are mapped for easy patient discovery

### 3. Medicine Finder (For Patients)
- **Search Medicines**: Find where specific medicines are available
- **Location-based**: See nearby clinics sorted by distance
- **Direct Contact**: Call clinics or get directions with one tap
- **Real-time Availability**: See current stock levels

## Getting Started

### For Patients

#### Adding a Medication
1. Open the app and tap "Add Medication" on the home screen
2. Enter the medication name and dosage (e.g., "Aspirin 500mg")
3. Select frequency (once, twice, or three times daily)
4. Choose duration (7, 14, 30, 90 days, or ongoing)
5. Set your preferred reminder times
6. Enable refill tracking to monitor supply
7. Tap "Add Medication" to save

#### Finding a Medicine When Low on Supply
1. From the home screen, tap "Find Medicine"
2. Enter the medicine name you're looking for
3. Grant location permission when prompted
4. Tap "Search" to see nearby clinics with that medicine
5. View:
   - Clinic name and distance
   - Available quantity and price
   - Contact information
   - Operating hours
6. Tap "Call" to contact the clinic directly
7. Tap "Directions" to navigate using your maps app

#### Monitoring Your Refills
1. Tap "Refill Tracker" from the home screen
2. View all medications with supply levels
3. See color-coded status:
   - **Green**: Good supply
   - **Orange**: Medium supply
   - **Red**: Low supply
4. For low medicines, tap "Find Nearby" to locate clinics
5. Tap "Record Refill" when you've refilled

### For Clinics

#### Setting Up Your Clinic Inventory
1. Tap "Clinic Inventory" from the home screen
2. Tap the "+" button to add a medicine
3. Enter:
   - Medicine name
   - Dosage (e.g., "500mg")
   - Current quantity in stock
   - Price (optional)
4. Tap "Add to Inventory"

#### Managing Stock Levels
1. Open "Clinic Inventory"
2. For each medicine, use the "+" and "-" buttons to adjust quantity
3. Updates are automatically saved
4. Delete items by tapping the "Delete" button

## Quick Actions

The home screen provides quick access to:
- **Add Medication**: Create a new medication schedule
- **Find Medicine**: Search for medicines at nearby clinics
- **Clinic Inventory**: Manage your clinic's medicine stock
- **Calendar View**: See your medication schedule
- **History Log**: View past medication records
- **Refill Tracker**: Monitor medicine supplies

## Tips for Best Results

### For Patients
- **Enable Notifications**: Allow notifications for medication reminders
- **Enable Location**: Grant location access to find the nearest clinics
- **Keep Supply Updated**: Mark when you take medication to track supply accurately
- **Search by Generic Name**: Try searching for generic medicine names for more results
- **Set Refill Alerts**: Configure alerts before you run out completely

### For Clinics
- **Update Regularly**: Keep your inventory current for accurate patient information
- **Verify Location**: Ensure your clinic location is accurate on the map
- **Include Prices**: Adding prices helps patients plan their purchases
- **Set Operating Hours**: Display accurate hours to avoid patient visits when closed
- **Respond Promptly**: Answer calls from patients looking for medicines

## Troubleshooting

### Location Not Working
- Go to your device Settings
- Find the Medicine Reminder App
- Enable Location permissions
- Choose "While Using the App"

### Can't Find Medicine
- Try searching by generic name
- Check spelling
- Try partial name (e.g., "Aspir" instead of "Aspirin")
- Expand search radius by waiting for more results

### Clinic Not Showing
- Ensure the clinic has added the medicine to their inventory
- Check that clinic quantity is greater than 0
- Verify you're within the search radius (default 50 km)

### Notifications Not Working
- Go to device Settings
- Find Notifications
- Enable notifications for Medicine Reminder App
- Ensure Do Not Disturb is not blocking notifications

## Privacy and Security

- Your medication data is stored securely
- Location is only used when you search for medicines
- Clinic information is publicly visible for patient discovery
- No personal health data is shared without your consent

## Support

For issues or feature requests:
1. Check this guide first
2. Review the APPWRITE_SETUP.md for backend configuration
3. Contact the developer through the GitHub repository

## Updates and New Features

This app is regularly updated with new features:
- Cloud synchronization via Appwrite
- Real-time inventory tracking
- Location-based medicine search
- Direct clinic communication
- Enhanced refill management

Stay tuned for future updates including:
- User authentication
- Prescription photo upload
- Clinic ratings and reviews
- Multi-language support
- Insurance integration
