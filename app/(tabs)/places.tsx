import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import locationService, { PlaceLocation } from "../../services/LocationService";
import AIService, { PlaceInfo } from "../../services/AIService";
import placesService from "../../services/PlacesService";
import * as Location from "expo-location";

// Categories for filtering
const categories = [
  { id: "all", label: "All Places" },
  { id: "historical", label: "Historical" },
  { id: "cultural", label: "Cultural" },
  { id: "museum", label: "Museums" },
];

export default function PlacesScreen() {
  const router = useRouter();
  const [places, setPlaces] = useState<PlaceLocation[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<PlaceLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [placeImages, setPlaceImages] = useState<Record<string, string>>({});
  const [placeInfoMap, setPlaceInfoMap] = useState<
    Record<string, PlaceInfo | null>
  >({});

  useEffect(() => {
    const initLocation = async () => {
      await locationService.init();
      const location = await locationService.getCurrentLocation();

      if (location) {
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }

      // Get all places from service
      const allPlaces = await placesService.searchNearbyPlaces(
        location?.coords.latitude || 51.4416,
        location?.coords.longitude || 5.4697
      );

      // Calculate distance from user for each place
      if (location) {
        const userCoords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        const placesWithDistance = allPlaces.map((place) => ({
          ...place,
          distance: locationService.calculateDistance(
            userCoords,
            place.coordinates
          ),
        }));

        // Sort by distance
        placesWithDistance.sort(
          (a, b) => (a.distance || 0) - (b.distance || 0)
        );
        setPlaces(placesWithDistance);
        setFilteredPlaces(placesWithDistance);
      } else {
        setPlaces(allPlaces);
        setFilteredPlaces(allPlaces);
      }

      setLoading(false);

      // Preload place images
      const imagePromises = allPlaces.map(async (place) => {
        if (place.photoReference) {
          const imageUrl = await placesService.getPlacePhoto(
            place.photoReference
          );
          return { id: place.id, url: imageUrl };
        }
        return null;
      });

      const imageResults = await Promise.all(imagePromises);
      const imagesMap: Record<string, string> = {};

      imageResults.forEach((result) => {
        if (result) {
          imagesMap[result.id] = result.url;
        }
      });

      setPlaceImages(imagesMap);

      // Fetch place info for all places
      const infoPromises = allPlaces.map(async (place) => {
        try {
          const info = await AIService.getPlaceInfo(place.name);
          return { name: place.name, info };
        } catch (error) {
          console.error(`Error fetching info for ${place.name}:`, error);
          return { name: place.name, info: null };
        }
      });

      const infoResults = await Promise.all(infoPromises);
      const infoMap: Record<string, PlaceInfo | null> = {};

      infoResults.forEach((result) => {
        infoMap[result.name] = result.info;
      });

      setPlaceInfoMap(infoMap);
    };

    initLocation();

    // Update user location when it changes
    const locationSubscription = locationService.on(
      "locationChanged",
      (location: Location.LocationObject) => {
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    );

    return () => {
      locationService.removeAllListeners("locationChanged");
    };
  }, []);

  // Filter places when category or search query changes
  useEffect(() => {
    if (places.length === 0) return;

    let filtered = places;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (place) => place.category === selectedCategory
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((place) =>
        place.name.toLowerCase().includes(query)
      );
    }

    setFilteredPlaces(filtered);
  }, [selectedCategory, searchQuery, places]);

  const getPlaceImage = (id: string) => {
    // Use the image URL from the placesService if available
    if (placeImages[id]) {
      return { uri: placeImages[id] };
    }

    // Use default web placeholder image instead of local assets
    return {
      uri: "https://images.unsplash.com/photo-1518945756765-f8641d60aa75?q=80&w=600&auto=format",
    };
  };

  const navigateToPlaceDetails = (place: PlaceLocation) => {
    router.push(`/place/${place.name}`);
  };

  // Render each place card
  const renderPlaceItem = ({ item }: { item: PlaceLocation }) => {
    // Get place info from our map instead of using hooks
    const placeInfo = placeInfoMap[item.name];

    return (
      <TouchableOpacity
        style={styles.placeCard}
        onPress={() => navigateToPlaceDetails(item)}
      >
        <Image
          source={getPlaceImage(item.id)}
          style={styles.placeImage}
          resizeMode="cover"
        />
        <View style={styles.placeInfo}>
          <Text style={styles.placeName}>{item.name}</Text>
          {placeInfo && (
            <Text style={styles.placeDescription} numberOfLines={2}>
              {placeInfo.description}
            </Text>
          )}
          <View style={styles.placeDetails}>
            {item.distance !== undefined && (
              <View style={styles.distanceContainer}>
                <Ionicons name="locate-outline" size={16} color="#4CAF50" />
                <Text style={styles.distance}>
                  {locationService.formatDistance(item.distance)}
                </Text>
              </View>
            )}
            <View style={styles.categoryTag}>
              <Text style={styles.categoryText}>
                {item.category || "Place"}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Render the category filter tabs
  const renderCategoryFilter = () => (
    <View style={styles.categoryContainer}>
      <FlatList
        horizontal
        data={categories}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === item.id && styles.selectedCategoryButton,
            ]}
            onPress={() => setSelectedCategory(item.id)}
          >
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory === item.id && styles.selectedCategoryText,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading places...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerTitle: "Explore Places" }} />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search places..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* Category Filters */}
      {renderCategoryFilter()}

      {/* Places List */}
      {filteredPlaces.length > 0 ? (
        <FlatList
          data={filteredPlaces}
          renderItem={renderPlaceItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.placesList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="location-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No places found</Text>
          <Text style={styles.emptySubtext}>
            Try changing your filters or search query
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 16,
    paddingHorizontal: 15,
    borderRadius: 8,
    height: 50,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  categoryContainer: {
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedCategoryButton: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  categoryButtonText: {
    fontSize: 14,
    color: "#666",
  },
  selectedCategoryText: {
    color: "#fff",
    fontWeight: "500",
  },
  placesList: {
    padding: 12,
  },
  placeCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden",
    flexDirection: "row",
    height: 120,
  },
  placeImage: {
    width: 120,
    height: "100%",
  },
  placeInfo: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  placeName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  placeDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  placeDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  distanceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  distance: {
    fontSize: 14,
    color: "#4CAF50",
    marginLeft: 4,
    fontWeight: "500",
  },
  categoryTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
    textAlign: "center",
  },
});
