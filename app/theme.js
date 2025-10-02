// theme.js
export const Colors = {
  // Light theme (based on your :root)
  light: {
    background: '#FBFBFE', // oklch(0.9842 0.0034 247.8575) converted to hex
    foreground: '#1A1523', // oklch(0.1363 0.0364 259.2010)
    card: '#FFFFFF',
    cardForeground: '#1A1523',
    primary: '#4A45B2', // oklch(0.3634 0.0902 245.7828)
    primaryForeground: '#FFFFFF',
    secondary: '#EDEDF7', // oklch(0.9288 0.0126 255.5078)
    secondaryForeground: '#4A45B2',
    muted: '#F7F7FB', // oklch(0.9683 0.0069 247.8956)
    mutedForeground: '#6D6A7D', // oklch(0.5544 0.0407 257.4166)
    accent: '#E6B93F', // oklch(0.8253 0.1706 79.9391)
    accentForeground: '#1A1523',
    destructive: '#D84242', // oklch(0.6368 0.2078 25.3313)
    destructiveForeground: '#FBFBFE',
    border: '#EDEDF7',
    ring: '#4A45B2',
  },
  // Dark theme (based on your .dark)
  dark: {
    background: '#1E1B2E', // oklch(0.1408 0.0044 285.8229)
    foreground: '#FBFBFE',
    card: '#2A2642', // oklch(0.2103 0.0059 285.8852)
    cardForeground: '#FBFBFE',
    primary: '#5D58C7', // oklch(0.4565 0.1203 248.1084)
    primaryForeground: '#FBFBFE',
    secondary: '#35314A', // oklch(0.2739 0.0055 286.0326)
    secondaryForeground: '#FBFBFE',
    muted: '#35314A',
    mutedForeground: '#A5A3B0', // oklch(0.7118 0.0129 286.0665)
    accent: '#E6B93F',
    accentForeground: '#1E1B2E',
    destructive: '#B33939', // oklch(0.3958 0.1331 25.7230)
    destructiveForeground: '#FBFBFE',
    border: '#35314A',
    ring: '#5D58C7',
  }
};

export const Shadows = {
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  }
};

export const Radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
};

// Export default theme (light)
export default Colors.light;