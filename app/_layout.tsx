import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="place/[name]"
          options={{
            headerShown: true,
            headerTitle: "Place Details",
            headerBackTitle: "Back",
          }}
        />
      </Stack>
    </>
  );
}
