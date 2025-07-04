import { useEffect, useState } from "react";
import api from "../../services/api";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiUsers,
  FiMail,
  FiPhone,
  FiMapPin,
  FiSearch,
  FiFilter,
  FiX,
  FiSave,
  FiCheckCircle,
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

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editClient, setEditClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterVille, setFilterVille] = useState("");
  const [showErrors, setShowErrors] = useState(false);
  const [submitError, setSubmitError] = useState("");

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
    loadClients();
  }, []);

  const loadClients = async () => {
    setLoading(true);
    try {
      const data = await api.getClients();
      setClients(data);
    } catch (error) {
      console.error("Erreur lors du chargement des clients:", error);
    } finally {
      setLoading(false);
    }
  };

  const validate = (values) => {
    const errors = {};
    if (!values.rsoc) errors.rsoc = "Raison sociale requise";
    if (!values.adresse) errors.adresse = "Adresse requise";
    if (!values.ville) errors.ville = "Ville requise";
    if (!values.tel) errors.tel = "Téléphone requis";
    if (values.email && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(values.email)) {
      errors.email = "Email invalide";
    }
    return errors;
  };

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    setShowErrors(true);
    setSubmitError("");
    setSubmitting(true);

    try {
      if (editClient) {
        await api.updateClient(editClient.code, values);
      } else {
        await api.createClient(values);
      }

      setShowForm(false);
      setEditClient(null);
      setShowErrors(false);
      setSubmitError("");
      resetAllStatus();
      await loadClients();
      resetForm();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      setSubmitError(error.message || "Erreur lors de l'enregistrement");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (client) => {
    setEditClient(client);
    setShowErrors(false);
    setSubmitError("");
    setShowForm(true);
    startEditing(client.code);

    setTimeout(() => {
      const formElement = document.getElementById("client-form");
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
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
      try {
        await api.deleteClient(code);
        await loadClients();
        resetAllStatus();
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditClient(null);
    setShowErrors(false);
    setSubmitError("");
    resetAllStatus();
  };

  const handleNewClient = () => {
    setShowForm(true);
    setEditClient(null);
    setShowErrors(false);
    setSubmitError("");
    resetAllStatus();
  };

  // Filtrage
  const filteredClients = clients.filter((client) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      client.code.toLowerCase().includes(searchLower) ||
      client.rsoc.toLowerCase().includes(searchLower) ||
      client.tel.toLowerCase().includes(searchLower) ||
      client.ville.toLowerCase().includes(searchLower) ||
      (client.email && client.email.toLowerCase().includes(searchLower));

    const matchesVille = !filterVille || client.ville === filterVille;
    return matchesSearch && matchesVille;
  });

  // Villes uniques pour le filtre
  const uniqueVilles = [...new Set(clients.map((c) => c.ville))].sort();

  // Configuration des colonnes
  const columns = [
    {
      icon: <FiUsers size={16} />,
      title: "Code",
      dataKey: "code",
      render: (client) => (
        <CodeBadge
          code={client.code}
          onClick={() => startViewing(client.code)}
        />
      ),
    },
    {
      icon: <FiUsers size={16} />,
      title: "Raison Sociale",
      dataKey: "rsoc",
      render: (client) => <span className="page-name-cell">{client.rsoc}</span>,
    },
    {
      icon: <FiMapPin size={16} />,
      title: "Adresse",
      dataKey: "adresse",
    },
    {
      icon: <FiMapPin size={16} />,
      title: "Ville",
      dataKey: "ville",
      render: (client) => (
        <DataBadge value={client.ville} variant="secondary" />
      ),
    },
    {
      icon: <FiPhone size={16} />,
      title: "Téléphone",
      dataKey: "tel",
      render: (client) => (
        <a href={`tel:${client.tel}`} className="page-tel-link">
          <FiPhone size={14} />
          {client.tel}
        </a>
      ),
    },
    {
      icon: <FiMail size={16} />,
      title: "Email",
      dataKey: "email",
      render: (client) =>
        client.email ? (
          <a href={`mailto:${client.email}`} className="page-email-link">
            <FiMail size={14} />
            {client.email}
          </a>
        ) : (
          <span className="page-no-data">Non renseigné</span>
        ),
    },
    {
      icon: <FiCheckCircle size={16} />,
      title: "Statut",
      dataKey: "statut",
      render: (client) => <StatusIndicator status={client.statut} />,
    },
    {
      icon: null,
      title: "Actions",
      dataKey: "actions",
      render: (client) => (
        <ActionButtonGroup
          actions={[
            {
              icon: <FiEdit2 size={14} />,
              label: "Modifier",
              variant: "edit",
              onClick: () => handleEdit(client),
            },
            {
              icon: <FiTrash2 size={14} />,
              label: "Supprimer",
              variant: "delete",
              onClick: () => handleDelete(client.code),
            },
          ]}
        />
      ),
    },
  ];

  const initialValues = {
    rsoc: "",
    adresse: "",
    ville: "",
    tel: "",
    email: "",
    statut: "actif",
  };

  const getInitialValues = () => {
    if (editClient) {
      return {
        rsoc: editClient.rsoc || "",
        adresse: editClient.adresse || "",
        ville: editClient.ville || "",
        tel: editClient.tel || "",
        email: editClient.email || "",
        statut: editClient.statut || "actif",
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
            <FiUsers size={32} />
            Clients
          </h1>
          <div className="page-status-nav">
            {loading && clients.length === 0 && (
              <div className="page-status">
                <div className="page-status-loading">
                  <div className="page-spinner"></div>
                  <span>Chargement des clients...</span>
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
          id="client-form"
          title={
            <>
              {editClient ? <FiEdit2 size={20} /> : <FiPlus size={20} />}
              {editClient ? "Modifier le client" : "Nouveau client"}
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
                    <label className="page-label">Raison sociale</label>
                    <Field
                      name="rsoc"
                      type="text"
                      placeholder="Raison sociale du client"
                      className={`page-input ${
                        showErrors && errors.rsoc && touched.rsoc
                          ? "page-input--error"
                          : ""
                      }`}
                    />
                    {showErrors && (
                      <ErrorMessage
                        name="rsoc"
                        component="div"
                        className="page-error-message"
                      />
                    )}
                  </div>

                  <div>
                    <label className="page-label">Adresse</label>
                    <Field
                      name="adresse"
                      type="text"
                      placeholder="Adresse du client"
                      className={`page-input ${
                        showErrors && errors.adresse && touched.adresse
                          ? "page-input--error"
                          : ""
                      }`}
                    />
                    {showErrors && (
                      <ErrorMessage
                        name="adresse"
                        component="div"
                        className="page-error-message"
                      />
                    )}
                  </div>

                  <div>
                    <label className="page-label">Ville</label>
                    <Field
                      name="ville"
                      type="text"
                      placeholder="Ville du client"
                      className={`page-input ${
                        showErrors && errors.ville && touched.ville
                          ? "page-input--error"
                          : ""
                      }`}
                    />
                    {showErrors && (
                      <ErrorMessage
                        name="ville"
                        component="div"
                        className="page-error-message"
                      />
                    )}
                  </div>

                  <div>
                    <label className="page-label">Téléphone</label>
                    <Field
                      name="tel"
                      type="text"
                      placeholder="Téléphone du client"
                      className={`page-input ${
                        showErrors && errors.tel && touched.tel
                          ? "page-input--error"
                          : ""
                      }`}
                    />
                    {showErrors && (
                      <ErrorMessage
                        name="tel"
                        component="div"
                        className="page-error-message"
                      />
                    )}
                  </div>

                  <div>
                    <label className="page-label">Email</label>
                    <Field
                      name="email"
                      type="email"
                      placeholder="Email du client (optionnel)"
                      className={`page-input ${
                        showErrors && errors.email && touched.email
                          ? "page-input--error"
                          : ""
                      }`}
                    />
                    {showErrors && (
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="page-error-message"
                      />
                    )}
                  </div>

                  <div>
                    <label className="page-label">Statut</label>
                    <Field
                      name="statut"
                      as="select"
                      className={`page-input ${
                        showErrors && errors.statut && touched.statut
                          ? "page-input--error"
                          : ""
                      }`}
                    >
                      <option value="actif">Actif</option>
                      <option value="inactif">Inactif</option>
                    </Field>
                    {showErrors && (
                      <ErrorMessage
                        name="statut"
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
                      : editClient
                      ? "Modifier"
                      : "Ajouter"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </FormCard>
      )}

      {/* Liste des clients */}
      <div className="page-card">
        <div className="page-header">
          <h2 className="page-list-title">
            <FiUsers size={20} />
            Liste des clients ({filteredClients.length})
          </h2>
          <Button
            variant="primary"
            icon={<FiPlus size={16} />}
            onClick={handleNewClient}
          >
            Nouveau client
          </Button>
        </div>

        {/* Filtres */}
        <FilterContainer>
          <div className="filter-row">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Rechercher un client..."
            />
            <div className="filter-select">
              <select
                value={filterVille}
                onChange={(e) => setFilterVille(e.target.value)}
                className="page-input"
              >
                <option value="">Toutes les villes</option>
                {uniqueVilles.map((ville) => (
                  <option key={ville} value={ville}>
                    {ville}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </FilterContainer>

        {/* Tableau des données */}
        <DataTable
          data={filteredClients}
          columns={columns}
          emptyState={
            <div className="page-empty-state">
              <FiUsers
                size={48}
                style={{ marginBottom: "20px", opacity: 0.5 }}
              />
              <p>
                {searchTerm || filterVille
                  ? "Aucun client trouvé avec ces critères de recherche."
                  : "Aucun client trouvé. Créez votre premier client pour commencer."}
              </p>
            </div>
          }
          getRowClass={(client) => getRowClass(client.code, "clients")}
        />
      </div>

      {/* Overlay de chargement */}
      {loading && clients.length > 0 && (
        <div className="loading-overlay">
          <div className="page-spinner"></div>
        </div>
      )}
    </div>
  );
}
