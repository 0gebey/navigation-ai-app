// Theme system for the Map Navigation app
// Based on the profile screen colors and extended for full app theming

// Color palette
export const colors = {
  // Primary colors
  primary: {
    main: "#FF5722", // Orange - primary action color from profile
    light: "#FFCCBC", // Light orange - used for switch track
    dark: "#E64A19", // Darker orange for hover/press states
    background: "#FFF3E0", // Very light orange - used for icon backgrounds
  },

  // Secondary colors
  secondary: {
    main: "#3887BE", // Blue - used for map controls & location indicators
    light: "#64B5F6", // Light blue - for secondary elements
    dark: "#1565C0", // Dark blue - for hover/press states
  },

  // Accent colors
  accent: {
    yellow: "#FF8F00", // Yellow/orange - used for premium badge
    green: "#4CAF50", // Green - used for tabs and success states
    red: "#F44336", // Red - used for logout and error states
  },

  // Neutral colors
  neutral: {
    white: "#FFFFFF",
    background: "#F5F5F5", // Light gray - app background
    card: "#FFFFFF", // White - card background
    border: "#E0E0E0", // Light gray - borders and dividers
    divider: "#F5F5F5", // Very light gray - subtle dividers
  },

  // Text colors
  text: {
    primary: "#212121", // Dark gray - primary text
    secondary: "#616161", // Medium gray - secondary text
    tertiary: "#9E9E9E", // Light gray - tertiary text
    disabled: "#BDBDBD", // Very light gray - disabled text
    inverse: "#FFFFFF", // White - text on dark backgrounds
  },
};

// Typography
export const typography = {
  fontSizes: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 20,
    xxxl: 24,
  },
  fontWeights: {
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
};

// Spacing
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// Border radiuses
export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 10,
  lg: 15,
  xl: 20,
  round: 999, // For fully rounded elements
};

// Shadows
export const shadows = {
  light: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  strong: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
};

// Component specific theming
export const components = {
  button: {
    primary: {
      backgroundColor: colors.primary.main,
      textColor: colors.neutral.white,
    },
    secondary: {
      backgroundColor: colors.secondary.main,
      textColor: colors.neutral.white,
    },
    outlined: {
      backgroundColor: "transparent",
      borderColor: colors.primary.main,
      textColor: colors.primary.main,
    },
    disabled: {
      backgroundColor: colors.neutral.border,
      textColor: colors.text.disabled,
    },
  },
  card: {
    backgroundColor: colors.neutral.card,
    ...shadows.light,
    borderRadius: borderRadius.md,
  },
  input: {
    backgroundColor: colors.neutral.white,
    borderColor: colors.neutral.border,
    textColor: colors.text.primary,
    placeholderColor: colors.text.tertiary,
  },
  toggle: {
    active: {
      thumbColor: colors.primary.main,
      trackColor: colors.primary.light,
    },
    inactive: {
      thumbColor: colors.neutral.white,
      trackColor: colors.neutral.border,
    },
  },
  tab: {
    active: {
      textColor: colors.accent.green,
      iconColor: colors.accent.green,
    },
    inactive: {
      textColor: colors.text.secondary,
      iconColor: colors.text.tertiary,
    },
  },
  mapControls: {
    backgroundColor: colors.neutral.white,
    iconColor: colors.secondary.main,
    activeBackgroundColor: colors.secondary.main,
    activeIconColor: colors.neutral.white,
  },
};

// Theme object that combines all the above
const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  components,
};

export default theme;
