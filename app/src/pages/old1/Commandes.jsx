import { useEffect, useState } from "react";
import api from "../../services/api";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiShoppingCart,
  FiUser,
  FiCalendar,
  FiEye,
  FiX,
  FiPackage,
  FiSave,
} from "react-icons/fi";
import DTIcon from "../../components/DTIcon";
import StatusIndicator from "../../components/StatusIndicator";
import { useStatusManager } from "../../hooks/useStatusManager";
import "./styles/Common.css";
import "./styles/Commandes.css";

export default function Commandes() {
  const [commandes, setCommandes] = useState([]);
  const [clients, setClients] = useState([]);
  const [articles, setArticles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [details, setDetails] = useState(null);
  const [editCommande, setEditCommande] = useState(null);
  const [editingLigne, setEditingLigne] = useState(null);
  const [editingPrix, setEditingPrix] = useState(null);
  const [tempQte, setTempQte] = useState("");
  const [tempPrix, setTempPrix] = useState("");
  const [ligne, setLigne] = useState({ codeart: "", qte: "", prix: "" });

  // Utiliser le hook de gestion des statuts
  const {
    editingId,
    viewingId,
    startEditing,
    stopEditing,
    startViewing,
    stopViewing,
    resetAllStatus,
    isEditing,
    isViewing,
    getRowClass,
  } = useStatusManager();

  useEffect(() => {
    api.getCommandes().then(setCommandes);
    api.getClients().then(setClients);
    api.getArticles().then(setArticles);
  }, []);

  // Validation du prix avec règles métier
  const validatePrice = (newPrice, articlePrixBrut) => {
    const price = parseFloat(newPrice);
    const basePrix = parseFloat(articlePrixBrut);

    if (isNaN(price) || price < 0) {
      return { valid: false, error: "Le prix doit être un nombre positif" };
    }

    const minPrice = 0;
    const maxPrice = basePrix * 2; // Maximum 200% du prix de base
    const warningThreshold = 0.2; // Avertissement si écart > 20%

    if (price > maxPrice) {
      return {
        valid: false,
        error: `Prix maximum autorisé: ${maxPrice.toFixed(
          2
        )} DT (200% du prix de base)`,
      };
    }

    const variation = Math.abs(price - basePrix) / basePrix;

    if (variation > warningThreshold) {
      // Écart supérieur au seuil : couleur rouge (avertissement)
      return {
        valid: true,
        warning: `Écart de ${(variation * 100).toFixed(
          1
        )}% par rapport au prix de base`,
        type: "warning", // Rouge
      };
    } else if (price < basePrix) {
      // Prix inférieur au prix de base : couleur bleue (information)
      return {
        valid: true,
        success: `Écart de ${(variation * 100).toFixed(
          1
        )}% par rapport au prix de base`,
        type: "success", // Bleu
      };
    } else if (price === basePrix) {
      // Prix exactement égal au prix de base : pas de message
      return { valid: true, type: "none" };
    }

    return { valid: true, type: "valid" }; // Prix valide avec léger écart acceptable
  };

  // Obtenir le prix de base d'un article
  const getArticleBasePrice = (codeArt) => {
    const article = articles.find((a) => a.code === codeArt);
    return article ? parseFloat(article.prixbrut) : 0;
  };

  // Validation Formik
  const validate = (values) => {
    const errors = {};
    if (!values.ccl) errors.ccl = "Client requis";
    if (!values.datebc) errors.datebc = "Date requise";
    // Retrait de la validation des lignes pour permettre les commandes vides
    return errors;
  };

  // Ajout d'une ligne à la commande en cours
  const addLigne = (values, setFieldValue, setValues, ligne, setLigne) => {
    if (!ligne.codeart || !ligne.qte) {
      return; // Pas d'alerte, validation silencieuse
    }

    const art = articles.find((a) => a.code === ligne.codeart);
    if (!art) {
      return; // Pas d'alerte, validation silencieuse
    }

    // Utiliser le prix saisi ou le prix de base de l'article
    const prixUnitaire =
      ligne.prix && String(ligne.prix).trim() !== ""
        ? parseFloat(ligne.prix)
        : parseFloat(art.prixbrut);

    // Valider le prix (sans alertes)
    const validation = validatePrice(prixUnitaire, art.prixbrut);
    if (!validation.valid) {
      return; // Pas d'alerte, validation silencieuse
    }

    // Pas de confirmation pour les avertissements, ajout direct
    const nouvelleLigne = {
      codeart: ligne.codeart,
      libart: art?.libelle || "",
      famille: art?.famille || "",
      puart: prixUnitaire.toFixed(2),
      prixBase: parseFloat(art.prixbrut).toFixed(2),
      qte: ligne.qte,
    };

    const nouvellesLignes = [...values.lignes, nouvelleLigne];

    // Utiliser setValues pour forcer le re-render complet de Formik
    setValues({
      ...values,
      lignes: nouvellesLignes,
    });

    setLigne({ codeart: "", qte: "", prix: "" });
  };

  // Supprimer une ligne de la commande
  const removeLigne = (index, values, setFieldValue, setValues) => {
    const nouvellesLignes = values.lignes.filter((_, i) => i !== index);
    setValues({
      ...values,
      lignes: nouvellesLignes,
    });
  };

  // Préparer l'édition d'une commande
  const handleEdit = async (numbc) => {
    const data = await api.getCommande(numbc);
    setEditCommande(data);
    setShowForm(true);
    startEditing(numbc); // Utiliser le hook de gestion des statuts

    // Scroll vers le formulaire
    setTimeout(() => {
      const formElement = document.getElementById("commande-form");
      if (formElement) {
        formElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }
    }, 100);
  };

  // Création ou modification d'une commande
  const handleSubmit = async (values, { resetForm }) => {
    try {
      if (editCommande) {
        await api.updateCommande(editCommande.entete.numbc, values);
      } else {
        await api.createCommande(values);
      }
      setShowForm(false);
      setEditCommande(null);
      setDetails(null);
      resetAllStatus(); // Arrêter tous les statuts en cours
      setTimeout(() => {
        api.getCommandes().then(setCommandes);
      }, 300);
      resetForm();
    } catch (error) {
      console.error("Erreur:", error);
      resetAllStatus(); // Arrêter tous les statuts même en cas d'erreur
    }
  };

  // Afficher détails d'une commande
  const showDetails = async (numbc) => {
    // Fermer le formulaire de modification s'il est ouvert
    if (showForm) {
      setShowForm(false);
      setEditCommande(null);
      setLigne({ codeart: "", qte: "", prix: "" });
      setEditingLigne(null);
      setEditingPrix(null);
      setTempQte("");
      setTempPrix("");
    }

    const data = await api.getCommande(numbc);
    setDetails(data);
    startViewing(numbc); // Utiliser le hook de gestion des statuts
  };

  // Supprimer une commande
  const handleDelete = async (numbc) => {
    if (window.confirm("Supprimer cette commande ?")) {
      try {
        await api.deleteCommande(numbc);
        api.getCommandes().then(setCommandes);
        setDetails(null);
        resetAllStatus(); // Arrêter tous les statuts en cours
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  // Fonction helper pour valider et sauvegarder les modifications d'une ligne
  const saveLineEdits = (
    idx,
    values,
    setValues,
    newQte = null,
    newPrix = null
  ) => {
    const currentLigne = values.lignes[idx];

    // Utiliser les nouvelles valeurs si fournies, sinon garder les anciennes
    const finalQte = newQte !== null ? newQte : currentLigne.qte;
    const finalPrix = newPrix !== null ? newPrix : currentLigne.puart;

    // Valider la quantité
    if (finalQte && finalQte > 0) {
      // Valider le prix si modifié
      let prixValide = true;
      if (newPrix !== null) {
        const validation = validatePrice(
          finalPrix,
          currentLigne.prixBase || getArticleBasePrice(currentLigne.codeart)
        );
        prixValide = validation.valid;
      }

      if (prixValide) {
        const updatedLignes = [...values.lignes];
        updatedLignes[idx] = {
          ...currentLigne,
          qte: finalQte,
          puart: parseFloat(finalPrix).toFixed(2),
        };
        setValues({
          ...values,
          lignes: updatedLignes,
        });
      }
    }
  };

  return (
    <div className="commandes-container theme-immersive-container">
      <div className="commandes-header">
        <h1 className="commandes-title">
          <FiShoppingCart size={36} style={{ color: "var(--color-primary)" }} />
          Gestion des Commandes
        </h1>
        {!showForm && (
          <button
            onClick={() => {
              setShowForm(true);
              setEditCommande(null);
              setLigne({ codeart: "", qte: "", prix: "" });
              setEditingLigne(null);
              setEditingPrix(null);
              setTempQte("");
              setTempPrix("");
              resetAllStatus(); // Arrêter tous les statuts en cours
            }}
            className="commandes-button-primary theme-magnetic theme-ripple"
          >
            <FiPlus />
            Nouvelle Commande
          </button>
        )}

        {showForm && (
          <button
            onClick={() => {
              setShowForm(false);
              setEditCommande(null);
              setLigne({ codeart: "", qte: "", prix: "" });
              setEditingLigne(null);
              setEditingPrix(null);
              setTempQte("");
              setTempPrix("");
              resetAllStatus(); // Arrêter tous les statuts en cours
            }}
            className="commandes-button-secondary"
          >
            <FiX />
            Annuler
          </button>
        )}
      </div>

      {/* Formulaire d'ajout/modification */}
      {showForm && (
        <div
          className="commandes-card theme-immersive-card theme-fade-in"
          id="commande-form"
        >
          <h3 className="commandes-card-title">
            {editCommande ? <FiEdit2 /> : <FiPlus />}
            {editCommande
              ? "Modifier la commande"
              : "Créer une nouvelle commande"}
          </h3>

          <Formik
            enableReinitialize
            initialValues={
              editCommande
                ? {
                    ccl: editCommande.entete.ccl,
                    datebc: editCommande.entete.datebc?.slice(0, 10),
                    lignes: editCommande.lignes.map((l) => {
                      const article = articles.find(
                        (a) => a.code === l.codeart
                      );
                      return {
                        codeart: l.codeart,
                        libart: l.libart,
                        famille: l.famille,
                        puart: l.puart,
                        prixBase: article
                          ? parseFloat(article.prixbrut).toFixed(2)
                          : l.puart,
                        qte: l.qte,
                      };
                    }),
                  }
                : { ccl: "", datebc: "", lignes: [] }
            }
            validate={validate}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, setValues, isSubmitting }) => (
              <Form>
                {/* En-tête de commande */}
                <div className="commandes-form-grid">
                  <div>
                    <label className="commandes-label">Client *</label>
                    <Field name="ccl">
                      {({ field, meta }) => (
                        <>
                          <select
                            {...field}
                            className={`commandes-input ${
                              meta.error ? "commandes-input--error" : ""
                            }`}
                          >
                            <option value="">Sélectionner un client</option>
                            {clients.map((client) => (
                              <option key={client.code} value={client.code}>
                                {client.rsoc} ({client.code})
                              </option>
                            ))}
                          </select>
                          {meta.error && (
                            <div className="commandes-error-message">
                              {meta.error}
                            </div>
                          )}
                        </>
                      )}
                    </Field>
                  </div>

                  <div>
                    <label className="commandes-label">
                      Date de commande *
                    </label>
                    <Field name="datebc">
                      {({ field, meta }) => (
                        <>
                          <input
                            {...field}
                            type="date"
                            className={`commandes-input ${
                              meta.error ? "commandes-input--error" : ""
                            }`}
                          />
                          {meta.error && (
                            <div className="commandes-error-message">
                              {meta.error}
                            </div>
                          )}
                        </>
                      )}
                    </Field>
                  </div>
                </div>

                {/* Ajout d'une ligne */}
                <div className="commandes-ligne-form">
                  <div>
                    <label className="commandes-label">Article *</label>
                    <select
                      value={ligne.codeart}
                      onChange={(e) => {
                        const selectedCode = e.target.value;
                        const selectedArticle = articles.find(
                          (a) => a.code === selectedCode
                        );
                        setLigne({
                          ...ligne,
                          codeart: selectedCode,
                          prix: selectedArticle ? selectedArticle.prixbrut : "",
                        });
                      }}
                      className="commandes-input"
                    >
                      <option value="">Sélectionner un article</option>
                      {articles.map((article) => (
                        <option key={article.code} value={article.code}>
                          {article.code} - {article.libelle} (
                          {parseFloat(article.prixbrut).toFixed(2)} DT)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="commandes-label">Quantité *</label>
                    <input
                      type="number"
                      min="1"
                      value={ligne.qte}
                      onChange={(e) =>
                        setLigne({ ...ligne, qte: e.target.value })
                      }
                      className="commandes-input"
                      placeholder="Quantité"
                    />
                  </div>

                  <div className="commandes-price-container">
                    <label className="commandes-label commandes-price-label">
                      <span className="commandes-price-label-main">
                        Prix unitaire (DT)
                      </span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={ligne.prix}
                      onChange={(e) =>
                        setLigne({ ...ligne, prix: e.target.value })
                      }
                      className={`commandes-input commandes-input--price ${
                        ligne.prix && ligne.codeart
                          ? (() => {
                              const validation = validatePrice(
                                ligne.prix,
                                getArticleBasePrice(ligne.codeart)
                              );
                              if (validation.error) return "error";
                              if (validation.type === "warning")
                                return "warning";
                              if (validation.type === "success")
                                return "success";
                              return "valid";
                            })()
                          : ""
                      }`}
                      placeholder={
                        ligne.codeart
                          ? `${getArticleBasePrice(ligne.codeart).toFixed(2)}`
                          : "Prix unitaire"
                      }
                      disabled={!ligne.codeart}
                    />
                    {ligne.prix &&
                      ligne.codeart &&
                      (() => {
                        const validation = validatePrice(
                          ligne.prix,
                          getArticleBasePrice(ligne.codeart)
                        );
                        if (validation.error) {
                          return (
                            <div className="commandes-error-message">
                              ❌ {validation.error}
                            </div>
                          );
                        }
                        if (validation.type === "warning") {
                          return (
                            <div className="commandes-warning-message">
                              <span>📊 {validation.warning}</span>
                            </div>
                          );
                        }
                        if (validation.type === "success") {
                          return (
                            <div className="commandes-success-message">
                              <span>{validation.success}</span>
                            </div>
                          );
                        }
                        if (
                          validation.type === "none" ||
                          validation.type === "valid"
                        ) {
                          return null; // Pas de message quand prix = prix de base ou prix valide
                        }
                        return null;
                      })()}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      addLigne(
                        values,
                        setFieldValue,
                        setValues,
                        ligne,
                        setLigne
                      )
                    }
                    className="commandes-button-primary theme-magnetic theme-ripple"
                  >
                    <FiPlus />
                    Ajouter
                  </button>
                </div>

                {/* Articles commandés */}
                {values.lignes.length > 0 && (
                  <div className="commandes-articles-section">
                    <h4 className="commandes-articles-title">
                      <FiPackage />
                      Articles commandés ({values.lignes.length})
                    </h4>

                    <table className="commandes-table">
                      <thead>
                        <tr>
                          <th className="commandes-table-header">Article</th>
                          <th className="commandes-table-header">Famille</th>
                          <th className="commandes-table-header commandes-table-header--center">
                            <DTIcon
                              size={16}
                              color="#059669"
                              style={{
                                marginRight: "8px",
                                display: "inline",
                                verticalAlign: "text-bottom",
                              }}
                            />
                            Prix Unitaire (DT)
                          </th>
                          <th className="commandes-table-header commandes-table-header--center">
                            Quantité
                          </th>
                          <th className="commandes-table-header commandes-table-header--center">
                            <DTIcon
                              size={16}
                              color="#059669"
                              style={{
                                marginRight: "8px",
                                display: "inline",
                                verticalAlign: "text-bottom",
                              }}
                            />
                            Total (DT)
                          </th>
                          <th
                            className="commandes-table-header commandes-table-header--center"
                            style={{ textAlign: "center" }}
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {values.lignes.map((l, idx) => (
                          <tr key={idx}>
                            <td className="commandes-table-cell bold-cell">
                              {l.libart}
                            </td>
                            <td className="commandes-table-cell commandes-table-cell--center">
                              <span className="client-badge">{l.famille}</span>
                            </td>
                            <td className="commandes-table-cell commandes-table-cell--center commandes-table-cell--bold">
                              {editingPrix === idx ? (
                                <div className="commandes-edit-price">
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={tempPrix}
                                    onChange={(e) =>
                                      setTempPrix(e.target.value)
                                    }
                                    className="commandes-price-input"
                                    autoFocus={editingPrix === idx} // Focus sur prix quand il est en édition
                                    onBlur={() => {
                                      // Ne valider que le prix, garder l'édition de la quantité si active
                                      if (tempPrix && tempPrix >= 0) {
                                        saveLineEdits(
                                          idx,
                                          values,
                                          setValues,
                                          null,
                                          tempPrix
                                        );
                                      }
                                      // Fermer l'édition du prix mais garder la quantité ouverte si en cours
                                      setEditingPrix(null);
                                      setTempPrix("");
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        if (tempPrix && tempPrix >= 0) {
                                          saveLineEdits(
                                            idx,
                                            values,
                                            setValues,
                                            null,
                                            tempPrix
                                          );
                                        }
                                        setEditingPrix(null);
                                        setTempPrix("");
                                      }
                                      if (e.key === "Escape") {
                                        setEditingPrix(null);
                                        setTempPrix("");
                                      }
                                    }}
                                  />
                                </div>
                              ) : (
                                <span
                                  onClick={() => {
                                    setEditingPrix(idx);
                                    setTempPrix(l.puart);
                                  }}
                                  style={{ cursor: "pointer" }}
                                  className={
                                    l.prixBase &&
                                    parseFloat(l.puart) !==
                                      parseFloat(l.prixBase)
                                      ? "commandes-price-modified"
                                      : ""
                                  }
                                >
                                  {parseFloat(l.puart).toFixed(2)} DT
                                  {l.prixBase &&
                                    parseFloat(l.puart) !==
                                      parseFloat(l.prixBase) && (
                                      <span
                                        className={`commandes-price-badge ${
                                          parseFloat(l.puart) >
                                          parseFloat(l.prixBase)
                                            ? "commandes-price-badge--increase"
                                            : "commandes-price-badge--decrease"
                                        }`}
                                      >
                                        {parseFloat(l.puart) >
                                        parseFloat(l.prixBase)
                                          ? "↗"
                                          : "↘"}
                                        {(
                                          ((parseFloat(l.puart) -
                                            parseFloat(l.prixBase)) /
                                            parseFloat(l.prixBase)) *
                                          100
                                        ).toFixed(1)}
                                        %
                                      </span>
                                    )}
                                </span>
                              )}
                            </td>
                            <td className="commandes-table-cell center-bold-cell">
                              {editingLigne === idx ? (
                                <div className="commandes-edit-quantity">
                                  <input
                                    type="number"
                                    min="1"
                                    value={tempQte}
                                    onChange={(e) => setTempQte(e.target.value)}
                                    className="commandes-quantity-input"
                                    autoFocus={
                                      editingLigne === idx &&
                                      editingPrix !== idx
                                    } // Focus sur quantité seulement si prix pas en édition
                                    onBlur={() => {
                                      // Ne valider que la quantité, garder l'édition du prix si active
                                      if (tempQte && tempQte > 0) {
                                        saveLineEdits(
                                          idx,
                                          values,
                                          setValues,
                                          tempQte,
                                          null
                                        );
                                      }
                                      // Fermer l'édition de la quantité mais garder le prix ouvert si en cours
                                      setEditingLigne(null);
                                      setTempQte("");
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        if (tempQte && tempQte > 0) {
                                          saveLineEdits(
                                            idx,
                                            values,
                                            setValues,
                                            tempQte,
                                            null
                                          );
                                        }
                                        setEditingLigne(null);
                                        setTempQte("");
                                      } else if (e.key === "Escape") {
                                        setEditingLigne(null);
                                        setTempQte("");
                                      }
                                    }}
                                  />
                                </div>
                              ) : (
                                <span
                                  onClick={() => {
                                    setEditingLigne(idx);
                                    setTempQte(l.qte);
                                  }}
                                  style={{ cursor: "pointer" }}
                                >
                                  {l.qte}
                                </span>
                              )}
                            </td>
                            <td className="commandes-table-cell commandes-table-cell--center commandes-table-cell--total">
                              {(parseFloat(l.puart) * parseInt(l.qte)).toFixed(
                                2
                              )}{" "}
                              DT
                            </td>
                            <td className="commandes-table-cell commandes-table-cell--center">
                              <div className="commandes-ligne-actions">
                                <button
                                  type="button"
                                  onClick={() => {
                                    // Activer l'édition des deux champs simultanément
                                    setEditingLigne(idx);
                                    setTempQte(l.qte);
                                    setEditingPrix(idx);
                                    setTempPrix(l.puart);
                                  }}
                                  className="commandes-action-button commandes-action-button--edit"
                                  title="Modifier le prix et la quantité"
                                >
                                  <FiEdit2 size={14} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeLigne(
                                      idx,
                                      values,
                                      setFieldValue,
                                      setValues
                                    )
                                  }
                                  className="commandes-action-button commandes-action-button--delete"
                                  title="Supprimer l'article"
                                >
                                  <FiTrash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan={4} className="total-label">
                            Total général :
                          </td>
                          <td className="total-value">
                            <div className="commandes-flex-container">
                              <DTIcon size={18} color="#059669" />
                              {values.lignes
                                .reduce(
                                  (total, l) =>
                                    total +
                                    parseFloat(l.puart) * parseInt(l.qte),
                                  0
                                )
                                .toFixed(2)}{" "}
                              DT
                            </div>
                          </td>
                          <td className="total-empty"></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}

                <ErrorMessage
                  name="lignes"
                  component="div"
                  className="commandes-error-message"
                />

                {/* Actions */}
                <div className="commandes-actions">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`commandes-button-primary ${
                      isSubmitting ? "commandes-button-primary--disabled" : ""
                    }`}
                  >
                    <FiSave />
                    {editCommande ? "Modifier" : "Créer"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      )}

      {/* Liste des commandes */}
      <div className="commandes-list-card theme-immersive-card theme-fade-in">
        <div className="commandes-list-header">
          <h3 className="commandes-list-title">
            Liste des Commandes ({commandes.length})
          </h3>
        </div>

        {commandes.length === 0 ? (
          <div className="commandes-empty-state">
            Aucune commande disponible
          </div>
        ) : (
          <table className="commandes-list-table">
            <thead>
              <tr>
                <th>
                  <FiShoppingCart
                    style={{ marginRight: "8px", display: "inline" }}
                  />
                  N° Commande
                </th>
                <th className="commandes-table-header--center">
                  <FiCalendar
                    style={{ marginRight: "8px", display: "inline" }}
                  />
                  Date
                </th>
                <th>
                  <FiUser style={{ marginRight: "8px", display: "inline" }} />
                  Client
                </th>
                <th
                  className="commandes-table-header--center"
                  style={{ textAlign: "center" }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {commandes.map((c, index) => (
                <tr key={c.numbc} className={getRowClass(c.numbc, "commandes")}>
                  <td className="commandes-code-badge">
                    <div className="commandes-flex-container">
                      #{c.numbc}
                      <StatusIndicator
                        type="editing"
                        show={isEditing(c.numbc)}
                      />
                      <StatusIndicator
                        type="viewing"
                        show={isViewing(c.numbc)}
                      />
                    </div>
                  </td>
                  <td>{new Date(c.datebc).toLocaleDateString("fr-FR")}</td>
                  <td>
                    <span className="client-badge">{c.rsoc}</span>
                  </td>
                  <td className="commandes-table-cell--center">
                    <div className="commandes-actions-container">
                      <button
                        onClick={() => showDetails(c.numbc)}
                        disabled={isEditing(c.numbc) || isViewing(c.numbc)}
                        className={`commandes-action-button commandes-action-button--view theme-magnetic ${
                          isEditing(c.numbc) || isViewing(c.numbc)
                            ? "commandes-button-disabled"
                            : ""
                        }`}
                      >
                        <FiEye size={14} />
                        Détails
                      </button>
                      <button
                        onClick={() => handleEdit(c.numbc)}
                        disabled={isEditing(c.numbc) || isViewing(c.numbc)}
                        className={`commandes-action-button commandes-action-button--edit theme-magnetic ${
                          isEditing(c.numbc) || isViewing(c.numbc)
                            ? "commandes-button-disabled"
                            : ""
                        }`}
                      >
                        <FiEdit2 size={14} />
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(c.numbc)}
                        disabled={isEditing(c.numbc) || isViewing(c.numbc)}
                        className={`commandes-action-button commandes-action-button--delete theme-magnetic ${
                          isEditing(c.numbc) || isViewing(c.numbc)
                            ? "commandes-button-disabled"
                            : ""
                        }`}
                      >
                        <FiTrash2 size={14} />
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal des détails */}
      {details && (
        <div
          className="commandes-modal-overlay"
          onClick={() => {
            setDetails(null);
            stopViewing();
          }}
        >
          <div
            className="commandes-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="commandes-modal-header">
              <h4 className="commandes-modal-title">
                <FiEye size={24} style={{ color: "var(--color-primary)" }} />
                Détails de la commande #{details.entete.numbc}
              </h4>
              <button
                onClick={() => {
                  setDetails(null);
                  stopViewing();
                }}
                className="commandes-modal-close-button"
              >
                <FiX size={16} />
                Fermer
              </button>
            </div>

            {/* Informations de la commande */}
            <div className="commandes-modal-info-section">
              <div className="commandes-modal-info-grid">
                <div>
                  <div className="commandes-modal-info-label">
                    <FiUser style={{ marginRight: "6px", display: "inline" }} />
                    Client
                  </div>
                  <div className="commandes-modal-info-value">
                    {details.entete.rsoc}
                  </div>
                </div>
                <div>
                  <div className="commandes-modal-info-label">
                    <FiCalendar
                      style={{ marginRight: "6px", display: "inline" }}
                    />
                    Date de commande
                  </div>
                  <div className="commandes-modal-info-value">
                    {new Date(details.entete.datebc).toLocaleDateString(
                      "fr-FR"
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Tableau des articles */}
            <div className="commandes-modal-articles-section">
              <h5 className="commandes-modal-articles-title">
                <FiPackage />
                Articles commandés ({details.lignes.length})
              </h5>

              <table className="commandes-table">
                <thead>
                  <tr>
                    <th className="commandes-table-header">Article</th>
                    <th className="commandes-table-header">Famille</th>
                    <th className="commandes-table-header commandes-table-header--center">
                      <DTIcon
                        size={16}
                        color="#059669"
                        style={{
                          marginRight: "8px",
                          display: "inline",
                          verticalAlign: "text-bottom",
                        }}
                      />
                      Prix Unitaire (DT)
                    </th>
                    <th className="commandes-table-header commandes-table-header--center">
                      Quantité
                    </th>
                    <th className="commandes-table-header commandes-table-header--center">
                      <DTIcon
                        size={16}
                        color="#059669"
                        style={{
                          marginRight: "8px",
                          display: "inline",
                          verticalAlign: "text-bottom",
                        }}
                      />
                      Total (DT)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {details.lignes.map((l, idx) => (
                    <tr key={idx}>
                      <td className="commandes-table-cell bold-cell">
                        {l.libart}
                      </td>
                      <td className="commandes-table-cell">
                        <span className="client-badge">{l.famille}</span>
                      </td>
                      <td className="commandes-table-cell commandes-table-cell--center commandes-table-cell--bold">
                        {parseFloat(l.puart).toFixed(2)} DT
                      </td>
                      <td className="commandes-table-cell center-bold-cell">
                        {l.qte}
                      </td>
                      <td className="commandes-table-cell commandes-table-cell--center commandes-table-cell--total">
                        {(parseFloat(l.puart) * parseInt(l.qte)).toFixed(2)} DT
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={4} className="total-label">
                      Total général :
                    </td>
                    <td className="total-value">
                      <div className="commandes-flex-container">
                        <DTIcon size={18} color="#059669" />
                        {details.lignes
                          .reduce(
                            (total, l) =>
                              total + parseFloat(l.puart) * parseInt(l.qte),
                            0
                          )
                          .toFixed(2)}{" "}
                        DT
                      </div>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
