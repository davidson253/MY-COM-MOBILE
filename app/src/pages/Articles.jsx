import React, { useEffect, useState } from "react";
import "./styles/SharedPageStyles.css";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import api from "../services/api";

// Liste complète des champs de la table article (voir SQL)
const ARTICLE_FIELDS = [
  { key: "code", label: "Code" },
  { key: "libelle", label: "Libellé" },
  { key: "famille", label: "Famille" },
  { key: "libellefam", label: "Sous-famille" },
  { key: "unite", label: "Unité" },
  { key: "nbunite", label: "Nb unité" },
  { key: "tva", label: "TVA" },
  { key: "type", label: "Type" },
  { key: "prixbrut", label: "Prix brut" },
  { key: "remise", label: "Remise" },
  { key: "prixnet", label: "Prix net" },
  { key: "marge", label: "Marge" },
  { key: "prixht", label: "Prix HT" },
  { key: "prixttc", label: "Prix TTC" },
  { key: "prixht1", label: "Prix HT 1" },
  { key: "prixttc1", label: "Prix TTC 1" },
  { key: "defalcation", label: "Défalcation" },
  { key: "gconf", label: "GConf" },
  { key: "dc", label: "DC" },
  { key: "fodec", label: "FODEC" },
  { key: "affcaisse", label: "Aff. caisse" },
  { key: "serie", label: "Série" },
  { key: "libellear", label: "Libellé AR" },
  { key: "codecat", label: "Code catégorie" },
  { key: "libcat", label: "Libellé catégorie" },
  { key: "codefourn", label: "Code fournisseur" },
  { key: "libfourn", label: "Fournisseur" },
  { key: "nature", label: "Nature" },
  { key: "prixmin", label: "Prix min" },
  { key: "prixmax", label: "Prix max" },
  { key: "usera", label: "User création" },
  { key: "libusera", label: "Nom créateur" },
  { key: "userm", label: "User modif." },
  { key: "libuserm", label: "Nom modif." },
  { key: "users", label: "User supp." },
  { key: "libusers", label: "Nom supp." },
  { key: "datem", label: "Date modif." },
  { key: "timem", label: "Heure modif." },
  { key: "prixachinit", label: "Prix achat init." },
  { key: "tvaach", label: "TVA achat" },
  { key: "artdim", label: "ArtDim" },
  { key: "cemp", label: "Code emp." },
  { key: "libemp", label: "Libellé emp." },
  { key: "balance", label: "Balance" },
  { key: "inactif", label: "Inactif" },
  { key: "datecreation", label: "Date création" },
  { key: "prixbrut1", label: "Prix brut 1" },
  { key: "remise1", label: "Remise 1" },
  { key: "enstock", label: "En stock" },
  { key: "codebarre", label: "Code barre" },
  { key: "longueur", label: "Longueur" },
  { key: "largeur", label: "Largeur" },
  { key: "hauteur", label: "Hauteur" },
  { key: "qtemin", label: "Qté min" },
  { key: "qtemax", label: "Qté max" },
  { key: "nbuniteim", label: "Nb unité im" },
  { key: "ttcach", label: "TTC achat" },
  { key: "basetva", label: "Base TVA" },
  { key: "mttva", label: "Montant TVA" },
  { key: "autretaxe", label: "Autre taxe" },
  { key: "smtva", label: "SM TVA" },
  { key: "remisev", label: "Remise vente" },
  { key: "tva2", label: "TVA 2" },
  { key: "fodeca", label: "FODEC A" },
  { key: "cheminimg", label: "Chemin image" },
  { key: "mvtart", label: "Mvt art" },
  { key: "codenuance", label: "Code nuance" },
  { key: "libnuance", label: "Libellé nuance" },
  { key: "nbjour", label: "Nb jours" },
  { key: "codemar", label: "Code marque" },
  { key: "libmar", label: "Marque" },
  { key: "codech", label: "Code chaîne" },
  { key: "libch", label: "Libellé chaîne" },
  { key: "codecli", label: "Code client" },
  { key: "libcli", label: "Libellé client" },
  { key: "coderef", label: "Code réf." },
  { key: "libref", label: "Libellé réf." },
  { key: "poids", label: "Poids" },
  { key: "dechet", label: "Déchet" },
  { key: "codedomaine", label: "Code domaine" },
  { key: "libdomaine", label: "Libellé domaine" },
  { key: "movre", label: "Mouv. ré" },
  { key: "formeart", label: "Forme art" },
  { key: "codefinit", label: "Code finition" },
  { key: "libfinit", label: "Libellé finition" },
  { key: "libdet", label: "Libellé détail" },
];

const Articles = () => {
  const [articles, setArticles] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    loadArticles();
    // eslint-disable-next-line
  }, []);

  const loadArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getArticles();
      setArticles(data);
    } catch (err) {
      setError("Erreur inattendue: " + err.message);
      setArticles(null);
    } finally {
      setLoading(false);
    }
  };

  // Suppression d'un article (soft delete)
  const handleDeleteArticle = async (code) => {
    if (!window.confirm("Confirmer la suppression de cet article ?")) return;
    setLoading(true);
    setError(null);
    try {
      await api.deleteArticle(code);
      await loadArticles();
      alert("Suppression effectuée avec succès.");
    } catch (err) {
      setError("Erreur suppression: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Restauration d'un article supprimé
  const handleRestoreArticle = async (code) => {
    if (!window.confirm("Restaurer cet article ?")) return;
    setLoading(true);
    setError(null);
    try {
      await api.restoreArticle(code);
      await loadArticles();
    } catch (err) {
      setError("Erreur restauration: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Colonnes pour affichage tableau simple
  const columns = [
    { key: "code", title: "Code" },
    { key: "libelle", title: "Libellé" },
    { key: "famille", title: "Famille" },
    { key: "libellefam", title: "Sous-famille" },
    { key: "libmar", title: "Marque" },
    { key: "prixttc", title: "Prix TTC" },
    { key: "qtemax", title: "Stock" },
    { key: "actions", title: "Actions" },
  ];

  return (
    <div className="shared-page">
      <h1>Articles</h1>
      <button onClick={loadArticles} style={{ marginBottom: 16, padding: 8 }}>
        🔄 Recharger
      </button>
      {loading && <div>Chargement...</div>}
      {error && (
        <div style={{ color: "red", marginBottom: 16 }}>
          <b>Erreur :</b> {error}
        </div>
      )}
      <div>
        <b>Liste des articles :</b>
        <table className="shared-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(articles) && articles.length > 0 ? (
              articles.map((row, idx) => (
                <tr key={idx} className={row.users ? "row-restorable" : ""}>
                  {columns.map((col) =>
                    col.key === "actions" ? (
                      <td key={col.key}>
                        <button
                          className={`action-btn view-btn ${
                            row.users ? "view-btn-restorable" : ""
                          }`}
                          onClick={() => setSelectedArticle(row)}
                          title="Voir les détails"
                        >
                          <FaEye style={{ verticalAlign: "middle" }} />
                        </button>

                        {row.users ? (
                          // Article supprimé : seul le bouton restaurer est disponible
                          <button
                            className="action-btn restore-btn"
                            onClick={() => handleRestoreArticle(row.code)}
                            title="Restaurer (vide les champs users/libusers)"
                          >
                            Restaurer
                          </button>
                        ) : (
                          // Article actif : boutons modifier et supprimer disponibles
                          <>
                            <button
                              className="action-btn edit-btn"
                              onClick={() =>
                                alert(`Modifier article ${row.code}`)
                              }
                              title="Modifier"
                            >
                              <FaEdit style={{ verticalAlign: "middle" }} />
                            </button>

                            <button
                              className="action-btn delete-btn"
                              onClick={() => handleDeleteArticle(row.code)}
                              title="Supprimer"
                            >
                              <FaTrash style={{ verticalAlign: "middle" }} />
                            </button>
                          </>
                        )}
                      </td>
                    ) : (
                      <td key={col.key}>
                        {col.key === "prixttc"
                          ? row[col.key] !== undefined && row[col.key] !== null
                            ? parseFloat(row[col.key]).toFixed(2) + " DT"
                            : ""
                          : col.key === "actif"
                          ? row[col.key]
                            ? "Actif"
                            : "Inactif"
                          : row[col.key] || ""}
                      </td>
                    )
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: "center" }}>
                  Aucun article à afficher.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Modale d'affichage détaillé de l'article */}
      {selectedArticle && (
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
          onClick={() => setSelectedArticle(null)}
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
              onClick={() => setSelectedArticle(null)}
            >
              Fermer
            </button>
            <h2 style={{ marginTop: 0, marginBottom: 20 }}>
              Détails de l'article
            </h2>
            <table
              className="shared-table"
              style={{ width: "100%", borderCollapse: "collapse" }}
            >
              <tbody>
                {ARTICLE_FIELDS.map((field) => (
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
                      {selectedArticle[field.key] || ""}
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

export default Articles;
