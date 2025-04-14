import { StyleSheet } from "react-native";
import theme from "../../../styles/theme";

export const styles = StyleSheet.create({
  cardContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: theme.colors.neutral.white,
    borderRadius: theme.borderRadius.md,
    overflow: "hidden",
    ...theme.shadows.medium,
  },
  cardImage: {
    width: "100%",
    height: 120,
  },
  cardHeader: {
    padding: theme.spacing.md,
    paddingBottom: 0,
  },
  cardTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: "bold",
    marginBottom: theme.spacing.sm,
    color: theme.colors.text.primary,
  },
  distanceInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  distanceText: {
    marginLeft: theme.spacing.xs,
    marginRight: theme.spacing.xs,
    color: theme.colors.text.secondary,
  },
  distanceIcon: {
    marginLeft: theme.spacing.xs,
  },
  cardDescription: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text.secondary,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  closeButton: {
    position: "absolute",
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    zIndex: 1,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: theme.colors.neutral.white,
    fontSize: theme.typography.fontSizes.md,
    fontWeight: "bold",
  },
  cardButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  cardButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.primary.main,
    flex: 1,
    marginHorizontal: theme.spacing.xs,
    justifyContent: "center",
  },
  activeCardButton: {
    backgroundColor: theme.colors.primary.main,
    borderColor: theme.colors.primary.main,
  },
  navigateButton: {
    backgroundColor: theme.colors.primary.main,
    borderColor: theme.colors.primary.main,
  },
  cardButtonText: {
    color: theme.colors.primary.main,
    fontWeight: "600",
    marginLeft: theme.spacing.xs,
  },
  activeCardButtonText: {
    color: theme.colors.neutral.white,
  },
  navigateText: {
    color: theme.colors.neutral.white,
  },
  navigationButton: {
    flexDirection: "row",
    backgroundColor: theme.colors.primary.main,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    margin: theme.spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  navigationButtonText: {
    color: theme.colors.neutral.white,
    fontWeight: "bold",
    marginRight: theme.spacing.xs,
  },
});
