import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import theme from "../styles/theme";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="place/index"
          options={{
            headerShown: true,
            headerTitle: "Place Details",
            headerBackTitle: "Back",
            headerStyle: {
              backgroundColor: theme.colors.neutral.white,
            },
            headerTitleStyle: {
              fontWeight: "600",
              color: theme.colors.text.primary,
            },
            headerTintColor: theme.colors.primary.main,
          }}
        />
      </Stack>
    </>
  );
}
