/**
 * Configuration de la typographie
 * Tailles, poids et familles de police standardisés
 */

// === FAMILLES DE POLICE ===
export const FONT_FAMILY = {
  sans: [
    "Inter",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Helvetica Neue",
    "Arial",
    "sans-serif",
  ].join(", "),

  serif: ["Georgia", "Cambria", "Times New Roman", "Times", "serif"].join(", "),

  mono: [
    "SFMono-Regular",
    "Monaco",
    "Consolas",
    "Liberation Mono",
    "Courier New",
    "monospace",
  ].join(", "),
};

// === TAILLES DE POLICE ===
export const FONT_SIZE = {
  xs: "12px",
  sm: "14px",
  base: "16px",
  lg: "18px",
  xl: "20px",
  "2xl": "24px",
  "3xl": "30px",
  "4xl": "36px",
  "5xl": "48px",
  "6xl": "64px",
};

// === POIDS DE POLICE ===
export const FONT_WEIGHT = {
  thin: 100,
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
};

// === HAUTEUR DE LIGNE ===
export const LINE_HEIGHT = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
};

// === ESPACEMENT DES LETTRES ===
export const LETTER_SPACING = {
  tighter: "-0.05em",
  tight: "-0.025em",
  normal: "0",
  wide: "0.025em",
  wider: "0.05em",
  widest: "0.1em",
};

// === STYLES DE TEXTE PRÉDÉFINIS ===
export const TEXT_STYLES = {
  // Titres
  h1: {
    fontSize: FONT_SIZE["4xl"],
    fontWeight: FONT_WEIGHT.bold,
    lineHeight: LINE_HEIGHT.tight,
    letterSpacing: LETTER_SPACING.tight,
  },

  h2: {
    fontSize: FONT_SIZE["3xl"],
    fontWeight: FONT_WEIGHT.bold,
    lineHeight: LINE_HEIGHT.tight,
    letterSpacing: LETTER_SPACING.tight,
  },

  h3: {
    fontSize: FONT_SIZE["2xl"],
    fontWeight: FONT_WEIGHT.semibold,
    lineHeight: LINE_HEIGHT.snug,
  },

  h4: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.semibold,
    lineHeight: LINE_HEIGHT.snug,
  },

  h5: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
    lineHeight: LINE_HEIGHT.normal,
  },

  h6: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.semibold,
    lineHeight: LINE_HEIGHT.normal,
  },

  // Paragraphes
  body: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.normal,
    lineHeight: LINE_HEIGHT.relaxed,
  },

  bodySmall: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.normal,
    lineHeight: LINE_HEIGHT.normal,
  },

  // Éléments spéciaux
  caption: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.normal,
    lineHeight: LINE_HEIGHT.normal,
    letterSpacing: LETTER_SPACING.wide,
  },

  button: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
    lineHeight: LINE_HEIGHT.none,
    letterSpacing: LETTER_SPACING.wide,
  },

  link: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.medium,
    lineHeight: LINE_HEIGHT.normal,
    textDecoration: "underline",
  },

  code: {
    fontFamily: FONT_FAMILY.mono,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
    lineHeight: LINE_HEIGHT.normal,
  },
};

export default {
  FONT_FAMILY,
  FONT_SIZE,
  FONT_WEIGHT,
  LINE_HEIGHT,
  LETTER_SPACING,
  TEXT_STYLES,
};
