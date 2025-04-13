import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Platform,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import locationService, { PlaceLocation } from "../services/LocationService";
import MapView, { Marker, Polyline } from "react-native-maps"; // Fallback to React Native Maps

// Get token from environment variables
const MAPBOX_ACCESS_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;

// Check if Mapbox is available
let Mapbox: any;
let MapboxService: any;
let isMapboxAvailable = false;

try {
  Mapbox = require("@rnmapbox/maps").default;
  MapboxService = require("../services/MapboxService").MapboxService;
  isMapboxAvailable = true;
} catch (error) {
  console.log("Mapbox SDK not available in Expo Go");
}

// Get mapbox service instance if available
const mapboxService = isMapboxAvailable ? MapboxService.getInstance() : null;

// Get place image URLs - using web images
const getPlaceImage = (placeName: string): string => {
  const placeImageMap: Record<string, string> = {
    Nuenen:
      "https://images.unsplash.com/photo-1550686041-366ad85a1355?q=80&w=600&auto=format",
    "Eindhoven - Philips Museum":
      "https://images.unsplash.com/photo-1564565562150-46c2e7938b3d?q=80&w=600&auto=format",
    "Helmond Castle":
      "https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?q=80&w=600&auto=format",
  };

  return (
    placeImageMap[placeName] ||
    "https://images.unsplash.com/photo-1518945756765-f8641d60aa75?q=80&w=600&auto=format"
  );
};

export default function MapboxDemoScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<PlaceLocation | null>(
    null
  );
  const [route, setRoute] = useState<any>(null);
  const [tokenConfigured, setTokenConfigured] = useState(false);

  // Use any type for cameraRef since Mapbox might not be available
  const cameraRef = useRef<any>(null);

  // Initialize and configure services
  useEffect(() => {
    const init = async () => {
      try {
        // Initialize location service
        await locationService.init();

        // Get current location
        const location = await locationService.getCurrentLocation();
        if (location) {
          setUserLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        }

        // Get sample places
        const places = locationService.getPlacesOfInterest();
        if (places.length > 0) {
          setSelectedPlace(places[0]); // Select the first place as default
        }

        // Check if in Expo Go - if Mapbox is available, check token configuration
        if (isMapboxAvailable) {
          // Use environment variable for token - fallback to Constants
          const mapboxToken =
            MAPBOX_ACCESS_TOKEN ||
            Constants.expoConfig?.extra?.mapboxAccessToken;
          const isTokenConfigured =
            mapboxToken && mapboxToken !== "YOUR_MAPBOX_ACCESS_TOKEN";
          setTokenConfigured(isTokenConfigured);

          if (isTokenConfigured) {
            mapboxService.initialize();
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error initializing:", error);
        Alert.alert("Error", "Failed to initialize map. Please try again.");
        setLoading(false);
      }
    };

    init();
  }, []);

  // Get route when user and selected place are available
  useEffect(() => {
    const fetchRoute = async () => {
      if (!userLocation || !selectedPlace) return;

      try {
        // If Mapbox is available and configured, get directions from it
        if (isMapboxAvailable && mapboxService && tokenConfigured) {
          const routeData = await mapboxService.getDirections(
            {
              id: "user",
              name: "Your Location",
              coordinates: userLocation,
            } as PlaceLocation,
            selectedPlace
          );

          if (routeData) {
            setRoute(routeData);

            // Fit map to show both user location and destination
            if (cameraRef.current) {
              cameraRef.current.setCamera({
                zoomLevel: 11,
                centerCoordinate: [
                  (userLocation.longitude +
                    selectedPlace.coordinates.longitude) /
                    2,
                  (userLocation.latitude + selectedPlace.coordinates.latitude) /
                    2,
                ],
                animationDuration: 1000,
              });
            }
          }
        } else {
          // Fallback to LocationService's route planning
          const routeData = await locationService.planRoute(
            userLocation,
            selectedPlace.coordinates
          );

          if (routeData) {
            setRoute(routeData);
          }
        }
      } catch (error) {
        console.error("Error fetching route:", error);
      }
    };

    fetchRoute();
  }, [userLocation, selectedPlace]);

  // Handle place selection
  const selectNextPlace = () => {
    const places = locationService.getPlacesOfInterest();
    if (!selectedPlace || places.length <= 1) return;

    const currentIndex = places.findIndex((p) => p.id === selectedPlace.id);
    const nextIndex = (currentIndex + 1) % places.length;
    setSelectedPlace(places[nextIndex]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading map data...</Text>
      </View>
    );
  }

  // If Mapbox is not available (in Expo Go), show the fallback map
  if (!isMapboxAvailable) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerTitle: "Navigation" }} />

        <View style={styles.fallbackWarning}>
          <Ionicons name="information-circle" size={22} color="#FFF" />
          <Text style={styles.fallbackWarningText}>
            Using standard map navigation. Enhanced maps available in installed
            app.
          </Text>
        </View>

        <MapView
          style={styles.map}
          region={{
            latitude: userLocation?.latitude || 51.4416,
            longitude: userLocation?.longitude || 5.4697,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation
        >
          {/* User location marker */}
          {userLocation && (
            <Marker
              coordinate={{
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
              }}
              title="You are here"
            >
              <View style={styles.userMarker}>
                <View style={styles.userMarkerCore} />
              </View>
            </Marker>
          )}

          {/* Destination marker */}
          {selectedPlace && (
            <Marker
              coordinate={{
                latitude: selectedPlace.coordinates.latitude,
                longitude: selectedPlace.coordinates.longitude,
              }}
              title={selectedPlace.name}
            >
              <View style={styles.destinationMarker}>
                <Ionicons name="location" size={24} color="#E53935" />
              </View>
            </Marker>
          )}

          {/* Route line */}
          {route && route.coordinates && (
            <Polyline
              coordinates={route.coordinates}
              strokeWidth={4}
              strokeColor="#4CAF50"
            />
          )}
        </MapView>

        {/* Destination info */}
        {selectedPlace && (
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>{selectedPlace.name}</Text>

            {/* Add image */}
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: getPlaceImage(selectedPlace.name) }}
                style={styles.placeImage}
                resizeMode="cover"
              />
            </View>

            {route && (
              <View style={styles.routeInfo}>
                <View style={styles.routeDetail}>
                  <Ionicons name="navigate-outline" size={20} color="#4CAF50" />
                  <Text style={styles.routeText}>
                    {locationService.formatDistance(route.distance)}
                  </Text>
                </View>
                <View style={styles.routeDetail}>
                  <Ionicons name="time-outline" size={20} color="#4CAF50" />
                  <Text style={styles.routeText}>
                    {locationService.formatDuration(route.duration)}
                  </Text>
                </View>
              </View>
            )}
            <TouchableOpacity
              style={styles.nextButton}
              onPress={selectNextPlace}
            >
              <Text style={styles.nextButtonText}>Next Destination</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  }

  // Mapbox is available but token not configured - show fallback map with warning
  if (!tokenConfigured && isMapboxAvailable) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerTitle: "Navigation" }} />

        <View style={styles.fallbackWarning}>
          <Ionicons name="information-circle" size={22} color="#FFF" />
          <Text style={styles.fallbackWarningText}>
            Using standard map navigation. Enhanced maps coming soon.
          </Text>
        </View>

        <MapView
          style={styles.map}
          region={{
            latitude: userLocation?.latitude || 51.4416,
            longitude: userLocation?.longitude || 5.4697,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation
        >
          {/* User location marker */}
          {userLocation && (
            <Marker
              coordinate={{
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
              }}
              title="You are here"
            >
              <View style={styles.userMarker}>
                <View style={styles.userMarkerCore} />
              </View>
            </Marker>
          )}

          {/* Destination marker */}
          {selectedPlace && (
            <Marker
              coordinate={{
                latitude: selectedPlace.coordinates.latitude,
                longitude: selectedPlace.coordinates.longitude,
              }}
              title={selectedPlace.name}
            >
              <View style={styles.destinationMarker}>
                <Ionicons name="location" size={24} color="#E53935" />
              </View>
            </Marker>
          )}

          {/* Route line */}
          {route && route.coordinates && (
            <Polyline
              coordinates={route.coordinates}
              strokeWidth={4}
              strokeColor="#4CAF50"
            />
          )}
        </MapView>

        {/* Destination info */}
        {selectedPlace && (
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>{selectedPlace.name}</Text>

            {/* Add image */}
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: getPlaceImage(selectedPlace.name) }}
                style={styles.placeImage}
                resizeMode="cover"
              />
            </View>

            {route && (
              <View style={styles.routeInfo}>
                <View style={styles.routeDetail}>
                  <Ionicons name="navigate-outline" size={20} color="#4CAF50" />
                  <Text style={styles.routeText}>
                    {locationService.formatDistance(route.distance)}
                  </Text>
                </View>
                <View style={styles.routeDetail}>
                  <Ionicons name="time-outline" size={20} color="#4CAF50" />
                  <Text style={styles.routeText}>
                    {locationService.formatDuration(route.duration)}
                  </Text>
                </View>
              </View>
            )}
            <TouchableOpacity
              style={styles.nextButton}
              onPress={selectNextPlace}
            >
              <Text style={styles.nextButtonText}>Next Destination</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  }

  // Fallback to React Native Maps when in Expo Go
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerTitle: "Navigation" }} />

      <MapView
        style={styles.map}
        region={{
          latitude: userLocation?.latitude || 51.4416,
          longitude: userLocation?.longitude || 5.4697,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation
      >
        {/* User location marker */}
        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title="You are here"
          >
            <View style={styles.userMarker}>
              <View style={styles.userMarkerCore} />
            </View>
          </Marker>
        )}

        {/* Destination marker */}
        {selectedPlace && (
          <Marker
            coordinate={{
              latitude: selectedPlace.coordinates.latitude,
              longitude: selectedPlace.coordinates.longitude,
            }}
            title={selectedPlace.name}
          >
            <View style={styles.destinationMarker}>
              <Ionicons name="location" size={24} color="#E53935" />
            </View>
          </Marker>
        )}

        {/* Route line */}
        {route && route.coordinates && (
          <Polyline
            coordinates={route.coordinates}
            strokeWidth={4}
            strokeColor="#4CAF50"
          />
        )}
      </MapView>

      {/* Destination info */}
      {selectedPlace && (
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>{selectedPlace.name}</Text>

          {/* Add image */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: getPlaceImage(selectedPlace.name) }}
              style={styles.placeImage}
              resizeMode="cover"
            />
          </View>

          {route && (
            <View style={styles.routeInfo}>
              <View style={styles.routeDetail}>
                <Ionicons name="navigate-outline" size={20} color="#4CAF50" />
                <Text style={styles.routeText}>
                  {locationService.formatDistance(route.distance)}
                </Text>
              </View>
              <View style={styles.routeDetail}>
                <Ionicons name="time-outline" size={20} color="#4CAF50" />
                <Text style={styles.routeText}>
                  {locationService.formatDuration(route.duration)}
                </Text>
              </View>
            </View>
          )}
          <TouchableOpacity style={styles.nextButton} onPress={selectNextPlace}>
            <Text style={styles.nextButtonText}>Next Destination</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
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
  map: {
    flex: 1,
  },
  userMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(33, 150, 243, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  userMarkerCore: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#2196F3",
  },
  destinationMarker: {
    alignItems: "center",
  },
  infoCard: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  imageContainer: {
    marginBottom: 15,
    borderRadius: 8,
    overflow: "hidden",
    height: 120,
  },
  placeImage: {
    width: "100%",
    height: "100%",
  },
  routeInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  routeDetail: {
    flexDirection: "row",
    alignItems: "center",
  },
  routeText: {
    marginLeft: 5,
    fontSize: 16,
    color: "#555",
  },
  nextButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  nextButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  tokenWarning: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(33, 33, 33, 0.85)",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1000,
  },
  tokenWarningText: {
    color: "white",
    marginLeft: 10,
    flex: 1,
  },
  unsupportedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  unsupportedTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  unsupportedText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
  },
  placeholderImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 30,
  },
  setupButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginBottom: 15,
  },
  setupButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  backButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  fallbackWarning: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#F57C00",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1000,
  },
  fallbackWarningText: {
    color: "white",
    marginLeft: 10,
    flex: 1,
  },
});
