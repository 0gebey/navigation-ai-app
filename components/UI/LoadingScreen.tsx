import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import theme from "../../styles/theme";

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "Loading...",
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.primary.main} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.neutral.background,
  },
  text: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.fontSizes.lg,
    color: theme.colors.text.secondary,
  },
});

export default LoadingScreen;
