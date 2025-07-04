import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const THEMES = {
  claire: {
    name: "Clair",
    id: "claire",
    primary: "#3b82f6",
    primaryHover: "#2563eb",
    icon: "☀️",
    description: "Thème clair et simple",
  },
  dark: {
    name: "Sombre",
    id: "dark",
    primary: "#60a5fa",
    primaryHover: "#3b82f6",
    icon: "🌙",
    description: "Thème sombre moderne",
  },
  nature: {
    name: "Nature",
    id: "nature",
    primary: "#16a34a",
    primaryHover: "#15803d",
    icon: "🌿",
    description: "Ambiance naturelle et apaisante",
  },
  creative: {
    name: "Créatif",
    id: "creative",
    primary: "#a855f7",
    primaryHover: "#9333ea",
    icon: "🎨",
    description: "Inspiration créative et artistique",
  },
  energetic: {
    name: "Énergétique",
    id: "energetic",
    primary: "#f97316",
    primaryHover: "#ea580c",
    icon: "⚡",
    description: "Dynamisme et énergie",
  },
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState("claire");

  // Charger le thème depuis localStorage au démarrage
  useEffect(() => {
    const savedTheme = localStorage.getItem("com-mobile-theme");
    if (savedTheme && THEMES[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  // Appliquer le thème au document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", currentTheme);
  }, [currentTheme]);

  const changeTheme = (themeId) => {
    if (THEMES[themeId]) {
      setCurrentTheme(themeId);
      localStorage.setItem("com-mobile-theme", themeId);
    }
  };

  const value = {
    currentTheme,
    theme: THEMES[currentTheme],
    themes: THEMES,
    changeTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export default ThemeContext;
