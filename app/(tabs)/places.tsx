import React, { useState, useEffect } from "react";
import { View, FlatList } from "react-native";
import { Stack, useRouter } from "expo-router";
import locationService, { PlaceLocation } from "../../services/LocationService";
import AIService, { PlaceInfo } from "../../services/AIService";
import placesService from "../../services/PlacesService";
import * as Location from "expo-location";
import theme from "../../styles/theme";

// Import components
import PlaceListItem from "../../components/Cards/PlaceListItem";
import CategoryFilter from "../../components/UI/CategoryFilter";
import SearchBar from "../../components/UI/SearchBar";
import LoadingScreen from "../../components/UI/LoadingScreen";
import EmptyState from "../../components/UI/EmptyState";

// Import styles
import { styles } from "../../styles/tabs/places.styles";

// Import types
import { Suggestion } from "../../types/map";

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

      // Preload place images and info
      await Promise.all([
        preloadPlaceImages(allPlaces),
        preloadPlaceInfo(allPlaces),
      ]);
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

  // Preload place images
  const preloadPlaceImages = async (allPlaces: PlaceLocation[]) => {
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
  };

  // Preload place info
  const preloadPlaceInfo = async (allPlaces: PlaceLocation[]) => {
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

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  // Fetch search suggestions based on user input
  const fetchSuggestions = async (
    query: string,
    category?: string
  ): Promise<Suggestion[]> => {
    if (query.trim().length < 2) return [];

    try {
      // Use PlacesService to search for places with the selected category
      const results = await placesService.searchPlacesByText(
        query,
        category || selectedCategory
      );

      // Transform the API results to match our Suggestion interface
      return results.map((place) => ({
        id: place.id,
        placeName: place.name,
        description: place.address || place.category,
        coordinate: place.coordinates,
      }));
    } catch (error) {
      console.error("Error fetching search suggestions:", error);
      return [];
    }
  };

  // Render each place card
  const renderPlaceItem = ({ item }: { item: PlaceLocation }) => {
    const placeInfo = placeInfoMap[item.name];

    return (
      <PlaceListItem
        place={item}
        placeInfo={placeInfo}
        image={getPlaceImage(item.id)}
        onPress={() => navigateToPlaceDetails(item)}
      />
    );
  };

  if (loading) {
    return <LoadingScreen message="Loading places..." />;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "Explore Places",
          headerStyle: {
            backgroundColor: theme.colors.neutral.white,
          },
          headerTitleStyle: {
            fontWeight: "600",
            color: theme.colors.text.primary,
          },
        }}
      />

      {/* Search Bar */}
      <SearchBar
        placeholder="Search places..."
        onSearch={handleSearch}
        onSelectSuggestion={(suggestion) => {
          const matchingPlace = places.find(
            (p) => p.name === suggestion.placeName
          );
          if (matchingPlace) {
            navigateToPlaceDetails(matchingPlace);
          }
        }}
        onCategoryChange={handleCategoryChange}
        fetchSuggestions={fetchSuggestions}
        topOffset={0}
      />

      {/* Category Filters */}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Places List */}
      {filteredPlaces.length > 0 ? (
        <FlatList
          data={filteredPlaces}
          renderItem={renderPlaceItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.placesList}
        />
      ) : (
        <EmptyState
          icon="location-outline"
          title="No places found"
          message="Try changing your filters or search query"
        />
      )}
    </View>
  );
}
