import { StyleSheet } from "react-native";
import theme from "../theme";

export const styles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
  },

  // Loading styles
  mapLoadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: `${theme.colors.neutral.white}B3`, // 70% opacity white
  },
});
