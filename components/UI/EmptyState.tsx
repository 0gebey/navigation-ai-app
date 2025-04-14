import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import theme from "../../styles/theme";

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, message }) => {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={64} color={theme.colors.primary.main} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: "600",
    color: theme.colors.text.primary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    textAlign: "center",
  },
  message: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text.secondary,
    textAlign: "center",
    maxWidth: 300,
  },
});

export default EmptyState;
