import { StyleSheet } from "react-native";
import theme from "../theme";

export const styles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutral.background,
    marginTop: theme.spacing.md,
  },

  // List styles
  placesList: {
    padding: theme.spacing.md,
    paddingTop: theme.spacing.xxxl,
    marginTop: theme.spacing.xxxl,
  },
});
