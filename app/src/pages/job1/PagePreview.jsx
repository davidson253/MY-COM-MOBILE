import { useState } from "react";
import {
  FiPackage,
  FiUsers,
  FiShoppingCart,
  FiCreditCard,
} from "react-icons/fi";
import Articles from "./Articles";
import Clients from "./Clients";
import Commandes from "./Commandes";
import Reglements from "./Reglements";
import { Button } from "../../components/shared";
import "./styles/SharedPageStyles.css";

export default function PagePreview() {
  const [currentPage, setCurrentPage] = useState("articles");

  const pages = [
    {
      id: "articles",
      label: "Articles",
      icon: <FiPackage size={16} />,
      component: Articles,
    },
    {
      id: "clients",
      label: "Clients",
      icon: <FiUsers size={16} />,
      component: Clients,
    },
    {
      id: "commandes",
      label: "Commandes",
      icon: <FiShoppingCart size={16} />,
      component: Commandes,
    },
    {
      id: "reglements",
      label: "Règlements",
      icon: <FiCreditCard size={16} />,
      component: Reglements,
    },
  ];

  const CurrentPageComponent = pages.find(
    (p) => p.id === currentPage
  )?.component;

  return (
    <div style={{ minHeight: "100vh", background: "var(--theme-gradient)" }}>
      {/* Navigation des pages */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          background: "var(--color-bg-card)",
          borderBottom: "2px solid var(--color-border)",
          zIndex: 100,
          padding: "15px 30px",
          boxShadow: "var(--theme-shadow)",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            display: "flex",
            gap: "15px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <h2
            style={{
              margin: 0,
              marginRight: "30px",
              color: "var(--color-text-primary)",
              fontSize: "20px",
              fontWeight: "700",
            }}
          >
            🚀 Prévisualisation des Pages Modernisées
          </h2>
          {pages.map((page) => (
            <Button
              key={page.id}
              variant={currentPage === page.id ? "primary" : "secondary"}
              size="sm"
              icon={page.icon}
              onClick={() => setCurrentPage(page.id)}
            >
              {page.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Contenu de la page */}
      <div style={{ paddingTop: "100px" }}>
        {CurrentPageComponent && <CurrentPageComponent />}
      </div>
    </div>
  );
}
