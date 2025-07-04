import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Articles from "./pages/Articles";
import Commandes from "./pages/Commandes";
import ClientsV2 from "./pages/ClientsV2";
import Reglements from "./pages/Reglements";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import { NavbarProvider } from "./contexts/NavbarContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import "./styles/themes.css";
import "./App.css";
import ErrorBoundary from "./components/ErrorBoundary";

function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const userInfo = localStorage.getItem("userInfo");

      // Vérifier si le token existe et n'est pas expiré
      if (token && userInfo) {
        try {
          // Décoder le token pour vérifier l'expiration
          const payload = JSON.parse(atob(token.split(".")[1]));
          const currentTime = Date.now() / 1000;

          if (payload.exp > currentTime) {
            setIsAuthenticated(true);
            return;
          }
        } catch (error) {
          console.error("Erreur lors de la vérification du token:", error);
        }
      }

      // Token invalide ou expiré
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      setIsAuthenticated(false);
    };

    checkAuth();

    // Écouter les changements dans le localStorage
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);

    // Vérifier l'authentification périodiquement
    const interval = setInterval(checkAuth, 5000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Afficher un loader pendant la vérification
  if (isAuthenticated === null) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "var(--color-background)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            color: "var(--color-text-primary)",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "4px solid var(--color-border)",
              borderTop: "4px solid var(--color-primary)",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 10px",
            }}
          ></div>
          <p>Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? (
    <Layout>{children}</Layout>
  ) : (
    <Navigate to="/login" replace />
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <NavbarProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/preview" element={<Navigate to="/" />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/articles"
                element={
                  <ProtectedRoute>
                    <Articles />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/commandes"
                element={
                  <ProtectedRoute>
                    <Commandes />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/clients"
                element={
                  <ProtectedRoute>
                    <ClientsV2 />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reglements"
                element={
                  <ProtectedRoute>
                    <Reglements />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </NavbarProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
