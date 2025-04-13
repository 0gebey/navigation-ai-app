import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import AIService from "../../services/AIService";
import type { PlaceInfo } from "../../services/AIService";

// Mock image data - in a real app, these would come from an API or assets
const placeImages: Record<string, string[]> = {
  Nuenen: [
    "https://images.unsplash.com/photo-1614094082869-cd4e4b2905c7?q=80&w=2787&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1503560683205-acf61ac68a3b?q=80&w=2787&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1610558528098-ed78dc36f8dc?q=80&w=2787&auto=format&fit=crop",
  ],
  Eindhoven: [
    "https://images.unsplash.com/photo-1558000143-a78f8299c40b?q=80&w=2787&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544985361-b420d7a77043?q=80&w=2787&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1605796348891-2d75d68e8cb9?q=80&w=2787&auto=format&fit=crop",
  ],
  Helmond: [
    "https://images.unsplash.com/photo-1569949609438-f8f0c6a4479a?q=80&w=2815&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1518639192441-8fce0a366e2e?q=80&w=2787&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1528041119984-da3a9f8a04d4?q=80&w=2787&auto=format&fit=crop",
  ],
};

export default function PlaceDetailScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const router = useRouter();
  const placeName = name || "Nuenen"; // Default to Nuenen if no name provided

  const [placeInfo, setPlaceInfo] = useState<PlaceInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("about");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch place information when the screen loads
  useEffect(() => {
    const fetchPlaceInfo = async () => {
      try {
        const info = await AIService.getPlaceInfo(placeName);
        setPlaceInfo(info);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching place info:", error);
        setLoading(false);
      }
    };

    fetchPlaceInfo();
  }, [placeName]);

  // Handle navigation back
  const handleBack = () => {
    router.back();
  };

  // Handle image carousel navigation
  const handleNextImage = () => {
    const images = placeImages[placeName] || [];
    setCurrentImageIndex((currentImageIndex + 1) % images.length);
  };

  const handlePrevImage = () => {
    const images = placeImages[placeName] || [];
    setCurrentImageIndex(
      (currentImageIndex - 1 + images.length) % images.length
    );
  };

  // Open maps app with directions to the place
  const handleGetDirections = () => {
    // In a real app, we would use the actual coordinates
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      placeName
    )}`;
    Linking.openURL(url);
  };

  // Play audio narration
  const handlePlayAudio = () => {
    // In a real app, this would trigger text-to-speech or play a pre-recorded audio
    alert("Audio narration would play here");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF5722" />
        <Text style={styles.loadingText}>
          Loading information about {placeName}...
        </Text>
      </View>
    );
  }

  if (!placeInfo) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#F44336" />
        <Text style={styles.errorText}>
          Could not load information for {placeName}
        </Text>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const images = placeImages[placeName] || [];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header with image carousel */}
      <View style={styles.imageContainer}>
        {images.length > 0 ? (
          <>
            <Image
              source={{ uri: images[currentImageIndex] }}
              style={styles.image}
              resizeMode="cover"
            />

            {/* Image navigation buttons */}
            {images.length > 1 && (
              <>
                <TouchableOpacity
                  style={[styles.imageNavButton, styles.imageNavLeft]}
                  onPress={handlePrevImage}
                >
                  <Ionicons name="chevron-back" size={24} color="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.imageNavButton, styles.imageNavRight]}
                  onPress={handleNextImage}
                >
                  <Ionicons name="chevron-forward" size={24} color="#FFF" />
                </TouchableOpacity>

                {/* Image counter */}
                <View style={styles.imageCounter}>
                  <Text style={styles.imageCounterText}>
                    {currentImageIndex + 1}/{images.length}
                  </Text>
                </View>
              </>
            )}
          </>
        ) : (
          <View style={styles.noImageContainer}>
            <Ionicons name="image-outline" size={64} color="#BDBDBD" />
            <Text style={styles.noImageText}>No images available</Text>
          </View>
        )}

        {/* Back button */}
        <TouchableOpacity style={styles.backButtonTop} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>

        {/* Title overlay */}
        <View style={styles.titleOverlay}>
          <Text style={styles.title}>{placeInfo.name}</Text>
        </View>
      </View>

      {/* Action buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleGetDirections}
        >
          <Ionicons name="navigate" size={24} color="#FF5722" />
          <Text style={styles.actionButtonText}>Directions</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handlePlayAudio}>
          <Ionicons name="volume-high" size={24} color="#FF5722" />
          <Text style={styles.actionButtonText}>Listen</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => {}}>
          <Ionicons name="bookmark-outline" size={24} color="#FF5722" />
          <Text style={styles.actionButtonText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => {}}>
          <Ionicons name="share-social-outline" size={24} color="#FF5722" />
          <Text style={styles.actionButtonText}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* Content tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeSection === "about" && styles.activeTab]}
          onPress={() => setActiveSection("about")}
        >
          <Text
            style={[
              styles.tabText,
              activeSection === "about" && styles.activeTabText,
            ]}
          >
            About
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeSection === "history" && styles.activeTab]}
          onPress={() => setActiveSection("history")}
        >
          <Text
            style={[
              styles.tabText,
              activeSection === "history" && styles.activeTabText,
            ]}
          >
            History
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeSection === "attractions" && styles.activeTab,
          ]}
          onPress={() => setActiveSection("attractions")}
        >
          <Text
            style={[
              styles.tabText,
              activeSection === "attractions" && styles.activeTabText,
            ]}
          >
            Must See
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeSection === "facts" && styles.activeTab]}
          onPress={() => setActiveSection("facts")}
        >
          <Text
            style={[
              styles.tabText,
              activeSection === "facts" && styles.activeTabText,
            ]}
          >
            Fun Facts
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content area */}
      <ScrollView style={styles.contentContainer}>
        {activeSection === "about" && (
          <View style={styles.sectionContainer}>
            <Text style={styles.description}>{placeInfo.description}</Text>
          </View>
        )}

        {activeSection === "history" && (
          <View style={styles.sectionContainer}>
            {placeInfo.historicalFacts.map((fact: string, index: number) => (
              <View key={index} style={styles.factItem}>
                <View style={styles.factBullet}>
                  <Text style={styles.factBulletText}>{index + 1}</Text>
                </View>
                <Text style={styles.factText}>{fact}</Text>
              </View>
            ))}
          </View>
        )}

        {activeSection === "attractions" && (
          <View style={styles.sectionContainer}>
            {placeInfo.mustSeeAttractions.map(
              (attraction: string, index: number) => (
                <View key={index} style={styles.attractionItem}>
                  <Ionicons name="star" size={20} color="#FFB300" />
                  <Text style={styles.attractionText}>{attraction}</Text>
                </View>
              )
            )}
          </View>
        )}

        {activeSection === "facts" && (
          <View style={styles.sectionContainer}>
            {placeInfo.funFacts.map((fact: string, index: number) => (
              <View key={index} style={styles.funFactItem}>
                <Ionicons name="bulb-outline" size={24} color="#FF5722" />
                <Text style={styles.funFactText}>{fact}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#616161",
    textAlign: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: "#616161",
    textAlign: "center",
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: "#FF5722",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  imageContainer: {
    height: 250,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  noImageContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  noImageText: {
    color: "#9E9E9E",
    marginTop: 10,
  },
  imageNavButton: {
    position: "absolute",
    top: "50%",
    transform: [{ translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  imageNavLeft: {
    left: 10,
  },
  imageNavRight: {
    right: 10,
  },
  imageCounter: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  imageCounterText: {
    color: "#FFFFFF",
    fontSize: 12,
  },
  backButtonTop: {
    position: "absolute",
    top: 10,
    left: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  titleOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 15,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#FFFFFF",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  actionButton: {
    alignItems: "center",
  },
  actionButtonText: {
    marginTop: 5,
    fontSize: 12,
    color: "#616161",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: "#FF5722",
  },
  tabText: {
    fontSize: 14,
    color: "#616161",
  },
  activeTabText: {
    color: "#FF5722",
    fontWeight: "bold",
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  sectionContainer: {
    padding: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#212121",
  },
  factItem: {
    flexDirection: "row",
    marginBottom: 20,
  },
  factBullet: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FF5722",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  factBulletText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  factText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: "#212121",
  },
  attractionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  attractionText: {
    flex: 1,
    fontSize: 16,
    color: "#212121",
    marginLeft: 12,
  },
  funFactItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFF8E1",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  funFactText: {
    flex: 1,
    fontSize: 16,
    color: "#212121",
    marginLeft: 12,
  },
});
