import React from "react";
import ClientsV2 from "./ClientsV2";
import { ErrorBoundary } from "../components/ErrorBoundary";

// Composant de test pour la nouvelle page clients avec Formik
const ClientsTestPage = () => {
  return (
    <ErrorBoundary>
      <div
        style={{
          minHeight: "100vh",
          background: "var(--page-theme-bg, #f8f9fa)",
          padding: "20px 0",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "0 20px",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              marginBottom: "20px",
            }}
          >
            <h2
              style={{
                margin: "0 0 16px 0",
                color: "#007bff",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              🧪 Test - Nouvelle Page Clients avec Formik
            </h2>
            <p
              style={{
                margin: "0",
                color: "#6c757d",
                fontSize: "14px",
              }}
            >
              Cette page utilise le nouveau UniversalFormV2 avec Formik pour la
              gestion des formulaires.
              <br />
              <strong>Fonctionnalités testées :</strong> Validation Yup, Drawer
              moderne, groupes de champs, responsivité.
            </p>
          </div>

          <ClientsV2 />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ClientsTestPage;
