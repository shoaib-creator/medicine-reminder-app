# Medicine Reminder App 👋

A comprehensive medicine reminder and clinic finder application built with Expo and React Native. This app helps patients manage their medications and find nearby clinics when they need refills, while also providing clinics with inventory management tools.

## Features

### For Patients 🏥
- **Medication Reminders**: Set up custom schedules for all your medications
- **Refill Tracking**: Monitor medicine supply and get low-stock alerts
- **Medicine Finder**: Search for medicines at nearby clinics using location-based search
- **Calendar View**: Visualize your medication schedule
- **History Tracking**: Keep track of medication adherence
- **Direct Communication**: Call clinics or get directions with one tap

### For Clinics 🏪
- **Inventory Management**: Add and manage medicine stock in real-time
- **Location Services**: Let patients find your clinic on the map
- **Stock Alerts**: Track quantities and update availability
- **Patient Discovery**: Make your medicines visible to patients in need

## Technology Stack

- **Frontend**: React Native with Expo
- **Backend**: Appwrite (cloud-based backend service)
- **Navigation**: Expo Router
- **Maps**: React Native Maps & Expo Location
- **Notifications**: Expo Notifications
- **UI**: React Native Linear Gradient, Expo Vector Icons

## Get started

1. Install dependencies

   ```bash
   yarn install
   ```

2. Set up Appwrite backend (see [APPWRITE_SETUP.md](./APPWRITE_SETUP.md))

3. Start the app

   ```bash
   yarn start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

## Documentation

- [User Guide](./USER_GUIDE.md) - Comprehensive guide for patients and clinics
- [Appwrite Setup](./APPWRITE_SETUP.md) - Backend configuration instructions

## Project Structure

```
├── app/                    # Main application screens
│   ├── calendar/          # Calendar view for medications
│   ├── clinic/            # Clinic inventory management
│   ├── finder/            # Medicine finder feature
│   ├── history/           # Medication history
│   ├── medications/       # Add/edit medications
│   └── refills/           # Refill tracking
├── components/            # Reusable components
├── config/                # Configuration files
│   └── appwrite.ts       # Appwrite backend config
├── utils/                 # Utility functions
│   ├── appwriteService.ts # Appwrite service layer
│   ├── notifications.ts   # Push notifications
│   └── storage.ts        # Local storage
└── assets/               # Images and static files
```

## Key Features Implementation

### Medicine Finder
Patients can search for medicines by name and find nearby clinics that have them in stock. The feature uses:
- Expo Location for GPS coordinates
- Haversine formula for distance calculation
- Real-time inventory data from Appwrite
- Sorted results by distance

### Clinic Inventory
Clinics can manage their medicine stock through an intuitive interface:
- Add new medicines with dosage and quantity
- Update stock levels in real-time
- Delete out-of-stock items
- All updates are immediately visible to searching patients

### Refill Tracking
Enhanced refill management that:
- Tracks current supply vs. total supply
- Shows percentage-based alerts
- Provides "Find Nearby" button when stock is low
- Records refill history

## Learn more

To learn more about developing this project with Expo:

- [Expo documentation](https://docs.expo.dev/)
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/)
- [Appwrite documentation](https://appwrite.io/docs)

## Join the community

- [Expo on GitHub](https://github.com/expo/expo)
- [Discord community](https://chat.expo.dev)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.
