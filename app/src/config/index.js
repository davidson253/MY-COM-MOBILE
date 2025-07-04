/**
 * Configuration centralisée de l'application
 * Import et export de toutes les configurations
 */

// Import des configurations
import colors from "./colors.js";
import spacing from "./spacing.js";
import typography from "./typography.js";
import animations from "./animations.js";

// === CONFIGURATION GLOBALE ===
export const APP_CONFIG = {
  name: "COM MOBILE",
  version: "1.0.0",
  description: "Application de gestion commerciale",

  // URLs et endpoints
  api: {
    baseUrl: "http://localhost:5000",
    timeout: 10000,
  },

  // Configuration du localStorage
  storage: {
    prefix: "com-mobile-",
    keys: {
      theme: "theme",
      user: "user",
      token: "token",
      settings: "settings",
    },
  },

  // Configuration des tables
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 20, 50],
  },

  // Configuration des formulaires
  forms: {
    autoSave: true,
    autoSaveDelay: 2000,
    validation: {
      debounceDelay: 300,
    },
  },

  // Configuration des notifications
  notifications: {
    duration: 4000,
    maxVisible: 3,
    position: "top-right",
  },

  // Configuration des modals
  modals: {
    closeOnEscape: true,
    closeOnOverlayClick: true,
    showCloseButton: true,
  },
};

// === BREAKPOINTS RESPONSIFS ===
export const BREAKPOINTS = {
  xs: "475px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

// === MEDIA QUERIES ===
export const MEDIA_QUERIES = {
  xs: `@media (min-width: ${BREAKPOINTS.xs})`,
  sm: `@media (min-width: ${BREAKPOINTS.sm})`,
  md: `@media (min-width: ${BREAKPOINTS.md})`,
  lg: `@media (min-width: ${BREAKPOINTS.lg})`,
  xl: `@media (min-width: ${BREAKPOINTS.xl})`,
  "2xl": `@media (min-width: ${BREAKPOINTS["2xl"]})`,

  // Média queries utiles
  mobile: `@media (max-width: ${BREAKPOINTS.md})`,
  tablet: `@media (min-width: ${BREAKPOINTS.md}) and (max-width: ${BREAKPOINTS.lg})`,
  desktop: `@media (min-width: ${BREAKPOINTS.lg})`,

  // Préférences utilisateur
  prefersColorSchemeLight: "@media (prefers-color-scheme: light)",
  prefersColorSchemeDark: "@media (prefers-color-scheme: dark)",
  prefersReducedMotion: "@media (prefers-reduced-motion: reduce)",
  prefersHighContrast: "@media (prefers-contrast: high)",
};

// === EXPORT CENTRALISÉ ===
export { colors, spacing, typography, animations };

// Export par défaut avec toute la configuration
export default {
  APP_CONFIG,
  BREAKPOINTS,
  MEDIA_QUERIES,
  colors,
  spacing,
  typography,
  animations,
};
