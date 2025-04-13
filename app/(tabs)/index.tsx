import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// Define POI type
interface PointOfInterest {
  id: number;
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  description: string;
  images: string[];
}

// Mock data for route
const mockRoute = [
  { latitude: 51.4416, longitude: 5.4697 }, // Eindhoven
  { latitude: 51.4431, longitude: 5.4728 }, // Point 1
  { latitude: 51.4472, longitude: 5.4811 }, // Point 2
  { latitude: 51.4505, longitude: 5.49 }, // Point 3
  { latitude: 51.4583, longitude: 5.5583 }, // Nuenen (point of interest)
  { latitude: 51.4733, longitude: 5.6178 }, // Helmond
];

// Mock point of interest data
const pointsOfInterest: PointOfInterest[] = [
  {
    id: 1,
    name: "Nuenen",
    coordinates: { latitude: 51.4583, longitude: 5.5583 },
    description:
      "Village where Vincent van Gogh lived and worked from 1883 to 1885.",
    images: ["nuenen1.jpg", "nuenen2.jpg"],
  },
];

export default function MapScreen() {
  const router = useRouter();
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [region, setRegion] = useState({
    latitude: 51.4416,
    longitude: 5.4697,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [showAlert, setShowAlert] = useState(false);
  const [currentPOI, setCurrentPOI] = useState<PointOfInterest | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      // Mock user approaching Nuenen after 5 seconds
      setTimeout(() => {
        setCurrentPOI(pointsOfInterest[0]);
        setShowAlert(true);
      }, 5000);
    })();
  }, []);

  const handleLearnMore = (placeName: string) => {
    router.push(`/place/${placeName}`);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation
        showsMyLocationButton
      >
        {/* Display user location marker if available */}
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="You are here"
            pinColor="#3F51B5"
          />
        )}

        {/* Display route as individual markers instead of Polyline */}
        {mockRoute.map((point, index) => (
          <Marker
            key={`route-${index}`}
            coordinate={point}
            pinColor={
              index === 0 || index === mockRoute.length - 1
                ? "#FF5722"
                : "#FFAB91"
            }
            opacity={0.7}
            anchor={{ x: 0.5, y: 0.5 }}
          />
        ))}

        {/* Display points of interest */}
        {pointsOfInterest.map((poi) => (
          <Marker
            key={poi.id}
            coordinate={poi.coordinates}
            title={poi.name}
            description={poi.description}
            pinColor="#4CAF50"
            onCalloutPress={() => handleLearnMore(poi.name)}
          />
        ))}
      </MapView>

      {/* Navigation Card */}
      <View style={styles.navCard}>
        <View style={styles.navHeader}>
          <View style={styles.navHeaderContent}>
            <Ionicons name="alert-circle" size={24} color="#FF9800" />
            <Text style={styles.navDelay}>8 min delay</Text>
          </View>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.navProgress}>
          <View style={styles.progressBar}>
            <View style={styles.progressFill}></View>
            <View style={styles.progressEmpty}></View>
          </View>
          <Text style={styles.navInfo}>400 m - Defective vehicle</Text>
        </View>

        <View style={styles.navDirections}>
          <View style={styles.navDirectionInfo}>
            <Ionicons
              name="arrow-up"
              size={28}
              color="#FFF"
              style={styles.directionIcon}
            />
            <View style={styles.navTextContainer}>
              <Text style={styles.navDistance}>1.9 km</Text>
              <Text style={styles.navStreet}>Ede-Noord / Renswoude</Text>
            </View>
          </View>
          <View style={styles.navHighway}>
            <Text style={styles.highwayText}>A30</Text>
          </View>
        </View>
      </View>

      {/* POI Alert */}
      {showAlert && currentPOI && (
        <View style={styles.poiAlert}>
          <View style={styles.poiHeader}>
            <Text style={styles.poiTitle}>{currentPOI.name}</Text>
            <TouchableOpacity onPress={() => setShowAlert(false)}>
              <Ionicons name="close-circle" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.poiDescription}>{currentPOI.description}</Text>
          <TouchableOpacity
            style={styles.poiButton}
            onPress={() => handleLearnMore(currentPOI.name)}
          >
            <Text style={styles.poiButtonText}>Learn More</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Speed Limit */}
      <View style={styles.speedContainer}>
        <View style={styles.speedLimit}>
          <Text style={styles.speedText}>100</Text>
        </View>
        <View style={styles.currentSpeed}>
          <Text style={styles.currentSpeedText}>98</Text>
        </View>
      </View>

      {/* Navigation Toolbar */}
      <View style={styles.toolbar}>
        <TouchableOpacity style={styles.toolbarButton}>
          <Ionicons name="menu" size={24} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolbarButton}>
          <Ionicons name="search" size={24} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.toolbarButton}
          onPress={() => router.push("/places")}
        >
          <Ionicons name="list" size={24} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolbarButton}>
          <Ionicons name="options" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  navCard: {
    position: "absolute",
    bottom: 110,
    left: 10,
    right: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  navHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  navHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  navDelay: {
    marginLeft: 5,
    fontWeight: "bold",
    color: "#FF9800",
  },
  navProgress: {
    marginBottom: 10,
  },
  progressBar: {
    flexDirection: "row",
    height: 6,
    borderRadius: 3,
    marginBottom: 5,
  },
  progressFill: {
    flex: 0.7,
    backgroundColor: "#64DD17",
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
  },
  progressEmpty: {
    flex: 0.3,
    backgroundColor: "#E0E0E0",
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
  navInfo: {
    fontSize: 12,
    color: "#757575",
  },
  navDirections: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navDirectionInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  directionIcon: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 20,
    overflow: "hidden",
  },
  navTextContainer: {
    marginLeft: 10,
  },
  navDistance: {
    fontWeight: "bold",
    fontSize: 18,
  },
  navStreet: {
    fontSize: 14,
    color: "#424242",
  },
  navHighway: {
    backgroundColor: "#F44336",
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  highwayText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  poiAlert: {
    position: "absolute",
    top: 20,
    left: 10,
    right: 10,
    backgroundColor: "rgba(33, 150, 243, 0.9)",
    borderRadius: 10,
    padding: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  poiHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  poiTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  poiDescription: {
    fontSize: 14,
    color: "#E1F5FE",
    marginBottom: 15,
  },
  poiButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    alignSelf: "flex-start",
  },
  poiButtonText: {
    color: "#0D47A1",
    fontWeight: "bold",
  },
  speedContainer: {
    position: "absolute",
    right: 10,
    top: 100,
    alignItems: "center",
  },
  speedLimit: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#FF0000",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  speedText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
  },
  currentSpeed: {
    width: 60,
    height: 60,
    backgroundColor: "#212121",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  currentSpeedText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  toolbar: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  toolbarButton: {
    padding: 10,
  },
});
