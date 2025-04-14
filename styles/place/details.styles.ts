import { StyleSheet } from "react-native";
import theme from "../theme";

export const styles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutral.background,
  },

  // Loading state styles
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.neutral.background,
  },
  loadingText: {
    marginTop: theme.spacing.lg,
    fontSize: theme.typography.fontSizes.lg,
    color: theme.colors.text.secondary,
  },

  // Error state styles
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.neutral.background,
  },
  errorText: {
    fontSize: theme.typography.fontSizes.lg,
    textAlign: "center",
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    color: theme.colors.text.secondary,
  },
  backButton: {
    backgroundColor: theme.colors.primary.main,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
  },
  backButtonText: {
    color: theme.colors.neutral.white,
    fontWeight: "bold",
  },

  // Hero section styles
  heroContainer: {
    position: "relative",
    height: 200,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: theme.spacing.lg,
  },
  heroTitle: {
    color: theme.colors.neutral.white,
    fontSize: theme.typography.fontSizes.xxxl,
    fontWeight: "bold",
  },

  // Tab navigation styles
  tabContainer: {
    flexDirection: "row",
    backgroundColor: theme.colors.neutral.white,
    ...theme.shadows.light,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.lg,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary.main,
  },
  tabText: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: "500",
    color: theme.colors.text.secondary,
  },
  activeTabText: {
    color: theme.colors.primary.main,
    fontWeight: "bold",
  },

  // Content styles
  contentContainer: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.neutral.white,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: "bold",
    marginBottom: theme.spacing.md,
    color: theme.colors.text.primary,
  },
  descriptionText: {
    fontSize: theme.typography.fontSizes.lg,
    lineHeight: 24,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.lg,
  },

  // Fact item styles
  factItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: theme.spacing.md,
  },
  factText: {
    fontSize: theme.typography.fontSizes.md,
    lineHeight: 20,
    color: theme.colors.text.secondary,
    flex: 1,
    marginLeft: theme.spacing.sm,
  },

  // Attraction item styles
  attractionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: theme.spacing.md,
  },
  attractionText: {
    fontSize: theme.typography.fontSizes.md,
    lineHeight: 20,
    color: theme.colors.text.secondary,
    flex: 1,
    marginLeft: theme.spacing.sm,
    fontWeight: "500",
  },

  // Action button styles
  actionButtons: {
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.lg,
  },
  fullWidthButton: {
    backgroundColor: theme.colors.primary.main,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonText: {
    color: theme.colors.neutral.white,
    fontWeight: "bold",
    marginLeft: theme.spacing.sm,
    fontSize: theme.typography.fontSizes.lg,
  },

  // Footer styles
  footer: {
    padding: theme.spacing.lg,
    alignItems: "center",
  },
  footerText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.tertiary,
  },
});
