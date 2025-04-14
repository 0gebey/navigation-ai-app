import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  annotationContainer: {
    alignItems: "center",
  },
  markerContainer: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedMarker: {
    transform: [{ scale: 1.2 }],
  },
});
