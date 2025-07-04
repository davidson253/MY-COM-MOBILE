/**
 * Configuration centralisée des animations et transitions
 * Durées, fonctions d'accélération et animations prédéfinies
 */

// === DURÉES D'ANIMATION ===
export const DURATION = {
  fastest: "100ms",
  fast: "200ms",
  normal: "300ms",
  slow: "500ms",
  slowest: "800ms",
};

// === FONCTIONS D'ACCÉLÉRATION ===
export const EASING = {
  linear: "linear",
  easeIn: "cubic-bezier(0.4, 0, 1, 1)",
  easeOut: "cubic-bezier(0, 0, 0.2, 1)",
  easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  spring: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
};

// === TRANSITIONS PRÉDÉFINIES ===
export const TRANSITIONS = {
  all: `all ${DURATION.normal} ${EASING.easeInOut}`,
  transform: `transform ${DURATION.normal} ${EASING.easeInOut}`,
  opacity: `opacity ${DURATION.fast} ${EASING.easeInOut}`,
  colors: `background-color ${DURATION.normal} ${EASING.easeInOut}, border-color ${DURATION.normal} ${EASING.easeInOut}, color ${DURATION.normal} ${EASING.easeInOut}`,
  shadow: `box-shadow ${DURATION.normal} ${EASING.easeInOut}`,
  height: `height ${DURATION.slow} ${EASING.easeInOut}`,
  width: `width ${DURATION.slow} ${EASING.easeInOut}`,
};

// === ANIMATIONS KEYFRAMES ===
export const KEYFRAMES = {
  fadeIn: `
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `,

  fadeOut: `
    @keyframes fadeOut {
      from {
        opacity: 1;
        transform: translateY(0);
      }
      to {
        opacity: 0;
        transform: translateY(-10px);
      }
    }
  `,

  slideIn: `
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `,

  slideOut: `
    @keyframes slideOut {
      from {
        opacity: 1;
        transform: translateX(0);
      }
      to {
        opacity: 0;
        transform: translateX(20px);
      }
    }
  `,

  scaleIn: `
    @keyframes scaleIn {
      from {
        opacity: 0;
        transform: scale(0.9);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
  `,

  pulse: `
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }
  `,

  bounce: `
    @keyframes bounce {
      0%, 20%, 53%, 80%, 100% {
        animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
        transform: translate3d(0, 0, 0);
      }
      40%, 43% {
        animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
        transform: translate3d(0, -10px, 0);
      }
      70% {
        animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
        transform: translate3d(0, -5px, 0);
      }
      90% {
        transform: translate3d(0, -2px, 0);
      }
    }
  `,

  spin: `
    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `,

  shimmer: `
    @keyframes shimmer {
      0% {
        background-position: -200px 0;
      }
      100% {
        background-position: calc(200px + 100%) 0;
      }
    }
  `,
};

// === ANIMATIONS PRÉDÉFINIES ===
export const ANIMATIONS = {
  fadeIn: `fadeIn ${DURATION.normal} ${EASING.easeOut}`,
  fadeOut: `fadeOut ${DURATION.normal} ${EASING.easeIn}`,
  slideIn: `slideIn ${DURATION.normal} ${EASING.easeOut}`,
  slideOut: `slideOut ${DURATION.normal} ${EASING.easeIn}`,
  scaleIn: `scaleIn ${DURATION.fast} ${EASING.bounce}`,
  pulse: `pulse ${DURATION.slowest} ${EASING.easeInOut} infinite`,
  bounce: `bounce ${DURATION.slowest} ${EASING.linear}`,
  spin: `spin 1s ${EASING.linear} infinite`,
  shimmer: `shimmer 2s ${EASING.linear} infinite`,
};

// === STYLES HOVER PRÉDÉFINIS ===
export const HOVER_EFFECTS = {
  lift: {
    transition: TRANSITIONS.transform,
    ":hover": {
      transform: "translateY(-2px)",
    },
  },

  scale: {
    transition: TRANSITIONS.transform,
    ":hover": {
      transform: "scale(1.05)",
    },
  },

  glow: {
    transition: TRANSITIONS.shadow,
    ":hover": {
      boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)",
    },
  },

  fade: {
    transition: TRANSITIONS.opacity,
    ":hover": {
      opacity: 0.8,
    },
  },
};

// === BREAKPOINTS POUR ANIMATIONS RESPONSIVES ===
export const MOTION_BREAKPOINTS = {
  mobile: "@media (max-width: 768px)",
  tablet: "@media (min-width: 769px) and (max-width: 1024px)",
  desktop: "@media (min-width: 1025px)",
  prefersReducedMotion: "@media (prefers-reduced-motion: reduce)",
};

// === FONCTION UTILITAIRE POUR ANIMATIONS CONDITIONNELLES ===
export const createAnimation = (
  name,
  duration = DURATION.normal,
  easing = EASING.easeInOut,
  iterations = 1
) => {
  return `${name} ${duration} ${easing} ${
    iterations === "infinite" ? "infinite" : iterations
  }`;
};

export default {
  DURATION,
  EASING,
  TRANSITIONS,
  KEYFRAMES,
  ANIMATIONS,
  HOVER_EFFECTS,
  MOTION_BREAKPOINTS,
  createAnimation,
};
