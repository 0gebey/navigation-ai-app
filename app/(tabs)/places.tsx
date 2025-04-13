import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// Define types
interface Place {
  id: string;
  name: string;
  distance: string;
  description: string;
  category: string;
  image: string;
  rating: number;
  openNow: boolean;
}

interface Category {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
}

// Mock data based on AIService
const placesData: Place[] = [
  {
    id: "1",
    name: "Nuenen",
    distance: "12 km",
    description:
      "Nuenen is a charming village in the province of North Brabant, Netherlands, famous for being the place where Vincent van Gogh lived and worked from December 1883 to November 1885.",
    category: "historical",
    image:
      "https://images.unsplash.com/photo-1614094082869-cd4e4b2905c7?q=80&w=2787&auto=format&fit=crop",
    rating: 4.8,
    openNow: true,
  },
  {
    id: "2",
    name: "Eindhoven",
    distance: "5 km",
    description:
      "Eindhoven is a vibrant city in the province of North Brabant, Netherlands, known for its technological innovations, design culture, and being the birthplace of Philips Electronics.",
    category: "museum",
    image:
      "https://images.unsplash.com/photo-1558000143-a78f8299c40b?q=80&w=2787&auto=format&fit=crop",
    rating: 4.5,
    openNow: true,
  },
  {
    id: "3",
    name: "Helmond",
    distance: "18 km",
    description:
      "Helmond is a city in the province of North Brabant, Netherlands, known for its medieval castle, industrial heritage, and textile history.",
    category: "historical",
    image:
      "https://images.unsplash.com/photo-1569949609438-f8f0c6a4479a?q=80&w=2815&auto=format&fit=crop",
    rating: 4.3,
    openNow: false,
  },
  {
    id: "4",
    name: "Vincentre Museum",
    distance: "12.5 km",
    description:
      "Learn about Van Gogh's time in Nuenen at this informative and interactive museum.",
    category: "museum",
    image:
      "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?q=80&w=2787&auto=format&fit=crop",
    rating: 4.6,
    openNow: true,
  },
  {
    id: "5",
    name: "De Bundertjes",
    distance: "19 km",
    description:
      "A beautiful nature park in Helmond perfect for walking and cycling.",
    category: "nature",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop",
    rating: 4.4,
    openNow: true,
  },
];

// Categories for filtering
const categories: Category[] = [
  { id: "all", name: "All", icon: "grid-outline" },
  { id: "historical", name: "Historical", icon: "business-outline" },
  { id: "museum", name: "Museums", icon: "color-palette-outline" },
  { id: "nature", name: "Nature", icon: "leaf-outline" },
  { id: "food", name: "Food", icon: "restaurant-outline" },
];

export default function PlacesScreen() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const router = useRouter();

  const filteredPlaces =
    selectedCategory === "all"
      ? placesData
      : placesData.filter((place) => place.category === selectedCategory);

  const handlePlacePress = (placeName: string) => {
    router.push(`/place/${placeName}`);
  };

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item.id && styles.selectedCategory,
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Ionicons
        name={item.icon}
        size={24}
        color={selectedCategory === item.id ? "#FF5722" : "#616161"}
      />
      <Text
        style={[
          styles.categoryText,
          selectedCategory === item.id && styles.selectedCategoryText,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderPlaceItem = ({ item }: { item: Place }) => (
    <TouchableOpacity
      style={styles.placeItem}
      onPress={() => handlePlacePress(item.name)}
    >
      <Image source={{ uri: item.image }} style={styles.placeImage} />
      <View style={styles.placeContent}>
        <View style={styles.placeHeader}>
          <Text style={styles.placeName}>{item.name}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFC107" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>

        <Text style={styles.placeDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.placeFooter}>
          <View style={styles.distanceContainer}>
            <Ionicons name="location-outline" size={16} color="#616161" />
            <Text style={styles.distanceText}>{item.distance}</Text>
          </View>

          <Text
            style={[
              styles.openStatus,
              { color: item.openNow ? "#4CAF50" : "#F44336" },
            ]}
          >
            {item.openNow ? "Open Now" : "Closed"}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.learnMoreButton}
          onPress={() => handlePlacePress(item.name)}
        >
          <Text style={styles.learnMoreText}>Learn More</Text>
          <Ionicons name="chevron-forward" size={16} color="#FF5722" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Discover Places</Text>
        <TouchableOpacity
          style={styles.mapButton}
          onPress={() => router.push("/")}
        >
          <Ionicons name="map-outline" size={24} color="#FF5722" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#616161" />
          <Text style={styles.searchPlaceholder}>Search for places...</Text>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.categoryContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        />
      </View>

      <FlatList
        data={filteredPlaces}
        renderItem={renderPlaceItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.placesList}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#212121",
  },
  mapButton: {
    padding: 8,
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  searchPlaceholder: {
    marginLeft: 10,
    fontSize: 14,
    color: "#9E9E9E",
  },
  filterButton: {
    backgroundColor: "#FF5722",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  categoryContainer: {
    marginBottom: 15,
  },
  categoryList: {
    paddingHorizontal: 15,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  selectedCategory: {
    borderColor: "#FF5722",
    backgroundColor: "#FFF3E0",
  },
  categoryText: {
    fontSize: 14,
    marginLeft: 5,
    color: "#616161",
  },
  selectedCategoryText: {
    color: "#FF5722",
    fontWeight: "bold",
  },
  placesList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  placeItem: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 15,
    marginBottom: 15,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  placeImage: {
    width: 120,
    height: 140,
  },
  placeContent: {
    flex: 1,
    padding: 15,
  },
  placeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  placeName: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    color: "#212121",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3E0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FF8F00",
    marginLeft: 3,
  },
  placeDescription: {
    fontSize: 14,
    color: "#616161",
    marginBottom: 8,
  },
  placeFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  distanceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  distanceText: {
    fontSize: 12,
    color: "#616161",
    marginLeft: 4,
  },
  openStatus: {
    fontSize: 12,
    fontWeight: "bold",
  },
  learnMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  learnMoreText: {
    fontSize: 14,
    color: "#FF5722",
    fontWeight: "bold",
    marginRight: 5,
  },
});
