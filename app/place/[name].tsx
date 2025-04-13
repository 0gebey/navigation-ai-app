import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AIService, { PlaceInfo } from "../../services/AIService";

export default function PlaceScreen() {
  const { name } = useLocalSearchParams();
  const router = useRouter();
  const [placeInfo, setPlaceInfo] = useState<PlaceInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");

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

  // Web images for demonstration purposes
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

  const placeImages = getPlaceImages(name as string);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>
          Loading information about {name}...
        </Text>
      </View>
    );
  }

  if (!placeInfo) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color="#F44336" />
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

  return (
    <>
      <Stack.Screen
        options={{
          title: placeInfo.name,
          headerBackTitle: "Map",
        }}
      />
      <ScrollView style={styles.container}>
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
            style={[styles.tab, activeTab === "history" && styles.activeTab]}
            onPress={() => setActiveTab("history")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "history" && styles.activeTabText,
              ]}
            >
              History
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
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.factText}>{fact}</Text>
                </View>
              ))}
            </View>
          )}

          {activeTab === "history" && (
            <View>
              <Text style={styles.sectionTitle}>Historical Significance</Text>
              {placeInfo.historicalFacts.map((fact: string, index: number) => (
                <View key={index} style={styles.factItem}>
                  <Ionicons name="time" size={16} color="#4CAF50" />
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
                    <Ionicons name="location" size={16} color="#2196F3" />
                    <Text style={styles.attractionText}>{attraction}</Text>
                  </View>
                )
              )}
            </View>
          )}
        </View>

        <View style={styles.audioSection}>
          <Text style={styles.audioTitle}>Listen to Audio Guide</Text>
          <TouchableOpacity style={styles.audioButton}>
            <Ionicons name="play" size={24} color="#FFF" />
            <Text style={styles.audioButtonText}>Play Audio</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="navigate" size={20} color="#FFF" />
            <Text style={styles.actionButtonText}>Navigate</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="bookmark" size={20} color="#FFF" />
            <Text style={styles.actionButtonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-social" size={20} color="#FFF" />
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Information powered by AI</Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 24,
    color: "#666",
  },
  backButton: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
  },
  backButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  heroContainer: {
    position: "relative",
    height: 200,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 16,
  },
  heroTitle: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#4CAF50",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  activeTabText: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
  contentContainer: {
    padding: 16,
    backgroundColor: "#FFF",
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#444",
    marginBottom: 16,
  },
  factItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  factText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#555",
    flex: 1,
    marginLeft: 8,
  },
  attractionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  attractionText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#555",
    flex: 1,
    marginLeft: 8,
    fontWeight: "500",
  },
  audioSection: {
    backgroundColor: "#FFF",
    padding: 16,
    marginBottom: 8,
    borderRadius: 4,
  },
  audioTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  audioButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  audioButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  actionButton: {
    backgroundColor: "#2196F3",
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
    justifyContent: "center",
  },
  actionButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    marginLeft: 4,
    fontSize: 12,
  },
  footer: {
    padding: 16,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#999",
  },
});
