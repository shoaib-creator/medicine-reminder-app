import { Stack } from "expo-router";

export default function ClinicLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="add-inventory" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
