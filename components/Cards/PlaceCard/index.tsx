import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PointOfInterest } from "../../../types/map";
import { styles } from "./styles";
import theme from "../../../styles/theme";

interface PlaceCardProps {
  poi: PointOfInterest;
  distance?: string;
  duration?: string;
  isSpeaking?: boolean;
  onClose: () => void;
  onNarrate: () => void;
  onNavigate: () => void;
  onViewDetails: () => void;
}

const PlaceCard: React.FC<PlaceCardProps> = ({
  poi,
  distance,
  duration,
  isSpeaking = false,
  onClose,
  onNarrate,
  onNavigate,
  onViewDetails,
}) => {
  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>✕</Text>
      </TouchableOpacity>

      <Image source={{ uri: poi.image }} style={styles.cardImage} />

      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{poi.title}</Text>
        {distance && duration && (
          <View style={styles.distanceInfo}>
            <Ionicons
              name="time-outline"
              size={16}
              color={theme.colors.text.secondary}
            />
            <Text style={styles.distanceText}>{duration}</Text>
            <Ionicons
              name="compass-outline"
              size={16}
              color={theme.colors.text.secondary}
              style={styles.distanceIcon}
            />
            <Text style={styles.distanceText}>{distance}</Text>
          </View>
        )}
      </View>

      <Text style={styles.cardDescription}>{poi.description}</Text>

      <View style={styles.cardButtons}>
        <TouchableOpacity
          style={[styles.cardButton, isSpeaking && styles.activeCardButton]}
          onPress={onNarrate}
        >
          <Ionicons
            name={isSpeaking ? "volume-high" : "volume-medium"}
            size={18}
            color={
              isSpeaking
                ? theme.colors.neutral.white
                : theme.colors.primary.main
            }
          />
          <Text
            style={[
              styles.cardButtonText,
              isSpeaking && styles.activeCardButtonText,
            ]}
          >
            {isSpeaking ? "Speaking..." : "Narrate"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.cardButton, styles.navigateButton]}
          onPress={onNavigate}
        >
          <Ionicons
            name="navigate"
            size={18}
            color={theme.colors.neutral.white}
          />
          <Text style={[styles.cardButtonText, styles.navigateText]}>
            Navigate
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.navigationButton} onPress={onViewDetails}>
        <Text style={styles.navigationButtonText}>View Details</Text>
        <Ionicons
          name="arrow-forward"
          size={18}
          color={theme.colors.neutral.white}
        />
      </TouchableOpacity>
    </View>
  );
};

export default PlaceCard;
