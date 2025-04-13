import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import Mapbox from "@rnmapbox/maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LocationObjectCoords } from "expo-location";
import Constants from "expo-constants";

// Initialize Mapbox with access token from environment variables
Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN || "");

// Define types for points of interest
interface PointOfInterest {
  id: string;
  title: string;
  description: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  image: string;
}

// Sample point of interest data
const pointsOfInterest: PointOfInterest[] = [
  {
    id: "1",
    title: "Nuenen",
    description: "The village where Vincent van Gogh lived and worked",
    coordinate: {
      latitude: 51.4728,
      longitude: 5.5514,
    },
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Vincentre_Nuenen.jpg/1024px-Vincentre_Nuenen.jpg",
  },
  {
    id: "2",
    title: "Eindhoven",
    description: "A city known for design and technology innovation",
    coordinate: {
      latitude: 51.4416,
      longitude: 5.4697,
    },
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Eindhoven_-_Stadhuisplein_-_City_Hall_Square_-_Stadhuis.jpg/1024px-Eindhoven_-_Stadhuisplein_-_City_Hall_Square_-_Stadhuis.jpg",
  },
  {
    id: "3",
    title: "Helmond",
    description: "Historic city with a beautiful castle",
    coordinate: {
      latitude: 51.4825,
      longitude: 5.6618,
    },
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/P1000978kopie.jpg/1024px-P1000978kopie.jpg",
  },
];

// Route coordinates for a sample route
const routeCoordinates = [
  [5.4697, 51.4416], // Eindhoven
  [5.5106, 51.4572], // Midpoint
  [5.5514, 51.4728], // Nuenen
];

export default function MapScreen() {
  const router = useRouter();
  const [location, setLocation] = useState<LocationObjectCoords | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPOI, setSelectedPOI] = useState<PointOfInterest | null>(null);
  const mapRef = useRef<Mapbox.MapView>(null);
  const cameraRef = useRef<Mapbox.Camera>(null);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          setLoading(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location.coords);
      } catch (error) {
        setErrorMsg("Could not get location");
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const goToUserLocation = () => {
    if (location && cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: [location.longitude, location.latitude],
        zoomLevel: 14,
        animationDuration: 1000,
      });
    }
  };

  const handleMarkerPress = (poi: PointOfInterest) => {
    setSelectedPOI(poi);
    if (cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: [poi.coordinate.longitude, poi.coordinate.latitude],
        zoomLevel: 14,
        animationDuration: 500,
      });
    }
  };

  const handleCloseCard = () => {
    setSelectedPOI(null);
  };

  const navigateToPlacesTab = () => {
    router.push("/(tabs)/places");
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.paragraph}>Loading map...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.center}>
        <Text style={styles.paragraph}>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Mapbox.MapView
        ref={mapRef}
        style={styles.map}
        styleURL={Mapbox.StyleURL.Street}
        logoEnabled={false}
        attributionEnabled={true}
        compassEnabled={true}
      >
        <Mapbox.Camera
          ref={cameraRef}
          zoomLevel={12}
          centerCoordinate={
            location
              ? [location.longitude, location.latitude]
              : [5.4697, 51.4416]
          }
          animationMode="flyTo"
          animationDuration={2000}
        />

        {location && (
          <Mapbox.PointAnnotation
            id="userLocation"
            coordinate={[location.longitude, location.latitude]}
          >
            <View style={styles.userMarker}>
              <View style={styles.userMarkerInner} />
            </View>
          </Mapbox.PointAnnotation>
        )}

        {pointsOfInterest.map((poi) => (
          <Mapbox.PointAnnotation
            key={poi.id}
            id={poi.id}
            coordinate={[poi.coordinate.longitude, poi.coordinate.latitude]}
            onSelected={() => handleMarkerPress(poi)}
          >
            <View style={styles.markerContainer}>
              <View style={styles.marker}>
                <Text style={styles.markerText}>{poi.title[0]}</Text>
              </View>
            </View>
          </Mapbox.PointAnnotation>
        ))}

        <Mapbox.ShapeSource
          id="routeSource"
          shape={{
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: routeCoordinates,
            },
          }}
        >
          <Mapbox.LineLayer
            id="routeLine"
            style={{
              lineColor: "#3887be",
              lineWidth: 3,
              lineCap: "round",
              lineJoin: "round",
            }}
          />
        </Mapbox.ShapeSource>
      </Mapbox.MapView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={goToUserLocation}>
          <Text style={styles.buttonText}>My Location</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={navigateToPlacesTab}>
          <Text style={styles.buttonText}>View Places</Text>
        </TouchableOpacity>
      </View>

      {selectedPOI && (
        <View style={styles.cardContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleCloseCard}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Image source={{ uri: selectedPOI.image }} style={styles.cardImage} />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{selectedPOI.title}</Text>
            <Text style={styles.cardDescription}>
              {selectedPOI.description}
            </Text>
            <TouchableOpacity
              style={styles.detailsButton}
              onPress={() => {
                Alert.alert(
                  `About ${selectedPOI.title}`,
                  "This feature will allow you to see detailed information about this location.",
                  [{ text: "OK" }]
                );
              }}
            >
              <Text style={styles.detailsButtonText}>Learn More</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  paragraph: {
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
  },
  markerContainer: {
    width: 30,
    height: 30,
  },
  marker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#3887be",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  markerText: {
    color: "white",
    fontWeight: "bold",
  },
  userMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(0, 122, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  userMarkerInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "rgb(0, 122, 255)",
    borderWidth: 2,
    borderColor: "white",
  },
  buttonContainer: {
    position: "absolute",
    top: 16,
    right: 16,
    flexDirection: "column",
    gap: 8,
  },
  button: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3887be",
  },
  cardContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardImage: {
    width: "100%",
    height: 120,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  closeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 1,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  detailsButton: {
    backgroundColor: "#3887be",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  detailsButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
});
