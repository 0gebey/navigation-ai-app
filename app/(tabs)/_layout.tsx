import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

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
          } else if (route.name === "settings") {
            iconName = focused ? "settings" : "settings-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#4CAF50",
        tabBarInactiveTintColor: "gray",
        headerShown: true,
        headerStyle: {
          backgroundColor: "#fff",
          elevation: 2,
          shadowOpacity: 0.2,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 2,
        },
        headerTitleStyle: {
          fontWeight: "600",
          color: "#333",
        },
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: "#eee",
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
        },
      })}
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
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
