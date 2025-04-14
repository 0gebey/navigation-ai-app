import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import theme from "../../styles/theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "help-outline";

          if (route.name === "index") {
            iconName = focused ? "map" : "map-outline";
          } else if (route.name === "places") {
            iconName = focused ? "location" : "location-outline";
          } else if (route.name === "profile") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "settings") {
            iconName = focused ? "settings" : "settings-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary.main,
        tabBarInactiveTintColor: theme.colors.text.secondary,
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.colors.neutral.white,
          elevation: 0,
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 1 },
          shadowRadius: 1,
          height: 60,
        },
        headerTitleStyle: {
          fontWeight: "600",
          color: theme.colors.text.primary,
        },
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: theme.colors.neutral.divider,
          paddingTop: theme.spacing.xs,
          paddingBottom: theme.spacing.xs,
          height: 80,
          marginBottom: theme.spacing.xs,
        },
        tabBarLabelStyle: {
          fontSize: theme.typography.fontSizes.sm,
          marginBottom: theme.spacing.xs,
          marginTop: 2,
          paddingBottom: 2,
          fontWeight: "500",
        },
        tabBarShowLabel: true,
      })}
      initialRouteName="index"
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Map",
          headerTitle: "Navigation",
        }}
      />
      <Tabs.Screen
        name="places"
        options={{
          title: "Places",
          headerTitle: "Points of Interest",
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          headerTitle: "Settings",
          headerStyle: {
            backgroundColor: theme.colors.neutral.white,
          },
          headerTitleStyle: {
            fontWeight: "600",
            color: theme.colors.text.primary,
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerTitle: "Profile",
          headerStyle: {
            backgroundColor: theme.colors.neutral.white,
          },
          headerTitleStyle: {
            fontWeight: "600",
            color: theme.colors.text.primary,
          },
        }}
      />
    </Tabs>
  );
}
