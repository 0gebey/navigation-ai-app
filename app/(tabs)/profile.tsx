import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Switch,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { styles } from "../../styles/tabs/profile.styles";
import theme from "../../styles/theme";

// Define types
interface User {
  name: string;
  email: string;
  avatar: string;
  joinDate: string;
  premium: boolean;
}

interface Trip {
  id: string;
  from: string;
  to: string;
  date: string;
  places: number;
}

interface Setting {
  id: string;
  title: string;
  description: string;
  value: boolean;
  onToggle: (value: boolean) => void;
  icon: keyof typeof Ionicons.glyphMap;
}

interface SettingsSection {
  title: string;
  settings: Setting[];
}

export default function ProfileScreen() {
  const router = useRouter();

  // User preferences state
  const [notifications, setNotifications] = useState(true);
  const [audioGuide, setAudioGuide] = useState(true);
  const [locationTracking, setLocationTracking] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [offlineContent, setOfflineContent] = useState(false);

  // Mock user data
  const user: User = {
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    joinDate: "Member since June 2023",
    premium: true,
  };

  // Mock trip history
  const tripHistory: Trip[] = [
    {
      id: "1",
      from: "Eindhoven",
      to: "Helmond",
      date: "12 April 2023",
      places: 3,
    },
    {
      id: "2",
      from: "Amsterdam",
      to: "Utrecht",
      date: "28 March 2023",
      places: 5,
    },
  ];

  // Settings sections
  const settingsSections: SettingsSection[] = [
    {
      title: "App Preferences",
      settings: [
        {
          id: "notifications",
          title: "Push Notifications",
          description: "Get alerts about places near you",
          value: notifications,
          onToggle: setNotifications,
          icon: "notifications-outline",
        },
        {
          id: "audio",
          title: "Audio Guide",
          description: "Automatically narrate place information",
          value: audioGuide,
          onToggle: setAudioGuide,
          icon: "volume-high-outline",
        },
        {
          id: "location",
          title: "Background Location",
          description: "Track location while app is closed",
          value: locationTracking,
          onToggle: setLocationTracking,
          icon: "location-outline",
        },
      ],
    },
    {
      title: "Advanced Settings",
      settings: [
        {
          id: "darkMode",
          title: "Dark Mode",
          description: "Toggle dark theme",
          value: darkMode,
          onToggle: setDarkMode,
          icon: "moon-outline",
        },
        {
          id: "offline",
          title: "Offline Content",
          description: "Download content for offline use",
          value: offlineContent,
          onToggle: setOfflineContent,
          icon: "download-outline",
        },
      ],
    },
  ];

  // Render a setting toggle item
  const renderSettingItem = (setting: Setting) => (
    <View key={setting.id} style={styles.settingItem}>
      <View style={styles.settingIconContainer}>
        <Ionicons
          name={setting.icon}
          size={24}
          color={theme.colors.primary.main}
        />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{setting.title}</Text>
        <Text style={styles.settingDescription}>{setting.description}</Text>
      </View>
      <Switch
        value={setting.value}
        onValueChange={setting.onToggle}
        trackColor={{
          false: theme.colors.neutral.border,
          true: theme.colors.primary.light,
        }}
        thumbColor={
          setting.value ? theme.colors.primary.main : theme.colors.neutral.white
        }
      />
    </View>
  );

  // Render a trip history item
  const renderTripItem = (trip: Trip) => (
    <View key={trip.id} style={styles.tripItem}>
      <View style={styles.tripHeader}>
        <Text style={styles.tripRoute}>
          {trip.from} → {trip.to}
        </Text>
        <Text style={styles.tripDate}>{trip.date}</Text>
      </View>
      <View style={styles.tripDetails}>
        <View style={styles.tripDetail}>
          <Ionicons
            name="location"
            size={16}
            color={theme.colors.primary.main}
          />
          <Text style={styles.tripDetailText}>
            {trip.places} places visited
          </Text>
        </View>
        <TouchableOpacity style={styles.viewTripButton}>
          <Text style={styles.viewTripText}>View</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* User Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileInfo}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              <Text style={styles.memberSince}>{user.joinDate}</Text>
            </View>
          </View>

          {user.premium && (
            <View style={styles.premiumBadge}>
              <Ionicons
                name="star"
                size={16}
                color={theme.colors.text.inverse}
              />
              <Text style={styles.premiumText}>Premium</Text>
            </View>
          )}
        </View>

        {/* User Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>14</Text>
            <Text style={styles.statLabel}>Trips</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>47</Text>
            <Text style={styles.statLabel}>Places</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>3.5k</Text>
            <Text style={styles.statLabel}>km</Text>
          </View>
        </View>

        {/* Settings Sections */}
        {settingsSections.map((section) => (
          <View key={section.title} style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.settings.map(renderSettingItem)}
            </View>
          </View>
        ))}

        {/* Trip History */}
        <View style={styles.tripHistorySection}>
          <Text style={styles.sectionTitle}>Recent Trips</Text>
          <View style={styles.tripsList}>
            {tripHistory.map(renderTripItem)}
          </View>

          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All Trips</Text>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={theme.colors.primary.main}
            />
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons
              name="help-circle-outline"
              size={20}
              color={theme.colors.text.secondary}
            />
            <Text style={styles.actionButtonText}>Help & Support</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons
              name="settings-outline"
              size={20}
              color={theme.colors.text.secondary}
            />
            <Text style={styles.actionButtonText}>Advanced Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.logoutButton]}>
            <Ionicons
              name="log-out-outline"
              size={20}
              color={theme.colors.accent.red}
            />
            <Text style={[styles.actionButtonText, styles.logoutText]}>
              Log Out
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
