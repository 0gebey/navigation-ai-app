import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Text,
  Animated,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Suggestion } from "../../types/map";
import theme from "../../styles/theme";

// Categories for filtering
const categories = [
  { id: "all", label: "All" },
  { id: "historical", label: "Historical" },
  { id: "cultural", label: "Cultural" },
  { id: "museum", label: "Museums" },
];

interface SearchBarProps {
  placeholder?: string;
  onSearch: (text: string) => void;
  onSelectSuggestion: (suggestion: Suggestion) => void;
  onCategoryChange: (category: string) => void;
  fetchSuggestions: (query: string, category?: string) => Promise<Suggestion[]>;
  topOffset?: number;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search...",
  onSearch,
  onSelectSuggestion,
  onCategoryChange,
  fetchSuggestions,
  topOffset = 0,
}) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const suggestionAnimation = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    // Animate suggestions panel
    Animated.timing(suggestionAnimation, {
      toValue: suggestions.length > 0 && isFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();

    // Debounced search
    const delayDebounceFn = setTimeout(() => {
      if (query.trim().length > 2) {
        handleSearch();
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, isFocused, selectedCategory]);

  const handleSearch = async () => {
    if (query.trim().length < 3) return;

    setIsLoading(true);
    try {
      const results = await fetchSuggestions(query, selectedCategory);
      setSuggestions(results);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    onCategoryChange(category);
  };

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    onSelectSuggestion(suggestion);
    setQuery(suggestion.placeName);
    setSuggestions([]);
    Keyboard.dismiss();
  };

  const handleClearSearch = () => {
    setQuery("");
    setSuggestions([]);
    onSearch("");
    inputRef.current?.focus();
  };

  return (
    <View style={[styles.container, { top: topOffset }]}>
      {/* Search input */}
      <View style={styles.searchBarContainer}>
        <Ionicons
          name="search"
          size={20}
          color={theme.colors.text.secondary}
          style={styles.searchIcon}
        />
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder={placeholder}
          value={query}
          onChangeText={(text) => {
            setQuery(text);
            onSearch(text);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={handleClearSearch}>
            <Ionicons
              name="close-circle"
              size={20}
              color={theme.colors.text.secondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === item.id && styles.categorySelected,
              ]}
              onPress={() => handleCategorySelect(item.id)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === item.id && styles.categoryTextSelected,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Suggestions */}
      <Animated.View
        style={[
          styles.suggestionsContainer,
          {
            maxHeight: suggestionAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 200],
            }),
            opacity: suggestionAnimation,
            paddingVertical: suggestionAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 8],
            }),
          },
        ]}
      >
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.suggestionItem}
              onPress={() => handleSelectSuggestion(item)}
            >
              <Ionicons
                name="location-outline"
                size={20}
                color={theme.colors.primary.main}
              />
              <View style={styles.suggestionTextContainer}>
                <Text style={styles.suggestionTitle}>{item.placeName}</Text>
                {item.description && (
                  <Text style={styles.suggestionDescription} numberOfLines={1}>
                    {item.description}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            isLoading ? (
              <View style={styles.loaderContainer}>
                <Text style={styles.emptyText}>Searching...</Text>
              </View>
            ) : query.length > 2 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No results found</Text>
              </View>
            ) : null
          }
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: theme.spacing.md,
    right: theme.spacing.md,
    zIndex: 5,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.neutral.white,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.md,
    height: 48,
    ...theme.shadows.medium,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: theme.typography.fontSizes.lg,
    color: theme.colors.text.primary,
  },
  categoriesContainer: {
    marginTop: theme.spacing.md,
  },
  categoryButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.neutral.white,
    borderRadius: theme.borderRadius.round,
    marginRight: theme.spacing.sm,
    ...theme.shadows.light,
  },
  categorySelected: {
    backgroundColor: theme.colors.primary.main,
  },
  categoryText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text.secondary,
  },
  categoryTextSelected: {
    color: theme.colors.neutral.white,
    fontWeight: "600",
  },
  suggestionsContainer: {
    backgroundColor: theme.colors.neutral.white,
    borderRadius: theme.borderRadius.sm,
    marginTop: theme.spacing.xs,
    ...theme.shadows.medium,
    overflow: "hidden",
  },
  suggestionItem: {
    flexDirection: "row",
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.divider,
    alignItems: "center",
  },
  suggestionTextContainer: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  suggestionTitle: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: "500",
    color: theme.colors.text.primary,
  },
  suggestionDescription: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs / 2,
  },
  loaderContainer: {
    padding: theme.spacing.lg,
    alignItems: "center",
  },
  emptyContainer: {
    padding: theme.spacing.lg,
    alignItems: "center",
  },
  emptyText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSizes.md,
  },
});

export default SearchBar;
