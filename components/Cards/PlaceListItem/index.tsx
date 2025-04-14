import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PlaceLocation } from "../../../services/LocationService";
import { PlaceInfo } from "../../../services/AIService";
import { styles } from "./styles";
import theme from "../../../styles/theme";

interface PlaceListItemProps {
  place: PlaceLocation;
  placeInfo: PlaceInfo | null;
  image: any;
  onPress: () => void;
}

const PlaceListItem = ({
  place,
  placeInfo,
  image,
  onPress,
}: PlaceListItemProps) => {
  const getDistanceText = (distance?: number) => {
    if (!distance) return "";

    if (distance < 1000) {
      return `${Math.round(distance)}m away`;
    } else {
      return `${(distance / 1000).toFixed(1)}km away`;
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={image} style={styles.image} />

      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {place.name}
          </Text>

          {place.category && (
            <View style={styles.categoryPill}>
              <Text style={styles.categoryText}>{place.category}</Text>
            </View>
          )}
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {placeInfo?.description || "Loading place information..."}
        </Text>

        <View style={styles.footer}>
          {place.distance !== undefined && (
            <View style={styles.distanceContainer}>
              <Ionicons
                name="location-outline"
                size={14}
                color={theme.colors.primary.main}
              />
              <Text style={styles.distanceText}>
                {getDistanceText(place.distance)}
              </Text>
            </View>
          )}

          <View style={styles.moreInfoContainer}>
            <Text style={styles.moreInfoText}>View Details</Text>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={theme.colors.primary.main}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PlaceListItem;
