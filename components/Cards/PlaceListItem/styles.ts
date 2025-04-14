import { StyleSheet, Dimensions } from "react-native";
import theme from "../../../styles/theme";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: theme.colors.neutral.white,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.md,
    ...theme.shadows.light,
    overflow: "hidden",
  },
  image: {
    width: 100,
    height: "100%",
    borderTopLeftRadius: theme.borderRadius.sm,
    borderBottomLeftRadius: theme.borderRadius.sm,
  },
  contentContainer: {
    flex: 1,
    padding: theme.spacing.md,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  title: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: "600",
    color: theme.colors.text.primary,
    flex: 1,
  },
  categoryPill: {
    backgroundColor: theme.colors.primary.background,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.md,
    marginLeft: theme.spacing.sm,
  },
  categoryText: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.primary.main,
    fontWeight: "500",
  },
  description: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    lineHeight: 18,
    marginBottom: theme.spacing.sm,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  distanceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  distanceText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.primary.main,
    marginLeft: theme.spacing.xs,
  },
  moreInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  moreInfoText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.primary.main,
    fontWeight: "500",
  },
});
