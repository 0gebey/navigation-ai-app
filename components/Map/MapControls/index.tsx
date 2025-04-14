import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles";
import theme from "../../../styles/theme";

interface MapControlsProps {
  onLocateUser: () => void;
  showPlaceCard?: boolean;
  onToggleSatelliteView?: () => void;
  isSatelliteView?: boolean;
}

const MapControls: React.FC<MapControlsProps> = ({
  onLocateUser,
  showPlaceCard = false,
  onToggleSatelliteView,
  isSatelliteView = false,
}) => {
  // Adjust the container style when a place card is showing
  const containerStyle = [
    styles.container,
    showPlaceCard ? { bottom: 240 } : null,
  ];

  return (
    <View style={containerStyle}>
      <TouchableOpacity
        style={[styles.controlButton]}
        onPress={onLocateUser}
        accessibilityLabel="Locate me"
      >
        <Ionicons name="locate" size={24} color={theme.colors.primary.main} />
      </TouchableOpacity>

      {onToggleSatelliteView && (
        <TouchableOpacity
          style={[
            styles.controlButton,
            { top: 60 },
            isSatelliteView && styles.activeControlButton,
          ]}
          onPress={onToggleSatelliteView}
          accessibilityLabel="Toggle satellite view"
        >
          <Ionicons
            name="globe-outline"
            size={24}
            color={
              isSatelliteView
                ? theme.colors.neutral.white
                : theme.colors.primary.main
            }
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default MapControls;
