import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import theme from "../../styles/theme";

interface ErrorScreenProps {
  message: string;
  onRetry?: () => void;
  showBackButton?: boolean;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({
  message,
  onRetry,
  showBackButton = true,
}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Ionicons
        name="alert-circle-outline"
        size={60}
        color={theme.colors.accent.red}
      />
      <Text style={styles.errorText}>{message}</Text>

      <View style={styles.buttonContainer}>
        {onRetry && (
          <TouchableOpacity style={styles.button} onPress={onRetry}>
            <Ionicons
              name="refresh"
              size={20}
              color={theme.colors.neutral.white}
            />
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        )}

        {showBackButton && (
          <TouchableOpacity
            style={[styles.button, styles.backButton]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name="arrow-back"
              size={20}
              color={theme.colors.neutral.white}
            />
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.neutral.background,
    padding: theme.spacing.xl,
  },
  errorText: {
    fontSize: theme.typography.fontSizes.xl,
    color: theme.colors.text.primary,
    textAlign: "center",
    marginVertical: theme.spacing.lg,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: theme.spacing.lg,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primary.main,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginHorizontal: theme.spacing.sm,
    ...theme.shadows.light,
  },
  backButton: {
    backgroundColor: theme.colors.accent.red,
  },
  buttonText: {
    color: theme.colors.neutral.white,
    fontWeight: "600",
    marginLeft: theme.spacing.sm,
  },
});

export default ErrorScreen;
