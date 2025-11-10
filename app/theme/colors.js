// Tema adaptado do Tailwind para React Native
export const colors = {
  // Light theme
  light: {
    background: '#EEF2F6',
    foreground: '#1E293B',
    card: '#FFFFFF',
    cardForeground: '#1E293B',
    primary: '#3B82F6',
    primaryForeground: '#FFFFFF',
    secondary: '#E0E7FF',
    secondaryForeground: '#3B82F6',
    muted: '#F1F5F9',
    mutedForeground: '#64748B',
    accent: '#DBEAFE',
    accentForeground: '#3B82F6',
    destructive: '#EF4444',
    destructiveForeground: '#FFFFFF',
    border: '#CBD5E1',
    input: '#FFFFFF',
    ring: '#3B82F6',
  },
  // Dark theme
  dark: {
    background: '#0F172A',
    foreground: '#F1F5F9',
    card: '#1E293B',
    cardForeground: '#F1F5F9',
    primary: '#3B82F6',
    primaryForeground: '#FFFFFF',
    secondary: '#334155',
    secondaryForeground: '#F1F5F9',
    muted: '#1E293B',
    mutedForeground: '#94A3B8',
    accent: '#1E40AF',
    accentForeground: '#F1F5F9',
    destructive: '#EF4444',
    destructiveForeground: '#FFFFFF',
    border: '#334155',
    input: '#1E293B',
    ring: '#3B82F6',
  },
};

export const shadows = {
  light: {
    sm: {
      shadowColor: '#3B82F6',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#3B82F6',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#3B82F6',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 6,
    },
    xl: {
      shadowColor: '#3B82F6',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 8,
    },
  },
  dark: {
    sm: {
      shadowColor: '#3B82F6',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 3,
    },
    md: {
      shadowColor: '#3B82F6',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 12,
      elevation: 5,
    },
    lg: {
      shadowColor: '#3B82F6',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 16,
      elevation: 7,
    },
    xl: {
      shadowColor: '#3B82F6',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.5,
      shadowRadius: 20,
      elevation: 10,
    },
  },
};

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
};

export const spacing = 4;