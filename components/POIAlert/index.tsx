import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, Animated, Easing } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles";

interface POIAlertProps {
  title: string;
  description: string;
  distance?: string;
  onClose: () => void;
  onLearnMore: () => void;
}

const POIAlert: React.FC<POIAlertProps> = ({
  title,
  description,
  distance,
  onClose,
  onLearnMore,
}) => {
  // Animation for sliding in the alert
  const slideAnim = React.useRef(new Animated.Value(-200)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start the animation when the component mounts
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-hide after 10 seconds
    const timer = setTimeout(() => {
      handleClose();
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  // Handle close with animation
  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -200,
        duration: 200,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name="location" size={20} color="#FFF" />
          <Text style={styles.title}>{title}</Text>
        </View>
        <TouchableOpacity
          onPress={handleClose}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close-circle" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {distance && (
        <View style={styles.distanceContainer}>
          <Ionicons name="navigate" size={16} color="#FFF" />
          <Text style={styles.distance}>{distance}</Text>
        </View>
      )}

      <Text style={styles.description} numberOfLines={3}>
        {description}
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={onLearnMore}>
          <Text style={styles.buttonText}>Learn More</Text>
          <Ionicons name="chevron-forward" size={16} color="#009688" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default POIAlert;
