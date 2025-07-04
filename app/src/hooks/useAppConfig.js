/**
 * Hook personnalisé pour accéder facilement aux variables de configuration
 * Combine les variables CSS avec la configuration JavaScript
 */

import { useTheme } from "../contexts/ThemeContext";
import config from "../config";

export const useAppConfig = () => {
  const { theme } = useTheme();

  // Fonction pour obtenir une variable CSS
  const getCSSVariable = (variableName) => {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(`--${variableName}`)
      .trim();
  };

  // Fonction pour définir une variable CSS
  const setCSSVariable = (variableName, value) => {
    document.documentElement.style.setProperty(`--${variableName}`, value);
  };

  // Variables de thème actuelles
  const currentTheme =
    config.colors.THEME_COLORS[theme] || config.colors.THEME_COLORS.light;

  // Styles prédéfinis pour les composants courants
  const componentStyles = {
    button: {
      primary: {
        backgroundColor: "var(--color-primary)",
        color: "var(--text-inverse)",
        border: "none",
        borderRadius: "var(--radius-md)",
        padding: "var(--spacing-md) var(--spacing-lg)",
        fontSize: "var(--font-size-sm)",
        fontWeight: "var(--font-weight-medium)",
        cursor: "pointer",
        transition: "var(--transition-fast)",
      },

      secondary: {
        backgroundColor: "var(--color-secondary)",
        color: "var(--text-inverse)",
        border: "none",
        borderRadius: "var(--radius-md)",
        padding: "var(--spacing-md) var(--spacing-lg)",
        fontSize: "var(--font-size-sm)",
        fontWeight: "var(--font-weight-medium)",
        cursor: "pointer",
        transition: "var(--transition-fast)",
      },

      success: {
        backgroundColor: "var(--color-success)",
        color: "var(--text-inverse)",
        border: "none",
        borderRadius: "var(--radius-md)",
        padding: "var(--spacing-md) var(--spacing-lg)",
        fontSize: "var(--font-size-sm)",
        fontWeight: "var(--font-weight-medium)",
        cursor: "pointer",
        transition: "var(--transition-fast)",
      },

      danger: {
        backgroundColor: "var(--color-danger)",
        color: "var(--text-inverse)",
        border: "none",
        borderRadius: "var(--radius-md)",
        padding: "var(--spacing-md) var(--spacing-lg)",
        fontSize: "var(--font-size-sm)",
        fontWeight: "var(--font-weight-medium)",
        cursor: "pointer",
        transition: "var(--transition-fast)",
      },
    },

    card: {
      default: {
        backgroundColor: "var(--bg-primary)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--spacing-xl)",
        boxShadow: "var(--shadow-md)",
        border: "1px solid var(--border-light)",
        transition: "var(--transition-normal)",
      },
    },

    input: {
      default: {
        width: "100%",
        padding: "var(--spacing-md)",
        border: "2px solid var(--border-light)",
        borderRadius: "var(--radius-md)",
        fontSize: "var(--font-size-sm)",
        fontWeight: "var(--font-weight-medium)",
        transition: "var(--transition-fast)",
        backgroundColor: "var(--bg-primary)",
        color: "var(--theme-text)",
      },
    },

    modal: {
      overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: "var(--z-modal-backdrop)",
      },

      content: {
        backgroundColor: "var(--bg-primary)",
        borderRadius: "var(--radius-xl)",
        padding: "var(--spacing-xl)",
        maxWidth: "800px",
        width: "90%",
        maxHeight: "80vh",
        overflow: "auto",
        boxShadow: "var(--shadow-xl)",
        zIndex: "var(--z-modal)",
      },
    },
  };

  // Fonction utilitaire pour appliquer des styles hover
  const applyHoverEffect = (element, hoverStyles) => {
    if (!element) return;

    const originalStyles = {};

    // Sauvegarder les styles originaux
    Object.keys(hoverStyles).forEach((property) => {
      originalStyles[property] = element.style[property];
    });

    // Appliquer les styles de hover
    const handleMouseEnter = () => {
      Object.entries(hoverStyles).forEach(([property, value]) => {
        element.style[property] = value;
      });
    };

    // Restaurer les styles originaux
    const handleMouseLeave = () => {
      Object.entries(originalStyles).forEach(([property, value]) => {
        element.style[property] = value;
      });
    };

    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);

    // Retourner une fonction de nettoyage
    return () => {
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  };

  return {
    // Configuration complète
    config,

    // Thème actuel
    theme,
    currentTheme,

    // Utilitaires CSS
    getCSSVariable,
    setCSSVariable,

    // Styles prédéfinis
    componentStyles,

    // Utilitaires
    applyHoverEffect,

    // Raccourcis vers les configurations les plus utilisées
    colors: config.colors,
    spacing: config.spacing,
    typography: config.typography,
    animations: config.animations,
  };
};

export default useAppConfig;
