import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Platform,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AIService, { PlaceInfo } from "../../services/AIService";
import { styles } from "../../styles/place/details.styles";
import theme from "../../styles/theme";

// Main PlaceScreen component
export default function PlaceScreen() {
  const { name } = useLocalSearchParams();
  const router = useRouter();
  const [placeInfo, setPlaceInfo] = useState<PlaceInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");

  // Fetch place information using AIService
  useEffect(() => {
    const fetchPlaceInfo = async () => {
      setLoading(true);
      try {
        // Get place info from AIService
        const info = await AIService.getPlaceInfo(name as string);
        setPlaceInfo(info);
      } catch (error) {
        console.error("Error fetching place info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaceInfo();
  }, [name]);

  // Get demo images for places
  const getPlaceImages = (placeName: string) => {
    const imageMap: Record<string, string[]> = {
      Nuenen: [
        "https://images.unsplash.com/photo-1550686041-366ad85a1355?q=80&w=600&auto=format",
        "https://images.unsplash.com/photo-1550686041-a5c70e3a133b?q=80&w=600&auto=format",
      ],
      Eindhoven: [
        "https://images.unsplash.com/photo-1564565562150-46c2e7938b3d?q=80&w=600&auto=format",
        "https://images.unsplash.com/photo-1550686041-366ad85a1355?q=80&w=600&auto=format",
      ],
      Helmond: [
        "https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?q=80&w=600&auto=format",
        "https://images.unsplash.com/photo-1550686041-366ad85a1355?q=80&w=600&auto=format",
      ],
    };

    return (
      imageMap[placeName as string] || [
        "https://images.unsplash.com/photo-1518945756765-f8641d60aa75?q=80&w=600&auto=format",
        "https://images.unsplash.com/photo-1518945756765-f8641d60aa75?q=80&w=600&auto=format",
      ]
    );
  };

  // Navigation handler
  const startNavigation = () => {
    if (!placeInfo) return;

    // For demo purposes - would use actual coordinates in real app
    const coordinates = {
      latitude: 51.4728, // example coordinates for Nuenen
      longitude: 5.5514,
    };

    const { latitude, longitude } = coordinates;
    const label = encodeURIComponent(placeInfo.name);
    let url: string;

    // Different URL schemes for iOS and Android
    if (Platform.OS === "ios") {
      url = `maps://app?saddr=Current+Location&daddr=${latitude},${longitude}&dirflg=d`;
    } else {
      url = `google.navigation:q=${latitude},${longitude}`;
    }

    // Open the native navigation app
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          // Fallback to Google Maps web URL
          const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving&dir_action=navigate`;
          return Linking.openURL(webUrl);
        }
      })
      .catch((error) => {
        console.error("Error opening navigation:", error);
      });
  };

  const placeImages = getPlaceImages(name as string);

  // Loading state display
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
        <Text style={styles.loadingText}>
          Loading information about {name}...
        </Text>
      </View>
    );
  }

  // Error state display
  if (!placeInfo) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons
          name="alert-circle"
          size={48}
          color={theme.colors.accent.red}
        />
        <Text style={styles.errorText}>
          Sorry, we couldn't find information about {name}.
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Main UI render
  return (
    <>
      <Stack.Screen
        options={{
          title: placeInfo.name,
          headerBackTitle: "Map",
        }}
      />
      <ScrollView style={styles.container}>
        {/* Hero section with place image */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: placeImages[0] }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>{placeInfo.name}</Text>
          </View>
        </View>

        {/* Tab navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "about" && styles.activeTab]}
            onPress={() => setActiveTab("about")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "about" && styles.activeTabText,
              ]}
            >
              About
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "attractions" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("attractions")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "attractions" && styles.activeTabText,
              ]}
            >
              Attractions
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content container with tab content */}
        <View style={styles.contentContainer}>
          {activeTab === "about" && (
            <View>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.descriptionText}>
                {placeInfo.description}
              </Text>

              <Text style={styles.sectionTitle}>Fun Facts</Text>
              {placeInfo.funFacts.map((fact: string, index: number) => (
                <View key={index} style={styles.factItem}>
                  <Ionicons
                    name="star"
                    size={16}
                    color={theme.colors.accent.yellow}
                  />
                  <Text style={styles.factText}>{fact}</Text>
                </View>
              ))}
            </View>
          )}

          {activeTab === "attractions" && (
            <View>
              <Text style={styles.sectionTitle}>Must-See Attractions</Text>
              {placeInfo.mustSeeAttractions.map(
                (attraction: string, index: number) => (
                  <View key={index} style={styles.attractionItem}>
                    <Ionicons
                      name="location"
                      size={16}
                      color={theme.colors.primary.main}
                    />
                    <Text style={styles.attractionText}>{attraction}</Text>
                  </View>
                )
              )}
            </View>
          )}
        </View>

        {/* Action buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.fullWidthButton}
            onPress={startNavigation}
          >
            <Ionicons
              name="navigate"
              size={20}
              color={theme.colors.neutral.white}
            />
            <Text style={styles.actionButtonText}>Start Navigation</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Information powered by AI</Text>
        </View>
      </ScrollView>
    </>
  );
}
