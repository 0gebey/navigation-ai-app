import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Switch,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface SettingOption {
  id: string;
  title: string;
  description: string;
  type: "toggle" | "select" | "action";
  currentValue?: boolean | string;
  options?: string[]; // For select type
  action?: () => void; // For action type
}

export default function SettingsScreen() {
  const router = useRouter();

  // State for settings
  const [settings, setSettings] = useState<{ [key: string]: boolean | string }>(
    {
      notifications: true,
      autoPlay: false,
      mapStyle: "standard",
      contentLanguage: "English",
      useGoogleMaps: false,
      offlineMode: false,
      dataCollection: true,
      batterySaver: false,
    }
  );

  // Update a setting value
  const updateSetting = (id: string, value: boolean | string) => {
    setSettings({
      ...settings,
      [id]: value,
    });
  };

  // Define setting sections and options
  const settingSections = [
    {
      title: "General",
      options: [
        {
          id: "notifications",
          title: "Enable Notifications",
          description: "Receive notifications about nearby places of interest",
          type: "toggle" as const,
          currentValue: settings.notifications,
        },
        {
          id: "autoPlay",
          title: "Auto-play Audio",
          description:
            "Automatically play audio narrations when approaching a place",
          type: "toggle" as const,
          currentValue: settings.autoPlay,
        },
        {
          id: "mapStyle",
          title: "Map Style",
          description: "Choose your preferred map appearance",
          type: "select" as const,
          currentValue: settings.mapStyle,
          options: ["standard", "satellite", "hybrid", "terrain"],
        },
        {
          id: "contentLanguage",
          title: "Content Language",
          description: "Language for place descriptions and narrations",
          type: "select" as const,
          currentValue: settings.contentLanguage,
          options: ["English", "Dutch", "German", "French", "Spanish"],
        },
      ] as SettingOption[],
    },
    {
      title: "Advanced",
      options: [
        {
          id: "dataCollection",
          title: "Data Collection",
          description: "Help improve the app by sharing anonymous usage data",
          type: "toggle" as const,
          currentValue: settings.dataCollection,
        },
        {
          id: "batterySaver",
          title: "Battery Saver",
          description: "Reduce location updates frequency to save battery",
          type: "toggle" as const,
          currentValue: settings.batterySaver,
        },
      ] as SettingOption[],
    },
    {
      title: "Maps & Navigation",
      options: [
        {
          id: "openMapboxDemo",
          title: "Mapbox Integration Demo",
          description:
            "Try out the Mapbox maps integration with route directions",
          type: "action" as const,
          action: () => router.push("/mapbox-demo"),
        },
        {
          id: "useGoogleMaps",
          title: "Use Google Maps",
          description:
            "Switch between Apple Maps and Google Maps (requires app restart)",
          type: "toggle" as const,
          currentValue: settings.useGoogleMaps,
        },
        {
          id: "mapStyle",
          title: "Map Style",
          description: "Choose your preferred map appearance",
          type: "select" as const,
          currentValue: settings.mapStyle,
          options: ["standard", "satellite", "hybrid", "terrain"],
        },
      ] as SettingOption[],
    },
    {
      title: "Account",
      options: [
        {
          id: "configureAI",
          title: "Configure AI Settings",
          description: "Set up your OpenAI API key and preferences",
          type: "action" as const,
          action: () =>
            Alert.alert(
              "AI Configuration",
              "This would open the AI configuration screen."
            ),
        },
        {
          id: "clearCache",
          title: "Clear Cache",
          description: "Delete all cached data and downloaded content",
          type: "action" as const,
          action: () => {
            Alert.alert(
              "Clear Cache",
              "Are you sure you want to clear all cached data?",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Clear",
                  style: "destructive",
                  onPress: () =>
                    Alert.alert(
                      "Cache Cleared",
                      "All cached data has been removed."
                    ),
                },
              ]
            );
          },
        },
        {
          id: "resetSettings",
          title: "Reset All Settings",
          description: "Restore all settings to their default values",
          type: "action" as const,
          action: () => {
            Alert.alert(
              "Reset Settings",
              "Are you sure you want to reset all settings?",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Reset",
                  style: "destructive",
                  onPress: () => {
                    setSettings({
                      notifications: true,
                      autoPlay: false,
                      mapStyle: "standard",
                      contentLanguage: "English",
                      useGoogleMaps: false,
                      offlineMode: false,
                      dataCollection: true,
                      batterySaver: false,
                    });
                    Alert.alert(
                      "Settings Reset",
                      "All settings have been restored to defaults."
                    );
                  },
                },
              ]
            );
          },
        },
      ] as SettingOption[],
    },
  ];

  // Render a setting item based on its type
  const renderSettingItem = (option: SettingOption) => {
    switch (option.type) {
      case "toggle":
        return (
          <View style={styles.settingItem} key={option.id}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>{option.title}</Text>
              <Text style={styles.settingDescription}>
                {option.description}
              </Text>
            </View>
            <Switch
              value={option.currentValue as boolean}
              onValueChange={(value) => updateSetting(option.id, value)}
              trackColor={{ false: "#767577", true: "#4CAF50" }}
              thumbColor={option.currentValue ? "#fff" : "#f4f3f4"}
            />
          </View>
        );

      case "select":
        return (
          <TouchableOpacity
            style={styles.settingItem}
            key={option.id}
            onPress={() => {
              Alert.alert(
                option.title,
                "Select an option:",
                (option.options || []).map((opt) => ({
                  text: opt,
                  onPress: () => updateSetting(option.id, opt),
                }))
              );
            }}
          >
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>{option.title}</Text>
              <Text style={styles.settingDescription}>
                {option.description}
              </Text>
            </View>
            <View style={styles.selectValue}>
              <Text style={styles.currentValue}>
                {option.currentValue as string}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </View>
          </TouchableOpacity>
        );

      case "action":
        return (
          <TouchableOpacity
            style={styles.settingItem}
            key={option.id}
            onPress={option.action}
          >
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>{option.title}</Text>
              <Text style={styles.settingDescription}>
                {option.description}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        );

      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Customize your app experience</Text>
      </View>

      {settingSections.map((section) => (
        <View key={section.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.sectionContent}>
            {section.options.map((option) => renderSettingItem(option))}
          </View>
        </View>
      ))}

      <View style={styles.footer}>
        <Text style={styles.footerText}>Map App v1.0.0</Text>
        <TouchableOpacity>
          <Text style={styles.footerLink}>Privacy Policy</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.footerLink}>Terms of Service</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  section: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginHorizontal: 20,
    marginVertical: 10,
  },
  sectionContent: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingInfo: {
    flex: 1,
    marginRight: 10,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  settingDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  selectValue: {
    flexDirection: "row",
    alignItems: "center",
  },
  currentValue: {
    fontSize: 14,
    color: "#666",
    marginRight: 8,
  },
  footer: {
    padding: 20,
    alignItems: "center",
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: "#999",
    marginBottom: 10,
  },
  footerLink: {
    fontSize: 14,
    color: "#2196F3",
    marginVertical: 4,
  },
});
