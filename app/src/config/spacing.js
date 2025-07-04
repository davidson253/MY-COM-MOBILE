/**
 * Configuration des espaces et dimensions
 * Système cohérent basé sur une échelle de 4px
 */

// === ESPACEMENTS ===
export const SPACING = {
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  "2xl": "48px",
  "3xl": "64px",
  "4xl": "96px",
};

// === RAYONS DE BORDURE ===
export const BORDER_RADIUS = {
  none: "0",
  sm: "4px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  "2xl": "24px",
  full: "50%",
};

// === LARGEURS DE BORDURE ===
export const BORDER_WIDTH = {
  none: "0",
  thin: "1px",
  medium: "2px",
  thick: "4px",
};

// === TAILLES ===
export const SIZES = {
  // Icônes
  icon: {
    xs: "12px",
    sm: "16px",
    md: "20px",
    lg: "24px",
    xl: "32px",
  },

  // Boutons
  button: {
    sm: { height: "32px", padding: "6px 12px" },
    md: { height: "40px", padding: "8px 16px" },
    lg: { height: "48px", padding: "12px 24px" },
  },

  // Inputs
  input: {
    sm: { height: "32px", padding: "6px 12px" },
    md: { height: "40px", padding: "8px 16px" },
    lg: { height: "48px", padding: "12px 16px" },
  },

  // Conteneurs
  container: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
};

// === Z-INDEX ===
export const Z_INDEX = {
  behind: -1,
  base: 0,
  dropdown: 100,
  sticky: 200,
  fixed: 300,
  modalBackdrop: 400,
  modal: 500,
  popover: 600,
  tooltip: 700,
  toast: 800,
  navbar: 1000,
  max: 9999,
};

export default {
  SPACING,
  BORDER_RADIUS,
  BORDER_WIDTH,
  SIZES,
  Z_INDEX,
};
