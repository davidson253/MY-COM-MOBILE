import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./styles/themes.css";
import App from "./App.jsx";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";

// Gestion globale des erreurs pour supprimer les warnings AbortError
window.addEventListener("unhandledrejection", (event) => {
  // Supprimer les erreurs AbortError qui sont généralement causées par des extensions de navigateur
  if (event.reason && event.reason.name === "AbortError") {
    event.preventDefault();
    console.warn("AbortError interceptée et ignorée:", event.reason.message);
  }
});

// Supprimer également les erreurs audio/vidéo non critiques
window.addEventListener("error", (event) => {
  if (
    event.message &&
    event.message.includes("play()") &&
    event.message.includes("pause()")
  ) {
    event.preventDefault();
    console.warn("Erreur audio/vidéo interceptée et ignorée:", event.message);
  }
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);
