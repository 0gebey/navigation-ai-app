import { StyleSheet } from "react-native";
import theme from "../theme";

export const styles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutral.background,
  },

  // Profile header styles
  profileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.neutral.white,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: theme.colors.primary.main,
  },
  userInfo: {
    marginLeft: theme.spacing.lg,
  },
  userName: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: "bold",
    color: theme.colors.text.primary,
  },
  userEmail: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs / 2,
  },
  memberSince: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing.xs,
  },
  premiumBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.accent.yellow,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  premiumText: {
    color: theme.colors.text.inverse,
    fontWeight: "bold",
    fontSize: theme.typography.fontSizes.sm,
    marginLeft: theme.spacing.xs / 2,
  },

  // Stats container styles
  statsContainer: {
    flexDirection: "row",
    backgroundColor: theme.colors.neutral.white,
    borderRadius: theme.borderRadius.md,
    marginHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    ...theme.shadows.light,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: theme.typography.fontSizes.xxl,
    fontWeight: "bold",
    color: theme.colors.text.primary,
  },
  statLabel: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  statDivider: {
    width: 1,
    height: "70%",
    backgroundColor: theme.colors.neutral.border,
  },

  // Settings section styles
  settingsSection: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: "bold",
    color: theme.colors.text.primary,
    marginHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.md,
  },
  sectionContent: {
    backgroundColor: theme.colors.neutral.white,
    borderRadius: theme.borderRadius.md,
    marginHorizontal: theme.spacing.xl,
    ...theme.shadows.light,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.divider,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.lg,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: "bold",
    color: theme.colors.text.primary,
  },
  settingDescription: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing.xs / 2,
  },

  // Trip history styles
  tripHistorySection: {
    marginBottom: theme.spacing.xl,
  },
  tripsList: {
    backgroundColor: theme.colors.neutral.white,
    borderRadius: theme.borderRadius.md,
    marginHorizontal: theme.spacing.xl,
    ...theme.shadows.light,
  },
  tripItem: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.divider,
  },
  tripHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.md,
  },
  tripRoute: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: "bold",
    color: theme.colors.text.primary,
  },
  tripDate: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.tertiary,
  },
  tripDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tripDetail: {
    flexDirection: "row",
    alignItems: "center",
  },
  tripDetailText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.xs,
  },
  viewTripButton: {
    backgroundColor: theme.colors.neutral.background,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  viewTripText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    fontWeight: "bold",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xs,
  },
  viewAllText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.primary.main,
    fontWeight: "bold",
    marginRight: theme.spacing.xs,
  },

  // Action button styles
  actionButtons: {
    backgroundColor: theme.colors.neutral.white,
    borderRadius: theme.borderRadius.md,
    marginHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.xxxl,
    ...theme.shadows.light,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.divider,
  },
  actionButtonText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.lg,
  },
  logoutButton: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: theme.colors.accent.red,
  },
});
