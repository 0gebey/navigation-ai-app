import { StyleSheet } from "react-native";
import theme from "../../../styles/theme";

export const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: theme.spacing.lg,
    bottom: 160,
    zIndex: 3,
  },
  controlButton: {
    position: "absolute",
    right: 0,
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.neutral.white,
    justifyContent: "center",
    alignItems: "center",
    ...theme.shadows.medium,
  },
  activeControlButton: {
    backgroundColor: theme.colors.primary.main,
  },
});
