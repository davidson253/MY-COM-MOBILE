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

// CSS avec système de thème
import "./styles/Common.css";
import "./styles/Articles.css";

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
        alert(`Erreur lors de la suppression: ${error.message}`);
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
    const matchesMinPrice =
      !minPrice || article.prixbrut >= parseFloat(minPrice);
    const matchesMaxPrice =
      !maxPrice || article.prixbrut <= parseFloat(maxPrice);

    return matchesSearch && matchesFamily && matchesMinPrice && matchesMaxPrice;
  });

  // Familles uniques pour le filtre
  const uniqueFamilies = [...new Set(articles.map((a) => a.famille))].sort();

  // Configuration des colonnes du tableau
  const columns = [
    {
      key: "code",
      title: "Code",
      icon: <FiTag />,
      dataKey: "code",
      render: (value, row) => (
        <CodeBadge
          code={value}
          isEditing={isEditing(String(value))}
          isViewing={isViewing(String(value))}
        />
      ),
    },
    {
      key: "libelle",
      title: "Libellé",
      icon: <FiPackage />,
      dataKey: "libelle",
      render: (value) => <span className="libelle-text">{value}</span>,
    },
    {
      key: "famille",
      title: "Famille",
      icon: <FiFilter />,
      dataKey: "famille",
      render: (value) => <DataBadge variant="famille" text={value} />,
    },
    {
      key: "prixbrut",
      title: "Prix Brut",
      icon: <DTIcon />,
      dataKey: "prixbrut",
      render: (value) => <span className="price-amount">{value} DT</span>,
      cellClassName: "text-center",
    },
    {
      key: "actions",
      title: "Actions",
      dataKey: "code",
      cellClassName: "text-center",
      render: (value, row) => (
        <ActionButtonGroup
          actions={[
            {
              key: "edit",
              type: "edit",
              label: "Modifier",
              icon: <FiEdit2 />,
              onClick: () => handleEdit(value),
              disabled: isEditing(value) || isViewing(value),
              title: "Modifier l'article",
            },
            {
              key: "delete",
              type: "delete",
              label: "Supprimer",
              icon: <FiTrash2 />,
              onClick: () => handleDelete(value),
              disabled: isEditing(value) || isViewing(value),
              title: "Supprimer l'article",
            },
          ]}
        />
      ),
    },
  ];

  // Configuration des champs du formulaire
  const formFields = [
    {
      name: "code",
      label: "Code de l'article *",
      type: "text",
      placeholder: "Code de l'article",
      disabled: !!editCode,
    },
    {
      name: "libelle",
      label: "Libellé *",
      type: "text",
      placeholder: "Libellé de l'article",
    },
    {
      name: "famille",
      label: "Famille *",
      type: "text",
      placeholder: "Famille de l'article",
    },
    {
      name: "prixbrut",
      label: "Prix brut *",
      type: "number",
      step: "0.01",
      placeholder: "Prix brut",
    },
  ];

  return (
    <div className="page-container">
      {/* En-tête de la page */}
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">
            <FiPackage className="page-icon" />
            Gestion des Articles
          </h1>

          <div className="page-actions">
            {loading && (
              <div className="loading-indicator">
                <div className="spinner"></div>
                <span>Opération en cours...</span>
              </div>
            )}

            {!showForm ? (
              <Button
                variant="primary"
                icon={<FiPlus />}
                onClick={handleNewArticle}
              >
                Nouvel Article
              </Button>
            ) : (
              <Button variant="secondary" icon={<FiX />} onClick={handleCancel}>
                Annuler
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Formulaire d'ajout/modification */}
      {showForm && (
        <FormCard
          id="article-form"
          title={editCode ? "Modifier l'article" : "Ajouter un nouvel article"}
          icon={editCode ? <FiEdit2 /> : <FiPlus />}
          error={submitError}
        >
          <Formik
            enableReinitialize
            initialValues={
              editCode
                ? articles.find((a) => a.code === editCode) || initialValues
                : initialValues
            }
            validate={validate}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="form-grid">
                  {formFields.map((fieldConfig) => (
                    <Field key={fieldConfig.name} name={fieldConfig.name}>
                      {({ field, meta }) => (
                        <div className="form-field">
                          <label className="form-label">
                            {fieldConfig.label}
                          </label>
                          <input
                            {...field}
                            type={fieldConfig.type}
                            step={fieldConfig.step}
                            className={`form-input ${
                              showErrors && meta.error
                                ? "form-input--error"
                                : ""
                            }`}
                            placeholder={fieldConfig.placeholder}
                            disabled={fieldConfig.disabled}
                          />
                          {showErrors && meta.error && (
                            <div className="form-error">{meta.error}</div>
                          )}
                        </div>
                      )}
                    </Field>
                  ))}
                </div>

                <div className="form-actions">
                  <Button
                    type="submit"
                    variant="primary"
                    icon={<FiSave />}
                    disabled={isSubmitting}
                    loading={isSubmitting}
                  >
                    {editCode ? "Modifier" : "Créer"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </FormCard>
      )}

      {/* Liste des articles */}
      <div className="data-card">
        <div className="data-header">
          <h3 className="data-title">
            Liste des Articles ({filteredArticles.length})
          </h3>
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
                className="form-input"
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
                className="form-input"
              />
            </div>
            <div className="filter-price">
              <input
                type="number"
                step="0.01"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Prix max"
                className="form-input"
              />
            </div>
          </div>
        </FilterContainer>

        {/* Tableau des données */}
        <DataTable
          data={filteredArticles}
          columns={columns}
          emptyState={
            <div className="articles-empty-state">
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
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
}
