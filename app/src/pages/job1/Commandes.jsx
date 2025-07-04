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
import {
  ActionButtonGroup,
  FilterContainer,
  DataBadge,
  CodeBadge,
  DataTable,
  FormCard,
  Button,
  SearchBar,
} from "../../components/shared";

// CSS centralisé
import "../styles/Common.css";
import "./styles/SharedPageStyles.css";

export default function Commandes() {
  const [commandes, setCommandes] = useState([]);
  const [clients, setClients] = useState([]);
  const [articles, setArticles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalCommande, setModalCommande] = useState(null);
  const [editCommande, setEditCommande] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClient, setFilterClient] = useState("");
  const [showErrors, setShowErrors] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [lignes, setLignes] = useState([]);
  const [editingLigne, setEditingLigne] = useState(null);
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
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [commandesData, clientsData, articlesData] = await Promise.all([
        api.getCommandes(),
        api.getClients(),
        api.getArticles(),
      ]);
      setCommandes(commandesData);
      setClients(clientsData);
      setArticles(articlesData);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setLoading(false);
    }
  };

  // Validation
  const validate = (values) => {
    const errors = {};
    if (!values.ccl) errors.ccl = "Client requis";
    if (!values.datebc) errors.datebc = "Date requise";
    return errors;
  };

  // Validation du prix avec règles métier
  const validatePrice = (newPrice, articlePrixBrut) => {
    const price = parseFloat(newPrice);
    const basePrix = parseFloat(articlePrixBrut);

    if (isNaN(price) || price < 0) {
      return { valid: false, error: "Le prix doit être un nombre positif" };
    }

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
      return {
        valid: true,
        warning: `Écart de ${(variation * 100).toFixed(
          1
        )}% par rapport au prix de base`,
        type: "warning",
      };
    } else if (price < basePrix) {
      return {
        valid: true,
        success: `Écart de ${(variation * 100).toFixed(
          1
        )}% par rapport au prix de base`,
        type: "success",
      };
    }

    return { valid: true, type: "valid" };
  };

  // Gestion des lignes
  const addLigne = () => {
    if (!ligne.codeart || !ligne.qte) return;

    const art = articles.find((a) => a.code === ligne.codeart);
    if (!art) return;

    const prixUnitaire =
      ligne.prix && String(ligne.prix).trim() !== ""
        ? parseFloat(ligne.prix)
        : parseFloat(art.prixbrut);

    const validation = validatePrice(prixUnitaire, art.prixbrut);
    if (!validation.valid) return;

    const nouvelleLigne = {
      codeart: ligne.codeart,
      libart: art?.libelle || "",
      famille: art?.famille || "",
      puart: prixUnitaire.toFixed(3),
      prixBase: parseFloat(art.prixbrut).toFixed(3),
      qte: parseInt(ligne.qte),
      total: (prixUnitaire * parseInt(ligne.qte)).toFixed(3),
    };

    setLignes([...lignes, nouvelleLigne]);
    setLigne({ codeart: "", qte: "", prix: "" });
  };

  const removeLigne = (index) => {
    setLignes(lignes.filter((_, i) => i !== index));
  };

  const getTotalCommande = () => {
    return lignes.reduce((total, ligne) => total + parseFloat(ligne.total), 0);
  };

  // Gestionnaires d'événements
  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    setShowErrors(true);
    setSubmitError("");
    setSubmitting(true);

    try {
      const commandeData = {
        ...values,
        lignes: lignes,
        total: getTotalCommande().toFixed(3),
      };

      if (editCommande) {
        await api.updateCommande(editCommande.numero, commandeData);
      } else {
        await api.createCommande(commandeData);
      }

      setShowForm(false);
      setEditCommande(null);
      setLignes([]);
      setShowErrors(false);
      setSubmitError("");
      resetAllStatus();
      await loadData();
      resetForm();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      setSubmitError(error.message || "Erreur lors de l'enregistrement");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (commande) => {
    setEditCommande(commande);
    setLignes(commande.lignes || []);
    setShowErrors(false);
    setSubmitError("");
    setShowForm(true);
    startEditing(commande.numero);

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

  const handleView = (commande) => {
    setModalCommande(commande);
    setShowModal(true);
    startViewing(commande.numero);
  };

  const handleDelete = async (numero) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette commande ?")) {
      try {
        await api.deleteCommande(numero);
        await loadData();
        resetAllStatus();
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditCommande(null);
    setLignes([]);
    setShowErrors(false);
    setSubmitError("");
    resetAllStatus();
  };

  const handleNewCommande = () => {
    setShowForm(true);
    setEditCommande(null);
    setLignes([]);
    setShowErrors(false);
    setSubmitError("");
    resetAllStatus();
  };

  // Filtrage
  const filteredCommandes = commandes.filter((commande) => {
    const searchLower = searchTerm.toLowerCase();
    const client = clients.find((c) => c.code === commande.ccl);

    const matchesSearch =
      !searchTerm ||
      commande.numero.toString().includes(searchLower) ||
      (client && client.rsoc.toLowerCase().includes(searchLower)) ||
      commande.datebc.includes(searchLower);

    const matchesClient = !filterClient || commande.ccl === filterClient;
    return matchesSearch && matchesClient;
  });

  // Configuration des colonnes
  const columns = [
    {
      icon: <FiShoppingCart size={16} />,
      title: "Numéro",
      dataKey: "numero",
      render: (commande) => (
        <CodeBadge
          code={`CMD-${commande.numero}`}
          onClick={() => handleView(commande)}
        />
      ),
    },
    {
      icon: <FiUser size={16} />,
      title: "Client",
      dataKey: "ccl",
      render: (commande) => {
        const client = clients.find((c) => c.code === commande.ccl);
        return client ? (
          <span className="page-name-cell">{client.rsoc}</span>
        ) : (
          <span className="page-no-data">Client introuvable</span>
        );
      },
    },
    {
      icon: <FiCalendar size={16} />,
      title: "Date",
      dataKey: "datebc",
      render: (commande) => (
        <DataBadge value={commande.datebc} variant="secondary" />
      ),
    },
    {
      icon: <DTIcon name="tunisian-dinar" size={16} />,
      title: "Total (DT)",
      dataKey: "total",
      render: (commande) => (
        <div className="page-flex-container">
          <DTIcon name="tunisian-dinar" size={14} />
          <span style={{ fontWeight: "600", color: "var(--color-success)" }}>
            {parseFloat(commande.total || 0).toFixed(3)}
          </span>
        </div>
      ),
    },
    {
      icon: <FiPackage size={16} />,
      title: "Articles",
      dataKey: "lignes",
      render: (commande) => (
        <DataBadge
          value={`${commande.lignes?.length || 0} article(s)`}
          variant="info"
        />
      ),
    },
    {
      icon: null,
      title: "Actions",
      dataKey: "actions",
      render: (commande) => (
        <ActionButtonGroup
          actions={[
            {
              icon: <FiEye size={14} />,
              label: "Voir",
              variant: "view",
              onClick: () => handleView(commande),
            },
            {
              icon: <FiEdit2 size={14} />,
              label: "Modifier",
              variant: "edit",
              onClick: () => handleEdit(commande),
            },
            {
              icon: <FiTrash2 size={14} />,
              label: "Supprimer",
              variant: "delete",
              onClick: () => handleDelete(commande.numero),
            },
          ]}
        />
      ),
    },
  ];

  const initialValues = {
    ccl: "",
    datebc: new Date().toISOString().split("T")[0],
  };

  const getInitialValues = () => {
    if (editCommande) {
      return {
        ccl: editCommande.ccl || "",
        datebc: editCommande.datebc || new Date().toISOString().split("T")[0],
      };
    }
    return initialValues;
  };

  return (
    <div className="page-container">
      {/* En-tête */}
      <div className="page-header">
        <div className="page-header-main">
          <h1 className="page-title">
            <FiShoppingCart size={32} />
            Commandes
          </h1>
          <div className="page-status-nav">
            {loading && commandes.length === 0 && (
              <div className="page-status">
                <div className="page-status-loading">
                  <div className="page-spinner"></div>
                  <span>Chargement des commandes...</span>
                </div>
              </div>
            )}
            {(isEditing() || isViewing()) && (
              <Button
                variant="secondary"
                size="sm"
                icon={<FiX size={16} />}
                onClick={resetAllStatus}
              >
                Réinitialiser la sélection
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Formulaire d'ajout/modification */}
      {showForm && (
        <FormCard
          id="commande-form"
          title={
            <>
              {editCommande ? <FiEdit2 size={20} /> : <FiPlus size={20} />}
              {editCommande ? "Modifier la commande" : "Nouvelle commande"}
            </>
          }
        >
          <Formik
            initialValues={getInitialValues()}
            validate={validate}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting, errors, touched }) => (
              <Form>
                <div className="page-form-grid">
                  <div>
                    <label className="page-label">Client</label>
                    <Field
                      name="ccl"
                      as="select"
                      className={`page-input ${
                        showErrors && errors.ccl && touched.ccl
                          ? "page-input--error"
                          : ""
                      }`}
                    >
                      <option value="">Sélectionner un client</option>
                      {clients.map((client) => (
                        <option key={client.code} value={client.code}>
                          {client.rsoc}
                        </option>
                      ))}
                    </Field>
                    {showErrors && (
                      <ErrorMessage
                        name="ccl"
                        component="div"
                        className="page-error-message"
                      />
                    )}
                  </div>

                  <div>
                    <label className="page-label">Date</label>
                    <Field
                      name="datebc"
                      type="date"
                      className={`page-input ${
                        showErrors && errors.datebc && touched.datebc
                          ? "page-input--error"
                          : ""
                      }`}
                    />
                    {showErrors && (
                      <ErrorMessage
                        name="datebc"
                        component="div"
                        className="page-error-message"
                      />
                    )}
                  </div>
                </div>

                {/* Section articles */}
                <div className="page-card" style={{ marginTop: "20px" }}>
                  <h3 className="page-card-title">
                    <FiPackage size={18} />
                    Articles de la commande
                  </h3>

                  {/* Ajout d'article */}
                  <div className="page-form-grid">
                    <div>
                      <label className="page-label">Article</label>
                      <select
                        value={ligne.codeart}
                        onChange={(e) =>
                          setLigne({ ...ligne, codeart: e.target.value })
                        }
                        className="page-input"
                      >
                        <option value="">Sélectionner un article</option>
                        {articles.map((article) => (
                          <option key={article.code} value={article.code}>
                            {article.libelle} ({article.code})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="page-label">Quantité</label>
                      <input
                        type="number"
                        min="1"
                        value={ligne.qte}
                        onChange={(e) =>
                          setLigne({ ...ligne, qte: e.target.value })
                        }
                        placeholder="Quantité"
                        className="page-input"
                      />
                    </div>

                    <div>
                      <label className="page-label">
                        Prix unitaire (optionnel)
                      </label>
                      <input
                        type="number"
                        step="0.001"
                        value={ligne.prix}
                        onChange={(e) =>
                          setLigne({ ...ligne, prix: e.target.value })
                        }
                        placeholder="Prix personnalisé"
                        className="page-input"
                      />
                    </div>

                    <div style={{ display: "flex", alignItems: "end" }}>
                      <Button
                        type="button"
                        variant="primary"
                        icon={<FiPlus size={16} />}
                        onClick={addLigne}
                        disabled={!ligne.codeart || !ligne.qte}
                      >
                        Ajouter
                      </Button>
                    </div>
                  </div>

                  {/* Liste des articles */}
                  {lignes.length > 0 && (
                    <div style={{ marginTop: "20px" }}>
                      <table className="page-table">
                        <thead>
                          <tr>
                            <th>Article</th>
                            <th>Quantité</th>
                            <th>Prix unitaire</th>
                            <th>Total</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lignes.map((ligne, index) => (
                            <tr key={index}>
                              <td>{ligne.libart}</td>
                              <td>{ligne.qte}</td>
                              <td>
                                <div className="page-flex-container">
                                  <DTIcon name="tunisian-dinar" size={14} />
                                  {ligne.puart}
                                </div>
                              </td>
                              <td>
                                <div className="page-flex-container">
                                  <DTIcon name="tunisian-dinar" size={14} />
                                  <strong>{ligne.total}</strong>
                                </div>
                              </td>
                              <td>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  icon={<FiTrash2 size={14} />}
                                  onClick={() => removeLigne(index)}
                                >
                                  Supprimer
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <th colSpan="3">Total de la commande:</th>
                            <th>
                              <div className="page-flex-container">
                                <DTIcon name="tunisian-dinar" size={16} />
                                <strong>
                                  {getTotalCommande().toFixed(3)} DT
                                </strong>
                              </div>
                            </th>
                            <th></th>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}
                </div>

                {submitError && (
                  <div
                    className="page-error-message"
                    style={{ marginBottom: "16px" }}
                  >
                    {submitError}
                  </div>
                )}

                <div className="page-form-actions">
                  <Button
                    type="button"
                    variant="secondary"
                    icon={<FiX size={16} />}
                    onClick={handleCancel}
                    disabled={isSubmitting}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    icon={<FiSave size={16} />}
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "Enregistrement..."
                      : editCommande
                      ? "Modifier"
                      : "Ajouter"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </FormCard>
      )}

      {/* Liste des commandes */}
      <div className="page-card">
        <div className="page-header">
          <h2 className="page-list-title">
            <FiShoppingCart size={20} />
            Liste des commandes ({filteredCommandes.length})
          </h2>
          <Button
            variant="primary"
            icon={<FiPlus size={16} />}
            onClick={handleNewCommande}
          >
            Nouvelle commande
          </Button>
        </div>

        {/* Filtres */}
        <FilterContainer>
          <div className="filter-row">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Rechercher une commande..."
            />
            <div className="filter-select">
              <select
                value={filterClient}
                onChange={(e) => setFilterClient(e.target.value)}
                className="page-input"
              >
                <option value="">Tous les clients</option>
                {clients.map((client) => (
                  <option key={client.code} value={client.code}>
                    {client.rsoc}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </FilterContainer>

        {/* Tableau des données */}
        <DataTable
          data={filteredCommandes}
          columns={columns}
          emptyState={
            <div className="page-empty-state">
              <FiShoppingCart
                size={48}
                style={{ marginBottom: "20px", opacity: 0.5 }}
              />
              <p>
                {searchTerm || filterClient
                  ? "Aucune commande trouvée avec ces critères de recherche."
                  : "Aucune commande trouvée. Créez votre première commande pour commencer."}
              </p>
            </div>
          }
          getRowClass={(commande) => getRowClass(commande.numero, "commandes")}
        />
      </div>

      {/* Modal de détails */}
      {showModal && modalCommande && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                <FiShoppingCart size={20} />
                Détails de la commande #{modalCommande.numero}
              </h3>
              <Button
                variant="danger"
                size="sm"
                icon={<FiX size={16} />}
                onClick={() => setShowModal(false)}
              >
                Fermer
              </Button>
            </div>

            <div className="modal-body">
              <div className="page-form-grid">
                <div>
                  <label className="page-label">Client</label>
                  <p>
                    {clients.find((c) => c.code === modalCommande.ccl)?.rsoc ||
                      "Client introuvable"}
                  </p>
                </div>
                <div>
                  <label className="page-label">Date</label>
                  <p>{modalCommande.datebc}</p>
                </div>
                <div>
                  <label className="page-label">Total</label>
                  <p className="page-flex-container">
                    <DTIcon name="tunisian-dinar" size={16} />
                    <strong>
                      {parseFloat(modalCommande.total || 0).toFixed(3)} DT
                    </strong>
                  </p>
                </div>
              </div>

              {modalCommande.lignes && modalCommande.lignes.length > 0 && (
                <div style={{ marginTop: "20px" }}>
                  <h4>Articles commandés:</h4>
                  <table className="page-table">
                    <thead>
                      <tr>
                        <th>Code</th>
                        <th>Article</th>
                        <th>Quantité</th>
                        <th>Prix unitaire</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {modalCommande.lignes.map((ligne, index) => (
                        <tr key={index}>
                          <td>{ligne.codeart}</td>
                          <td>{ligne.libart}</td>
                          <td>{ligne.qte}</td>
                          <td>
                            <div className="page-flex-container">
                              <DTIcon name="tunisian-dinar" size={14} />
                              {ligne.puart}
                            </div>
                          </td>
                          <td>
                            <div className="page-flex-container">
                              <DTIcon name="tunisian-dinar" size={14} />
                              {ligne.total}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Overlay de chargement */}
      {loading && commandes.length > 0 && (
        <div className="loading-overlay">
          <div className="page-spinner"></div>
        </div>
      )}
    </div>
  );
}
