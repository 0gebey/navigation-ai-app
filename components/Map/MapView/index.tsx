import React from "react";
import { View } from "react-native";
import MapboxGL from "@rnmapbox/maps";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { PointOfInterest } from "../../../types/map";
import { styles } from "./styles";

interface MapViewProps {
  mapboxRef: React.RefObject<MapboxGL.MapView>;
  cameraRef: React.RefObject<MapboxGL.Camera>;
  location: Location.LocationObject | null;
  filteredPOIs: PointOfInterest[];
  selectedPOI: PointOfInterest | null;
  activeRoute: any;
  onMapReady: () => void;
  onMarkerPress: (poi: PointOfInterest) => void;
  styleURL?: string;
}

const MapView: React.FC<MapViewProps> = ({
  mapboxRef,
  cameraRef,
  location,
  filteredPOIs,
  selectedPOI,
  activeRoute,
  onMapReady,
  onMarkerPress,
  styleURL = MapboxGL.StyleURL.Street,
}) => {
  return (
    <MapboxGL.MapView
      ref={mapboxRef}
      style={styles.map}
      onDidFinishLoadingMap={onMapReady}
      logoEnabled={false}
      compassEnabled={true}
      attributionEnabled={false}
      styleURL={styleURL}
    >
      <MapboxGL.Camera
        ref={cameraRef}
        defaultSettings={{
          centerCoordinate: [
            location?.coords.longitude || 5.469722,
            location?.coords.latitude || 51.441643,
          ],
          zoomLevel: 14,
        }}
        followUserLocation={!selectedPOI}
        animationDuration={500}
      />

      <MapboxGL.UserLocation visible={true} showsUserHeadingIndicator={true} />

      {/* Markers for POIs */}
      {filteredPOIs.map((poi) => (
        <MapboxGL.PointAnnotation
          key={poi.id}
          id={poi.id}
          coordinate={[poi.coordinate.longitude, poi.coordinate.latitude]}
          title={poi.title}
          selected={selectedPOI?.id === poi.id}
          onSelected={() => onMarkerPress(poi)}
        >
          <View style={styles.annotationContainer}>
            <View
              style={[
                styles.markerContainer,
                selectedPOI?.id === poi.id && styles.selectedMarker,
              ]}
            >
              <Ionicons
                name="location"
                size={24}
                color={selectedPOI?.id === poi.id ? "#E91E63" : "#3887BE"}
              />
            </View>
          </View>
        </MapboxGL.PointAnnotation>
      ))}

      {/* Route Line */}
      {activeRoute && activeRoute.coordinates && (
        <MapboxGL.ShapeSource
          id="routeSource"
          shape={{
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: activeRoute.coordinates.map((coord: any) => [
                coord.longitude,
                coord.latitude,
              ]),
            },
          }}
        >
          <MapboxGL.LineLayer
            id="routeLine"
            style={{
              lineColor: "#3887BE",
              lineWidth: 4,
              lineCap: "round",
              lineJoin: "round",
            }}
          />
        </MapboxGL.ShapeSource>
      )}
    </MapboxGL.MapView>
  );
};

export default MapView;
