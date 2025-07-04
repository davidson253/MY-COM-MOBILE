import React, { useEffect, useState } from "react";
import "./styles/SharedPageStyles.css";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import api from "../services/api";

// Champs principaux de la table reglementw
const REGLEMENT_FIELDS = [
  { key: "numreg", label: "N° Règlement" },
  { key: "typereg", label: "Type règlement" },
  { key: "datereg", label: "Date règlement" },
  { key: "description", label: "Description" },
  { key: "numfact", label: "N° Facture" },
  { key: "datefact", label: "Date facture" },
  { key: "mtfact", label: "Montant facture" },
  { key: "taux", label: "Taux" },
  { key: "typepiece", label: "Type pièce" },
  { key: "numcheff", label: "N° chèque/effet" },
  { key: "dateech", label: "Date échéance" },
  { key: "codebanq", label: "Code banque" },
  { key: "banque", label: "Banque" },
  { key: "ville", label: "Ville" },
  { key: "signataire", label: "Signataire" },
  { key: "dateenc", label: "Date encaissement" },
  { key: "numbord", label: "N° bordereau" },
  { key: "codebanqbord", label: "Code banque bord." },
  { key: "banquebord", label: "Banque bord." },
  { key: "datevers", label: "Date versement" },
  { key: "codecli", label: "Code client" },
  { key: "rscli", label: "Raison sociale client" },
  { key: "rap", label: "RAP" },
  { key: "imp", label: "Impayé" },
  { key: "vers", label: "Versé" },
  { key: "enc", label: "Encaissé" },
  { key: "mtreg", label: "Montant règlement" },
  { key: "mtrestregF", label: "Reste règlement F" },
  { key: "mtrestregb", label: "Reste règlement B" },
  { key: "mtrestregbcc", label: "Reste règlement BCC" },
  { key: "recu", label: "Reçu" },
  { key: "codecaisse", label: "Code caisse" },
  { key: "libcaisse", label: "Libellé caisse" },
  { key: "codepv", label: "Code point vente" },
  { key: "libpv", label: "Libellé point vente" },
  { key: "typeret", label: "Type retour" },
  { key: "rapbl", label: "RAP BL" },
  { key: "rapbcc", label: "RAP BCC" },
  { key: "usera", label: "User création" },
  { key: "libusera", label: "Nom créateur" },
  { key: "userm", label: "User modif." },
  { key: "libuserm", label: "Nom modif." },
  { key: "users", label: "User supp." },
  { key: "libusers", label: "Nom supp." },
  { key: "datem", label: "Date modif." },
  { key: "coderep", label: "Code représentant" },
  { key: "librep", label: "Nom représentant" },
  { key: "libelleimp", label: "Libellé impayé" },
  { key: "integ", label: "Intégré" },
  { key: "numinteg", label: "N° intégration" },
  { key: "tmpinteg", label: "Tmp intégration" },
  { key: "versb", label: "Versé B" },
  { key: "import", label: "Importé" },
  { key: "transfert", label: "Transfert" },
  { key: "numpaiement", label: "N° paiement" },
  { key: "devise", label: "Devise" },
  { key: "mtfact2", label: "Montant facture 2" },
  { key: "taux2", label: "Taux 2" },
  { key: "numregimport", label: "N° règlement import" },
  { key: "cloture", label: "Clôture" },
  { key: "numclot", label: "N° clôture" },
  { key: "codereg", label: "Code région" },
  { key: "libreg", label: "Libellé région" },
  { key: "fraisb", label: "Frais B" },
];

const Reglements = () => {
  const [reglements, setReglements] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReglement, setSelectedReglement] = useState(null);

  useEffect(() => {
    loadReglements();
    // eslint-disable-next-line
  }, []);

  const loadReglements = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getReglements();
      setReglements(data);
    } catch (err) {
      setError("Erreur inattendue: " + err.message);
      setReglements(null);
    } finally {
      setLoading(false);
    }
  };

  // Suppression d'un règlement (soft delete)
  const handleDeleteReglement = async (numreg) => {
    if (!window.confirm("Confirmer la suppression de ce règlement ?")) return;
    setLoading(true);
    setError(null);
    try {
      await api.deleteReglement(numreg);
      await loadReglements();
      alert("Suppression effectuée avec succès.");
    } catch (err) {
      setError("Erreur suppression: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Restauration d'un règlement supprimé
  const handleRestoreReglement = async (numreg) => {
    if (!window.confirm("Restaurer ce règlement ?")) return;
    setLoading(true);
    setError(null);
    try {
      await api.restoreReglement(numreg);
      await loadReglements();
    } catch (err) {
      setError("Erreur restauration: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Colonnes pour affichage tableau simple (mapping SQL réel)
  const columns = [
    { key: "numreg", title: "N° Règlement" },
    { key: "datereg", title: "Date Règlement" },
    { key: "mtreg", title: "Montant" },
    { key: "typereg", title: "Type de Paiement" },
    { key: "codecli", title: "Code Client" },
    { key: "coderep", title: "Code Représentant" },
    { key: "actions", title: "Actions" },
  ];

  return (
    <div className="shared-page">
      <h1>Règlements</h1>
      <button onClick={loadReglements} style={{ marginBottom: 16, padding: 8 }}>
        🔄 Recharger
      </button>
      {loading && <div>Chargement...</div>}
      {error && (
        <div style={{ color: "red", marginBottom: 16 }}>
          <b>Erreur :</b> {error}
        </div>
      )}
      <div>
        <b>Liste des règlements :</b>
        <table className="shared-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(reglements) && reglements.length > 0 ? (
              reglements.map((row, idx) => (
                <tr key={idx} className={row.users ? "row-restorable" : ""}>
                  {columns.map((col) =>
                    col.key === "actions" ? (
                      <td key={col.key}>
                        <button
                          className={`action-btn view-btn ${
                            row.users ? "view-btn-restorable" : ""
                          }`}
                          onClick={() => setSelectedReglement(row)}
                          title="Voir les détails"
                        >
                          <FaEye style={{ verticalAlign: "middle" }} />
                        </button>

                        {row.users ? (
                          // Règlement supprimé : seul le bouton restaurer est disponible
                          <button
                            className="action-btn restore-btn"
                            onClick={() => handleRestoreReglement(row.numreg)}
                            title="Restaurer (vide les champs users/libusers)"
                          >
                            Restaurer
                          </button>
                        ) : (
                          // Règlement actif : boutons modifier et supprimer disponibles
                          <>
                            <button
                              className="action-btn edit-btn"
                              onClick={() =>
                                alert(`Modifier règlement ${row.numreg}`)
                              }
                              title="Modifier"
                            >
                              <FaEdit style={{ verticalAlign: "middle" }} />
                            </button>

                            <button
                              className="action-btn delete-btn"
                              onClick={() => handleDeleteReglement(row.numreg)}
                              title="Supprimer"
                            >
                              <FaTrash style={{ verticalAlign: "middle" }} />
                            </button>
                          </>
                        )}
                      </td>
                    ) : (
                      <td key={col.key}>
                        {col.key === "datereg"
                          ? row[col.key]
                            ? new Date(row[col.key]).toLocaleDateString()
                            : ""
                          : col.key === "mtreg"
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
                  Aucun règlement à afficher.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Modale d'affichage détaillé du règlement */}
      {selectedReglement && (
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
          onClick={() => setSelectedReglement(null)}
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
              onClick={() => setSelectedReglement(null)}
            >
              Fermer
            </button>
            <h2 style={{ marginTop: 0, marginBottom: 20 }}>
              Détails du règlement
            </h2>
            <table
              className="shared-table"
              style={{ width: "100%", borderCollapse: "collapse" }}
            >
              <tbody>
                {REGLEMENT_FIELDS.map((field) => (
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
                      {selectedReglement[field.key] || ""}
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

export default Reglements;
