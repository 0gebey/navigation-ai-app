import { StyleSheet } from "react-native";
import theme from "../theme";

export const styles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutral.background,
  },

  // Section styles
  section: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xxl,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: "600",
    color: theme.colors.text.primary,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  sectionContent: {
    backgroundColor: theme.colors.neutral.white,
    borderRadius: theme.borderRadius.sm,
    marginHorizontal: theme.spacing.lg,
    ...theme.shadows.light,
  },

  // Setting item styles
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.divider,
  },
  settingTextContainer: {
    flex: 1,
    paddingRight: theme.spacing.lg,
  },
  settingTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: "500",
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  settingDescription: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text.secondary,
  },

  // Value display styles
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  valueText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.accent.green,
    marginRight: theme.spacing.sm,
  },

  // Footer styles
  footer: {
    padding: theme.spacing.xxl,
    alignItems: "center",
  },
  footerText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text.tertiary,
  },
});
