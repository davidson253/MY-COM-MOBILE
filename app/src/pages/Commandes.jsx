import React, { useEffect, useState } from "react";
import "./styles/SharedPageStyles.css";
import { FaEye, FaEdit, FaTrash, FaPrint, FaFileAlt } from "react-icons/fa";
import api from "../services/api";
import useTicketPrint from "../hooks/useTicketPrint";
import useBandeCommande from "../hooks/useBandeCommande";

// Champs principaux de la table ebcw (commande)
const COMMANDE_FIELDS = [
  { key: "numbc", label: "N° Commande" },
  { key: "datebc", label: "Date commande" },
  { key: "numfactf", label: "N° Facture fournisseur" },
  { key: "facture", label: "Facture" },
  { key: "typef", label: "Type facture" },
  { key: "refbcc", label: "Réf. BC" },
  { key: "ccl", label: "CCL" },
  { key: "rsocf", label: "Client" },
  { key: "adresf", label: "Adresse client" },
  { key: "matricule", label: "Matricule" },
  { key: "commentaire", label: "Commentaire" },
  { key: "tel", label: "Téléphone" },
  { key: "fax", label: "Fax" },
  { key: "mht", label: "Montant HT" },
  { key: "mnht", label: "Montant NHT" },
  { key: "remise", label: "Remise" },
  { key: "mttc", label: "Montant TTC" },
  { key: "mpayer", label: "Montant à payer" },
  { key: "mfodec", label: "FODEC" },
  { key: "taxe", label: "Taxe" },
  { key: "bfodec", label: "Base FODEC" },
  { key: "base1", label: "Base 1" },
  { key: "base2", label: "Base 2" },
  { key: "base3", label: "Base 3" },
  { key: "base4", label: "Base 4" },
  { key: "tva1", label: "TVA 1" },
  { key: "tva2", label: "TVA 2" },
  { key: "tva3", label: "TVA 3" },
  { key: "tva4", label: "TVA 4" },
  { key: "mtva", label: "Montant TVA" },
  { key: "mt_lettre", label: "Montant en lettres" },
  { key: "susp", label: "Suspension" },
  { key: "exo", label: "Exonération" },
  { key: "export", label: "Export" },
  { key: "decision", label: "Décision" },
  { key: "tvadue", label: "TVA due" },
  { key: "tvasidue", label: "TVA sidue" },
  { key: "mtr", label: "MTR" },
  { key: "regime", label: "Régime" },
  { key: "baseavance", label: "Base avance" },
  { key: "mavance", label: "Montant avance" },
  { key: "coderep", label: "Code représentant" },
  { key: "librep", label: "Nom représentant" },
  { key: "usera", label: "User création" },
  { key: "libusera", label: "Nom créateur" },
  { key: "userm", label: "User modif." },
  { key: "libuserm", label: "Nom modif." },
  { key: "users", label: "User supp." },
  { key: "libusers", label: "Nom supp." },
  { key: "datem", label: "Date modif." },
  { key: "timem", label: "Heure modif." },
  { key: "commentaire1", label: "Commentaire 1" },
  { key: "generer", label: "Générer" },
  { key: "cloture", label: "Clôture" },
  { key: "accompte", label: "Accompte" },
  { key: "dateblp", label: "Date BLP" },
  { key: "devise", label: "Devise" },
  { key: "description", label: "Description" },
  { key: "commentaire3", label: "Commentaire 3" },
  { key: "modepaiement", label: "Mode paiement" },
  { key: "elaborer", label: "Élaboré par" },
  { key: "perdliv", label: "Livraison prévue" },
  { key: "numdv", label: "N° DV" },
];

const Commandes = () => {
  const [commandes, setCommandes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCommande, setSelectedCommande] = useState(null);
  const { printTicket } = useTicketPrint();
  const { printBandeCommande } = useBandeCommande();

  useEffect(() => {
    loadCommandes();
    // eslint-disable-next-line
  }, []);

  const loadCommandes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getCommandes();
      setCommandes(data);
    } catch (err) {
      setError("Erreur inattendue: " + err.message);
      setCommandes(null);
    } finally {
      setLoading(false);
    }
  };

  // Suppression d'une commande (soft delete)
  const handleDeleteCommande = async (numbc) => {
    if (!window.confirm("Confirmer la suppression de cette commande ?")) return;
    setLoading(true);
    setError(null);
    try {
      await api.deleteCommande(numbc);
      await loadCommandes();
      alert("Suppression effectuée avec succès.");
    } catch (err) {
      setError("Erreur suppression: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Restauration d'une commande supprimée
  const handleRestoreCommande = async (numbc) => {
    if (!window.confirm("Restaurer cette commande ?")) return;
    setLoading(true);
    setError(null);
    try {
      await api.restoreCommande(numbc);
      await loadCommandes();
    } catch (err) {
      setError("Erreur restauration: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Impression du ticket de commande
  const handlePrintTicket = async (commande) => {
    try {
      await printTicket(commande);
    } catch (err) {
      alert("Erreur lors de l'impression: " + err.message);
    }
  };

  // Impression de la bande de commande
  const handlePrintBande = async (commande) => {
    try {
      await printBandeCommande(commande);
    } catch (err) {
      alert("Erreur lors de l'impression de la bande: " + err.message);
    }
  };

  // Colonnes pour affichage tableau simple
  const columns = [
    { key: "numbc", title: "N° Commande" },
    { key: "datebc", title: "Date Commande" },
    { key: "mht", title: "Montant HT" },
    { key: "mttc", title: "Montant TTC" },
    { key: "mtva", title: "TVA" },
    { key: "coderep", title: "Code Représentant" },
    { key: "actions", title: "Actions" },
  ];

  return (
    <div className="shared-page">
      <h1>Commandes</h1>

      <button onClick={loadCommandes} style={{ marginBottom: 16, padding: 8 }}>
        🔄 Recharger
      </button>
      {loading && <div>Chargement...</div>}
      {error && (
        <div style={{ color: "red", marginBottom: 16 }}>
          <b>Erreur :</b> {error}
        </div>
      )}
      <div>
        <b>Liste des commandes :</b>
        <table className="shared-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(commandes) && commandes.length > 0 ? (
              commandes.map((row, idx) => (
                <tr key={idx} className={row.users ? "row-restorable" : ""}>
                  {columns.map((col) =>
                    col.key === "actions" ? (
                      <td key={col.key}>
                        <button
                          className={`action-btn view-btn ${
                            row.users ? "view-btn-restorable" : ""
                          }`}
                          onClick={() => setSelectedCommande(row)}
                          title="Voir les détails"
                        >
                          <FaEye style={{ verticalAlign: "middle" }} />
                        </button>

                        {row.users ? (
                          // Commande supprimée : seul le bouton restaurer est disponible
                          <button
                            className="action-btn restore-btn"
                            onClick={() => handleRestoreCommande(row.numbc)}
                            title="Restaurer (vide les champs users/libusers)"
                          >
                            Restaurer
                          </button>
                        ) : (
                          // Commande active : boutons disponibles
                          <>
                            <button
                              className="action-btn print-btn"
                              onClick={() => handlePrintTicket(row)}
                              title="Imprimer ticket"
                              style={{
                                backgroundColor: "#28a745",
                                color: "white",
                              }}
                            >
                              <FaPrint style={{ verticalAlign: "middle" }} />
                            </button>

                            <button
                              className="action-btn print-btn"
                              onClick={() => handlePrintBande(row)}
                              title="Imprimer bande de commande"
                              style={{
                                backgroundColor: "#17a2b8",
                                color: "white",
                              }}
                            >
                              <FaFileAlt style={{ verticalAlign: "middle" }} />
                            </button>

                            <button
                              className="action-btn edit-btn"
                              onClick={() =>
                                alert(`Modifier commande ${row.numbc}`)
                              }
                              title="Modifier"
                            >
                              <FaEdit style={{ verticalAlign: "middle" }} />
                            </button>

                            <button
                              className="action-btn delete-btn"
                              onClick={() => handleDeleteCommande(row.numbc)}
                              title="Supprimer"
                            >
                              <FaTrash style={{ verticalAlign: "middle" }} />
                            </button>
                          </>
                        )}
                      </td>
                    ) : (
                      <td key={col.key}>
                        {col.key === "datebc"
                          ? row[col.key]
                            ? new Date(row[col.key]).toLocaleDateString()
                            : ""
                          : ["mht", "mttc", "mtva"].includes(col.key)
                          ? row[col.key] !== undefined && row[col.key] !== null
                            ? parseFloat(row[col.key]).toFixed(2) + " DT"
                            : ""
                          : row[col.key] || ""}
                      </td>
                    )
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: "center" }}>
                  Aucune commande à afficher.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Modale d'affichage détaillé de la commande */}
      {selectedCommande && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.4)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setSelectedCommande(null)}
        >
          <div
            className="modal-content shared-modal"
            style={{
              minWidth: 350,
              maxWidth: 600,
              maxHeight: "80vh",
              overflowY: "auto",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="action-btn modal-close-btn"
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                minWidth: 80,
              }}
              onClick={() => setSelectedCommande(null)}
            >
              Fermer
            </button>
            <h2 style={{ marginTop: 0, marginBottom: 20 }}>
              Détails de la commande
            </h2>
            <table
              className="shared-table"
              style={{ width: "100%", borderCollapse: "collapse" }}
            >
              <tbody>
                {COMMANDE_FIELDS.map((field) => (
                  <tr key={field.key}>
                    <td
                      style={{
                        fontWeight: "bold",
                        padding: "4px 8px",
                        borderBottom: "1px solid #eee",
                        width: 180,
                      }}
                    >
                      {field.label}
                    </td>
                    <td
                      style={{
                        padding: "4px 8px",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      {selectedCommande[field.key] || ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Commandes;
