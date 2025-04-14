import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import theme from "../../styles/theme";

interface Category {
  id: string;
  label: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <View style={styles.categoryContainer}>
      <FlatList
        horizontal
        data={categories}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === item.id && styles.selectedCategoryButton,
            ]}
            onPress={() => onCategoryChange(item.id)}
          >
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory === item.id && styles.selectedCategoryText,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  categoryContainer: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  categoryButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    marginHorizontal: theme.spacing.xs,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.neutral.white,
    borderWidth: 1,
    borderColor: theme.colors.neutral.border,
  },
  selectedCategoryButton: {
    backgroundColor: theme.colors.primary.main,
    borderColor: theme.colors.primary.main,
  },
  categoryButtonText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text.secondary,
  },
  selectedCategoryText: {
    color: theme.colors.neutral.white,
    fontWeight: "500",
  },
});

export default CategoryFilter;
