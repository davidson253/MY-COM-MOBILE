/**
 * Configuration centralisée des couleurs de l'application
 */

// === COULEURS DE BASE UTILISÉES ===
export const BASE_COLORS = {
  // Couleurs essentielles
  white: "#ffffff",

  // Gris (les plus utilisés)
  gray: {
    50: "#f9fafb", // backgrounds
    100: "#f3f4f6", // surfaces
    200: "#e5e7eb", // borders
    300: "#d1d5db", // borders medium
    400: "#9ca3af", // borders dark
    500: "#6b7280", // text muted
    600: "#4b5563", // text secondary
    700: "#374151", // text primary
    800: "#1f2937", // text dark
    900: "#111827", // text very dark
  },

  // Bleu (principal)
  blue: {
    100: "#dbeafe", // light backgrounds
    500: "#3b82f6", // primary
    600: "#2563eb", // primary hover
  },

  // Vert (succès/règlements)
  green: {
    100: "#dcfce7", // light backgrounds
    500: "#22c55e", // success
    600: "#16a34a", // success hover
  },

  // Orange (alerte/édition)
  orange: {
    100: "#ffedd5", // light backgrounds
    500: "#f97316", // warning
    600: "#ea580c", // warning hover
  },

  // Rouge (erreur/suppression)
  red: {
    100: "#fee2e2", // light backgrounds
    200: "#fecaca", // borders
    500: "#ef4444", // danger
    600: "#dc2626", // danger hover
  },

  // Violet (articles)
  purple: {
    100: "#f3e8ff", // light backgrounds
    500: "#a855f7", // articles primary
    700: "#7c3aed", // articles accent
  },

  // Cyan (clients)
  cyan: {
    100: "#cffafe", // light backgrounds
    500: "#06b6d4", // clients primary
  },
};

// === COULEURS SPÉCIFIQUES RÉELLEMENT UTILISÉES ===
export const APP_COLORS = {
  // Couleurs de fond
  background: "#f8fafc", // Background principal
  surface: BASE_COLORS.white, // Cards/surfaces

  // Couleurs de texte
  textPrimary: "#1e293b", // Titres principaux
  textSecondary: "#374151", // Texte normal
  textMuted: BASE_COLORS.gray[500],

  // Couleurs de bordure
  border: "#e2e8f0", // Bordures normales
  borderLight: "#f1f5f9", // Bordures claires
  borderFocus: BASE_COLORS.blue[500],

  // Couleurs des boutons
  primary: BASE_COLORS.blue[500],
  primaryHover: BASE_COLORS.blue[600],

  secondary: "#64748b", // Gris spécial boutons
  secondaryHover: "#475569", // Gris hover spécial

  // États
  success: "#10b981", // Vert spécial (règlements)
  successHover: "#059669",
  successLight: "#f0fdf4",

  warning: "#f59e0b", // Orange spécial (édition)
  warningHover: "#d97706",
  warningLight: "#fef7ed",

  error: BASE_COLORS.red[500],
  errorHover: BASE_COLORS.red[600],
  errorLight: "#fef2f2",

  // Couleurs par module
  articles: "#8b5cf6", // Violet spécial
  articlesLight: BASE_COLORS.purple[100],

  clients: BASE_COLORS.cyan[500],
  clientsLight: BASE_COLORS.cyan[100],

  commandes: BASE_COLORS.blue[500],
  commandesLight: BASE_COLORS.blue[100],

  reglements: "#10b981", // Vert spécial
  reglementsLight: "#dcfce7",
};

// === OMBRES UTILISÉES ===
export const SHADOWS = {
  card: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  focus: "0 0 0 3px rgba(59, 130, 246, 0.1)",
};

// === THÈME PRINCIPAL (LIGHT) ===
export const THEME_COLORS = {
  light: {
    background: APP_COLORS.background,
    surface: APP_COLORS.surface,
    text: APP_COLORS.textPrimary,
    textSecondary: APP_COLORS.textSecondary,
    border: APP_COLORS.border,
    primary: APP_COLORS.primary,
  },
};
