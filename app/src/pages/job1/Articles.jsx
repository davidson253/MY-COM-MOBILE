import { useEffect, useState } from "react";
import api from "../../services/api";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiPackage,
  FiTag,
  FiSearch,
  FiFilter,
  FiX,
  FiSave,
} from "react-icons/fi";

// Composants réutilisables
import {
  Button,
  DataTable,
  FormCard,
  FilterContainer,
  DataBadge,
  CodeBadge,
  ActionButtonGroup,
  SearchBar,
} from "../../components/shared";
import DTIcon from "../../components/DTIcon";
import { useStatusManager } from "../../hooks/useStatusManager";

// CSS avec système de thème centralisé
import "../styles/Common.css";
import "./styles/SharedPageStyles.css";

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editCode, setEditCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterFamily, setFilterFamily] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showErrors, setShowErrors] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Hook de gestion des statuts
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
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const data = await api.getArticles();
      setArticles(data);
    } catch (error) {
      console.error("Erreur lors du chargement des articles:", error);
    } finally {
      setLoading(false);
    }
  };

  // Configuration du formulaire
  const initialValues = {
    code: "",
    libelle: "",
    famille: "",
    prixbrut: "",
  };

  const validate = (values) => {
    const errors = {};
    if (!values.code) errors.code = "Code requis";
    if (!values.libelle) errors.libelle = "Libellé requis";
    if (!values.famille) errors.famille = "Famille requise";
    if (!values.prixbrut || values.prixbrut <= 0)
      errors.prixbrut = "Prix requis";
    return errors;
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setShowErrors(true);
    setSubmitError("");
    setSubmitting(true);

    try {
      if (editCode) {
        await api.updateArticle(editCode, values);
      } else {
        await api.createArticle(values);
      }
      setEditCode(null);
      setShowErrors(false);
      setSubmitError("");
      setShowForm(false);
      resetAllStatus();
      await loadArticles();
      resetForm();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      setSubmitError(error.message || "Erreur lors de l'enregistrement");
    } finally {
      setSubmitting(false);
    }
  };

  // Gestionnaires d'événements
  const handleEdit = (code) => {
    setEditCode(code);
    setShowErrors(false);
    setSubmitError("");
    setShowForm(true);
    startEditing(code);

    // Scroll vers le formulaire
    setTimeout(() => {
      const formElement = document.getElementById("article-form");
      if (formElement) {
        formElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }
    }, 100);
  };

  const handleDelete = async (code) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
      try {
        await api.deleteArticle(code);
        await loadArticles();
        resetAllStatus();
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditCode(null);
    setShowErrors(false);
    setSubmitError("");
    resetAllStatus();
  };

  const handleNewArticle = () => {
    setShowForm(true);
    setEditCode(null);
    setShowErrors(false);
    setSubmitError("");
    resetAllStatus();
  };

  // Filtrage des articles
  const filteredArticles = articles.filter((article) => {
    const searchLower = searchTerm.toLowerCase();

    const matchesSearch =
      !searchTerm ||
      article.code.toLowerCase().includes(searchLower) ||
      article.libelle.toLowerCase().includes(searchLower) ||
      article.famille.toLowerCase().includes(searchLower) ||
      article.prixbrut.toString().includes(searchLower);

    const matchesFamily = !filterFamily || article.famille === filterFamily;

    const matchesPrice =
      (!minPrice || parseFloat(article.prixbrut) >= parseFloat(minPrice)) &&
      (!maxPrice || parseFloat(article.prixbrut) <= parseFloat(maxPrice));

    return matchesSearch && matchesFamily && matchesPrice;
  });

  // Familles uniques pour le filtre
  const uniqueFamilies = [...new Set(articles.map((a) => a.famille))].sort();

  // Configuration des colonnes du tableau
  const columns = [
    {
      icon: <FiTag size={16} />,
      title: "Code",
      dataKey: "code",
      render: (article) => (
        <CodeBadge
          code={article.code}
          onClick={() => startViewing(article.code)}
        />
      ),
    },
    {
      icon: <FiPackage size={16} />,
      title: "Libellé",
      dataKey: "libelle",
    },
    {
      icon: <FiTag size={16} />,
      title: "Famille",
      dataKey: "famille",
      render: (article) => (
        <DataBadge value={article.famille} variant="secondary" />
      ),
    },
    {
      icon: <DTIcon name="tunisian-dinar" size={16} />,
      title: "Prix (DT)",
      dataKey: "prixbrut",
      render: (article) => (
        <div className="page-flex-container">
          <DTIcon name="tunisian-dinar" size={14} />
          <span style={{ fontWeight: "600", color: "var(--color-success)" }}>
            {parseFloat(article.prixbrut).toFixed(3)}
          </span>
        </div>
      ),
    },
    {
      icon: null,
      title: "Actions",
      dataKey: "actions",
      render: (article) => (
        <ActionButtonGroup
          actions={[
            {
              icon: <FiEdit2 size={14} />,
              label: "Modifier",
              variant: "edit",
              onClick: () => handleEdit(article.code),
            },
            {
              icon: <FiTrash2 size={14} />,
              label: "Supprimer",
              variant: "delete",
              onClick: () => handleDelete(article.code),
            },
          ]}
        />
      ),
    },
  ];

  // Valeurs initiales pour l'édition
  const getInitialValues = () => {
    if (editCode) {
      const article = articles.find((a) => a.code === editCode);
      return article
        ? {
            code: article.code,
            libelle: article.libelle,
            famille: article.famille,
            prixbrut: article.prixbrut,
          }
        : initialValues;
    }
    return initialValues;
  };

  return (
    <div className="page-container">
      {/* En-tête */}
      <div className="page-header">
        <div className="page-header-main">
          <h1 className="page-title">
            <FiPackage size={32} />
            Articles
          </h1>
          <div className="page-status-nav">
            {loading && articles.length === 0 && (
              <div className="page-status">
                <div className="page-status-loading">
                  <div className="page-spinner"></div>
                  <span>Chargement des articles...</span>
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
          id="article-form"
          title={
            <>
              {editCode ? <FiEdit2 size={20} /> : <FiPlus size={20} />}
              {editCode ? "Modifier l'article" : "Nouvel article"}
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
                    <label className="page-label">Code</label>
                    <Field
                      name="code"
                      type="text"
                      placeholder="Code de l'article"
                      className={`page-input ${
                        showErrors && errors.code && touched.code
                          ? "page-input--error"
                          : ""
                      }`}
                      disabled={!!editCode}
                    />
                    {showErrors && (
                      <ErrorMessage
                        name="code"
                        component="div"
                        className="page-error-message"
                      />
                    )}
                  </div>

                  <div>
                    <label className="page-label">Libellé</label>
                    <Field
                      name="libelle"
                      type="text"
                      placeholder="Libellé de l'article"
                      className={`page-input ${
                        showErrors && errors.libelle && touched.libelle
                          ? "page-input--error"
                          : ""
                      }`}
                    />
                    {showErrors && (
                      <ErrorMessage
                        name="libelle"
                        component="div"
                        className="page-error-message"
                      />
                    )}
                  </div>

                  <div>
                    <label className="page-label">Famille</label>
                    <Field
                      name="famille"
                      type="text"
                      placeholder="Famille de l'article"
                      className={`page-input ${
                        showErrors && errors.famille && touched.famille
                          ? "page-input--error"
                          : ""
                      }`}
                    />
                    {showErrors && (
                      <ErrorMessage
                        name="famille"
                        component="div"
                        className="page-error-message"
                      />
                    )}
                  </div>

                  <div>
                    <label className="page-label">Prix (DT)</label>
                    <Field
                      name="prixbrut"
                      type="number"
                      step="0.001"
                      placeholder="Prix de l'article"
                      className={`page-input ${
                        showErrors && errors.prixbrut && touched.prixbrut
                          ? "page-input--error"
                          : ""
                      }`}
                    />
                    {showErrors && (
                      <ErrorMessage
                        name="prixbrut"
                        component="div"
                        className="page-error-message"
                      />
                    )}
                  </div>
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
                      : editCode
                      ? "Modifier"
                      : "Ajouter"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </FormCard>
      )}

      {/* Liste des articles */}
      <div className="page-card">
        <div className="page-header">
          <h2 className="page-list-title">
            <FiPackage size={20} />
            Liste des articles ({filteredArticles.length})
          </h2>
          <Button
            variant="primary"
            icon={<FiPlus size={16} />}
            onClick={handleNewArticle}
          >
            Nouvel article
          </Button>
        </div>

        {/* Filtres */}
        <FilterContainer>
          <div className="filter-row">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Rechercher un article..."
            />
            <div className="filter-select">
              <select
                value={filterFamily}
                onChange={(e) => setFilterFamily(e.target.value)}
                className="page-input"
              >
                <option value="">Toutes les familles</option>
                {uniqueFamilies.map((famille) => (
                  <option key={famille} value={famille}>
                    {famille}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="filter-row">
            <div className="filter-price">
              <input
                type="number"
                step="0.01"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Prix min"
                className="page-input"
              />
            </div>
            <div className="filter-price">
              <input
                type="number"
                step="0.01"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Prix max"
                className="page-input"
              />
            </div>
          </div>
        </FilterContainer>

        {/* Tableau des données */}
        <DataTable
          data={filteredArticles}
          columns={columns}
          emptyState={
            <div className="page-empty-state">
              <FiPackage
                size={48}
                style={{ marginBottom: "20px", opacity: 0.5 }}
              />
              <p>
                {searchTerm || filterFamily || minPrice || maxPrice
                  ? "Aucun article trouvé avec ces critères de recherche."
                  : "Aucun article trouvé. Créez votre premier article pour commencer."}
              </p>
            </div>
          }
          getRowClass={(article) => getRowClass(article.code, "articles")}
        />
      </div>

      {/* Overlay de chargement */}
      {loading && articles.length > 0 && (
        <div className="loading-overlay">
          <div className="page-spinner"></div>
        </div>
      )}
    </div>
  );
}
