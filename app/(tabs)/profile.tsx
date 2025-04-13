import React, { useState } from "react";
import {
  StyleSheet,
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
        <Ionicons name={setting.icon} size={24} color="#FF5722" />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{setting.title}</Text>
        <Text style={styles.settingDescription}>{setting.description}</Text>
      </View>
      <Switch
        value={setting.value}
        onValueChange={setting.onToggle}
        trackColor={{ false: "#E0E0E0", true: "#FFCCBC" }}
        thumbColor={setting.value ? "#FF5722" : "#FFF"}
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
          <Ionicons name="location" size={16} color="#FF5722" />
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
              <Ionicons name="star" size={16} color="#FFF" />
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
            <Ionicons name="chevron-forward" size={16} color="#FF5722" />
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="help-circle-outline" size={20} color="#616161" />
            <Text style={styles.actionButtonText}>Help & Support</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="settings-outline" size={20} color="#616161" />
            <Text style={styles.actionButtonText}>Advanced Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.logoutButton]}>
            <Ionicons name="log-out-outline" size={20} color="#F44336" />
            <Text style={[styles.actionButtonText, styles.logoutText]}>
              Log Out
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  profileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 20,
    marginBottom: 15,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: "#FF5722",
  },
  userInfo: {
    marginLeft: 15,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#212121",
  },
  userEmail: {
    fontSize: 14,
    color: "#616161",
    marginTop: 2,
  },
  memberSince: {
    fontSize: 12,
    color: "#9E9E9E",
    marginTop: 4,
  },
  premiumBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF8F00",
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  premiumText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 12,
    marginLeft: 3,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#212121",
  },
  statLabel: {
    fontSize: 12,
    color: "#616161",
    marginTop: 5,
  },
  statDivider: {
    width: 1,
    height: "70%",
    backgroundColor: "#E0E0E0",
  },
  settingsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#212121",
    marginHorizontal: 20,
    marginBottom: 10,
  },
  sectionContent: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF3E0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#212121",
  },
  settingDescription: {
    fontSize: 12,
    color: "#9E9E9E",
    marginTop: 2,
  },
  tripHistorySection: {
    marginBottom: 20,
  },
  tripsList: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  tripItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  tripHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  tripRoute: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#212121",
  },
  tripDate: {
    fontSize: 12,
    color: "#9E9E9E",
  },
  tripDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tripDetail: {
    flexDirection: "row",
    alignItems: "center",
  },
  tripDetailText: {
    fontSize: 12,
    color: "#616161",
    marginLeft: 5,
  },
  viewTripButton: {
    backgroundColor: "#F5F5F5",
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  viewTripText: {
    fontSize: 12,
    color: "#616161",
    fontWeight: "bold",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    marginBottom: 5,
  },
  viewAllText: {
    fontSize: 14,
    color: "#FF5722",
    fontWeight: "bold",
    marginRight: 5,
  },
  actionButtons: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  actionButtonText: {
    fontSize: 14,
    color: "#616161",
    marginLeft: 15,
  },
  logoutButton: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: "#F44336",
  },
});
