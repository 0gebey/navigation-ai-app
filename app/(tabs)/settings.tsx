import React, { useState } from "react";
import {
  View,
  Text,
  Switch,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../styles/tabs/settings.styles";
import theme from "../../styles/theme";

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
  // State for settings - reduced to only essential navigation settings
  const [settings, setSettings] = useState<{ [key: string]: boolean | string }>(
    {
      notifications: true,
      autoNarration: true,
      mapStyle: "standard",
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
      title: "Navigation",
      options: [
        {
          id: "notifications",
          title: "Place Notifications",
          description:
            "Receive notifications about nearby places of interest during navigation",
          type: "toggle" as const,
          currentValue: settings.notifications,
        },
        {
          id: "autoNarration",
          title: "Auto-play Narration",
          description:
            "Automatically play audio narrations when approaching a place",
          type: "toggle" as const,
          currentValue: settings.autoNarration,
        },
        {
          id: "mapStyle",
          title: "Map Style",
          description: "Choose your preferred map appearance",
          type: "select" as const,
          currentValue: settings.mapStyle,
          options: ["standard", "satellite"],
        },
      ] as SettingOption[],
    },
    {
      title: "About",
      options: [
        {
          id: "aboutApp",
          title: "About This App",
          description: "Learn more about the app and its features",
          type: "action" as const,
          action: () => {
            Alert.alert(
              "Navigation with AI Narration",
              "This app provides navigation with AI-powered narration about interesting places along your route. It uses your location to identify nearby points of interest and provides information about them through voice narration.",
              [{ text: "OK" }]
            );
          },
        },
        {
          id: "clearCache",
          title: "Clear Cache",
          description: "Delete temporary app data",
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
      ] as SettingOption[],
    },
  ];

  // Render a setting item
  const renderSettingItem = (option: SettingOption) => {
    switch (option.type) {
      case "toggle":
        return (
          <View style={styles.settingRow} key={option.id}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>{option.title}</Text>
              <Text style={styles.settingDescription}>
                {option.description}
              </Text>
            </View>
            <Switch
              value={option.currentValue as boolean}
              onValueChange={(value) => updateSetting(option.id, value)}
              trackColor={{
                false: theme.colors.neutral.border,
                true: theme.colors.primary.light,
              }}
              thumbColor={
                (option.currentValue as boolean)
                  ? theme.colors.primary.main
                  : theme.colors.neutral.white
              }
            />
          </View>
        );
      case "select":
        return (
          <TouchableOpacity
            style={styles.settingRow}
            key={option.id}
            onPress={() => {
              // Simple toggle between options for now
              const currentValueIndex = (option.options || []).indexOf(
                option.currentValue as string
              );
              const nextIndex =
                (currentValueIndex + 1) % (option.options?.length || 1);
              updateSetting(option.id, option.options?.[nextIndex] || "");
            }}
          >
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>{option.title}</Text>
              <Text style={styles.settingDescription}>
                {option.description}
              </Text>
            </View>
            <View style={styles.valueContainer}>
              <Text style={styles.valueText}>
                {(option.currentValue as string).charAt(0).toUpperCase() +
                  (option.currentValue as string).slice(1)}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={theme.colors.text.tertiary}
              />
            </View>
          </TouchableOpacity>
        );
      case "action":
        return (
          <TouchableOpacity
            style={styles.settingRow}
            key={option.id}
            onPress={option.action}
          >
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>{option.title}</Text>
              <Text style={styles.settingDescription}>
                {option.description}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={theme.colors.text.tertiary}
            />
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {settingSections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.options.map(renderSettingItem)}
            </View>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Navigation with AI Narration v1.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
