import React, { useState, useEffect, useRef } from "react";
import {
  View,
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
} from "react-native";
import * as Location from "expo-location";
import { Stack } from "expo-router";
import MapboxGL from "@rnmapbox/maps";
import { useNavigation } from "@react-navigation/native";
import locationService, { PlaceLocation } from "../../services/LocationService";
import voiceService from "../../services/VoiceService";
import { router } from "expo-router";
import placesService from "../../services/PlacesService";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import theme from "../../styles/theme";

// Import components
import MapView from "../../components/Map/MapView";
import MapControls from "../../components/Map/MapControls";
import PlaceCard from "../../components/Cards/PlaceCard";
import SearchBar from "../../components/UI/SearchBar";
import LoadingScreen from "../../components/UI/LoadingScreen";
import ErrorScreen from "../../components/UI/ErrorScreen";

// Import types
import { PointOfInterest, Suggestion, PlaceNearbyEvent } from "../../types/map";

// Import data
import { pointsOfInterest } from "../../data/pointsOfInterest";

// Import styles
import { styles } from "../../styles/tabs/map.styles";

// Initialize Mapbox with access token
MapboxGL.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN || "");

export default function Index() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPOI, setSelectedPOI] = useState<PointOfInterest | null>(null);
  const [activeRoute, setActiveRoute] = useState<any>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [distance, setDistance] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredPOIs, setFilteredPOIs] =
    useState<PointOfInterest[]>(pointsOfInterest);
  const [searchSuggestions, setSearchSuggestions] = useState<Suggestion[]>([]);
  const mapboxRef = useRef<MapboxGL.MapView | null>(null);
  const cameraRef = useRef<MapboxGL.Camera | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Initialize location tracking and listeners
  useEffect(() => {
    const setupLocation = async () => {
      try {
        // Request permissions
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          setLoading(false);
          return;
        }

        // Initialize location service
        await locationService.init();
        await locationService.startLocationTracking();

        // Get current location
        let locationData = await Location.getCurrentPositionAsync({});
        setLocation(locationData);
        setLoading(false);

        // Update PlacesService with current location for better search results
        if (locationData?.coords) {
          placesService.setLastLocation(
            locationData.coords.longitude,
            locationData.coords.latitude
          );
        }

        // Listen for place nearby events
        locationService.on("placeNearby", (data: PlaceNearbyEvent) => {
          const { place, distance } = data;

          // Find corresponding POI
          const poi = pointsOfInterest.find((p) => p.title === place.name);
          if (poi) {
            setSelectedPOI(poi);

            // Auto-narrate information about the place
            handleNarratePOI(poi, distance);
          }
        });

        // Listen for voice events
        voiceService.on("speaking", () => setIsSpeaking(true));
        voiceService.on("finished", () => setIsSpeaking(false));
        voiceService.on("stopped", () => setIsSpeaking(false));
      } catch (error) {
        console.error("Error setting up location:", error);
        setErrorMsg("Could not initialize navigation services");
        setLoading(false);
      }
    };

    setupLocation();

    // Cleanup
    return () => {
      locationService.removeAllListeners("placeNearby");
      locationService.stopLocationTracking();
    };
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPOIs(pointsOfInterest);
    } else {
      const lowercaseQuery = searchQuery.toLowerCase();
      const filtered = pointsOfInterest.filter(
        (poi) =>
          poi.title.toLowerCase().includes(lowercaseQuery) ||
          poi.description.toLowerCase().includes(lowercaseQuery)
      );
      setFilteredPOIs(filtered);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (selectedPOI && location) {
      calculateRouteToSelectedPOI();
    }
  }, [selectedPOI, location]);

  const calculateRouteToSelectedPOI = async () => {
    if (!selectedPOI || !location) return;

    try {
      const startLat = location.coords.latitude;
      const startLng = location.coords.longitude;
      const endLat = selectedPOI.coordinate.latitude;
      const endLng = selectedPOI.coordinate.longitude;

      const routeInfo = await locationService.getRoute(
        startLat,
        startLng,
        endLat,
        endLng
      );

      if (routeInfo) {
        setActiveRoute(routeInfo);
        setDistance(locationService.formatDistance(routeInfo.distance));
        setDuration(locationService.formatDuration(routeInfo.duration));
      }
    } catch (error) {
      console.error("Error calculating route:", error);
    }
  };

  // Handle POI narration
  const handleNarratePOI = async (poi: PointOfInterest, distance?: number) => {
    try {
      // Stop any ongoing narration
      if (isSpeaking) {
        voiceService.stop();
      }

      // Calculate distance if not provided
      const distanceInKm =
        distance ||
        (location
          ? locationService.calculateDistance(
              {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              },
              poi.coordinate
            )
          : 1);

      // Speak the approaching narrative
      await voiceService.speakApproachingNarrative(poi.title, distanceInKm);
    } catch (error) {
      console.error("Error narrating POI:", error);
    }
  };

  // Center the map on user location
  const goToUserLocation = () => {
    if (location && cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: [location.coords.longitude, location.coords.latitude],
        zoomLevel: 14,
        animationDuration: 500,
      });
    }
  };

  // Handle marker press
  const handleMarkerPress = (poi: PointOfInterest) => {
    setSelectedPOI(poi);

    // Calculate distance and generate narration
    if (location) {
      const distance = locationService.calculateDistance(
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        poi.coordinate
      );
      handleNarratePOI(poi, distance);
    }

    // Animate map to show the POI
    if (cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: [poi.coordinate.longitude, poi.coordinate.latitude],
        zoomLevel: 14,
        animationDuration: 500,
      });
    }
  };

  // Handle close card
  const handleCloseCard = () => {
    setSelectedPOI(null);
    if (isSpeaking) {
      voiceService.stop();
    }
  };

  // Start navigation to the selected POI using native maps app
  const startNavigation = (poi: PointOfInterest) => {
    const { latitude, longitude } = poi.coordinate;
    const label = encodeURIComponent(poi.title);
    let url: string;

    // Different URL schemes for iOS and Android
    if (Platform.OS === "ios") {
      url = `maps://app?saddr=Current+Location&daddr=${latitude},${longitude}&dirflg=d`;
    } else {
      url = `google.navigation:q=${latitude},${longitude}`;
    }

    // Open the native navigation app
    navigateToPlace(url, latitude, longitude);
  };

  const navigateToPlace = (
    url: string,
    latitude: number,
    longitude: number
  ) => {
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
        Alert.alert("Navigation Error", "Could not open navigation app");
      });
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const navigateToPlaceDetails = () => {
    if (selectedPOI) {
      // Navigate to the places tab with the selected POI
      router.push("/(tabs)/places");
    }
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

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    // If there's an active search query, refresh results with new category
    if (searchQuery.trim().length >= 2) {
      fetchSuggestions(searchQuery, category).then((suggestions) => {
        setSearchSuggestions(suggestions);
      });
    }
  };

  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion: Suggestion) => {
    if (!suggestion.coordinate) return;

    // Find if the suggestion corresponds to one of our POIs
    const matchingPOI = pointsOfInterest.find(
      (poi) => poi.title.toLowerCase() === suggestion.placeName.toLowerCase()
    );

    if (matchingPOI) {
      // If it's a known POI, select it
      handleMarkerPress(matchingPOI);
    } else {
      // Otherwise create a temporary POI and navigate to it
      const tempPOI: PointOfInterest = {
        id: suggestion.id,
        title: suggestion.placeName,
        description: suggestion.description || "Search result",
        coordinate: suggestion.coordinate,
        image:
          "https://images.unsplash.com/photo-1518945756765-f8641d60aa75?q=80&w=600&auto=format",
      };

      // Animate to the selected location
      if (cameraRef.current) {
        cameraRef.current.setCamera({
          centerCoordinate: [
            suggestion.coordinate.longitude,
            suggestion.coordinate.latitude,
          ],
          zoomLevel: 14,
          animationDuration: 500,
        });
      }
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading navigation map..." />;
  }

  if (errorMsg) {
    return <ErrorScreen message={errorMsg} />;
  }

  return (
    <View style={[styles.container]}>
      <Stack.Screen
        options={{
          title: "Navigation",
          headerStyle: {
            backgroundColor: theme.colors.neutral.white,
          },
          headerTitleStyle: {
            fontWeight: "600",
            color: theme.colors.text.primary,
          },
        }}
      />

      {/* Map View */}
      <MapView
        mapboxRef={mapboxRef}
        cameraRef={cameraRef}
        location={location}
        filteredPOIs={filteredPOIs}
        selectedPOI={selectedPOI}
        activeRoute={activeRoute}
        onMapReady={() => setMapReady(true)}
        onMarkerPress={handleMarkerPress}
      />

      {/* Search Bar */}
      <SearchBar
        onSearch={handleSearch}
        onSelectSuggestion={handleSelectSuggestion}
        onCategoryChange={handleCategoryChange}
        placeholder="Search places..."
        fetchSuggestions={fetchSuggestions}
        topOffset={15}
      />

      {/* Locate User Button */}
      <MapControls
        onLocateUser={goToUserLocation}
        showPlaceCard={!!selectedPOI}
      />

      {/* Selected POI Card */}
      {selectedPOI && (
        <PlaceCard
          poi={selectedPOI}
          distance={distance}
          duration={duration}
          isSpeaking={isSpeaking}
          onClose={handleCloseCard}
          onNarrate={() => handleNarratePOI(selectedPOI)}
          onNavigate={() => startNavigation(selectedPOI)}
          onViewDetails={navigateToPlaceDetails}
        />
      )}

      {/* Loading indicator while map is preparing */}
      {!mapReady && (
        <View style={styles.mapLoadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary.main} />
        </View>
      )}
    </View>
  );
}
