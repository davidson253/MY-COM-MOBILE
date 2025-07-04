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
  FiFileText,
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
} from "../../components/shared";
import "./styles/Common.css";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editClient, setEditClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterVille, setFilterVille] = useState("");

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
      const representantId = localStorage.getItem("representant_id"); // Récupérer l'ID du représentant depuis le stockage local
      const data = await api.getClients({ representant_id: representantId }); // Passer representant_id comme paramètre
      setClients(data);
    } catch (error) {
      console.error("Erreur lors du chargement des clients:", error);
    } finally {
      setLoading(false);
    }
  };

  const validate = (values) => {
    const errors = {};
    // Le code n'est plus requis car il est généré automatiquement
    if (!values.rsoc) errors.rsoc = "Raison sociale requise";
    if (!values.adresse) errors.adresse = "Adresse requise";
    if (!values.ville) errors.ville = "Ville requise";
    if (!values.tel) errors.tel = "Téléphone requis";
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.email = "Email invalide";
    }
    return errors;
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setLoading(true);
      if (editClient) {
        await api.updateClient(editClient.code, values);
      } else {
        // Pour la création, on n'envoie que les données du client (pas de code)
        await api.createClient(values);
      }

      setShowForm(false);
      setEditClient(null);
      resetAllStatus();
      await loadClients();
      resetForm();
    } catch (err) {
      console.error("Erreur lors de la sauvegarde:", err);

      // Extraire le message d'erreur approprié
      let errorMessage = "Erreur lors de la sauvegarde";

      if (err.response && err.response.data) {
        // Erreur HTTP avec response du serveur
        errorMessage =
          err.response.data.message || err.response.data.error || errorMessage;
      } else if (err.message) {
        // Erreur JavaScript standard
        errorMessage = err.message;
      }

      alert(`Erreur lors de la sauvegarde: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (client) => {
    startEditing(String(client.code));
    setEditClient(client);
    setShowForm(true);

    // Scroll vers le formulaire
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
    if (window.confirm("Supprimer ce client ?")) {
      try {
        await api.deleteClient(code);
        await loadClients();
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);

        let errorMessage = "Erreur lors de la suppression";

        if (error.response && error.response.data) {
          errorMessage =
            error.response.data.message ||
            error.response.data.error ||
            errorMessage;
        } else if (error.message) {
          errorMessage = error.message;
        }

        alert(`Erreur lors de la suppression: ${errorMessage}`);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditClient(null);
    resetAllStatus();
  };

  // Filtrer les clients
  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      String(client.code || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      client.rsoc?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.tel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesVille = !filterVille || client.ville === filterVille;

    return matchesSearch && matchesVille;
  });

  // Obtenir les villes uniques pour le filtre
  const villes = [
    ...new Set(clients.map((client) => client.ville).filter(Boolean)),
  ];

  return (
    <div className="clients-container theme-immersive-container">
      {/* En-tete */}
      <div className="clients-header">
        <div className="clients-header-main">
          <h1 className="clients-title">
            <FiUsers size={36} color="#06b6d4" />
            Gestion des Clients
          </h1>

          {/* Navigation et statut */}
          <div className="clients-status-nav">
            {loading && (
              <div className="clients-status">
                <div className="clients-status-loading">
                  <div className="clients-spinner"></div>
                  <span>Opération en cours...</span>
                </div>
              </div>
            )}

            {!showForm && (
              <Button
                variant="primary"
                icon={<FiPlus />}
                onClick={() => {
                  setShowForm(true);
                  setEditClient(null);

                  // Scroll vers le formulaire
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
                }}
              >
                Nouveau Client
              </Button>
            )}

            {showForm && (
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
          id="client-form"
          title={editClient ? "Modifier le client" : "Créer un nouveau client"}
          icon={editClient ? <FiEdit2 /> : <FiPlus />}
        >
          <Formik
            enableReinitialize
            initialValues={
              editClient
                ? {
                    rsoc: editClient.rsoc || "",
                    mf: editClient.mf || "",
                    adresse: editClient.adresse || "",
                    ville: editClient.ville || "",
                    tel: editClient.tel || "",
                    email: editClient.email || "",
                  }
                : {
                    rsoc: "",
                    mf: "",
                    adresse: "",
                    ville: "",
                    tel: "",
                    email: "",
                  }
            }
            validate={validate}
            onSubmit={handleSubmit}
          >
            {({ values }) => (
              <Form>
                <div className="clients-form-grid">
                  <div>
                    <Field
                      name="rsoc"
                      placeholder="Raison sociale"
                      className="clients-input"
                    />
                    <ErrorMessage
                      name="rsoc"
                      component="span"
                      className="clients-error-message"
                    />
                  </div>

                  <div>
                    <Field
                      name="mf"
                      placeholder="Matricule fiscal"
                      className="clients-input"
                    />
                    <ErrorMessage
                      name="mf"
                      component="span"
                      className="clients-error-message"
                    />
                  </div>

                  <div>
                    <Field
                      name="adresse"
                      placeholder="Adresse complète"
                      className="clients-input"
                    />
                    <ErrorMessage
                      name="adresse"
                      component="span"
                      className="clients-error-message"
                    />
                  </div>

                  <div>
                    <Field
                      name="ville"
                      placeholder="Ville"
                      className="clients-input"
                    />
                    <ErrorMessage
                      name="ville"
                      component="span"
                      className="clients-error-message"
                    />
                  </div>

                  <div>
                    <Field
                      name="tel"
                      placeholder="Téléphone"
                      className="clients-input"
                    />
                    <ErrorMessage
                      name="tel"
                      component="span"
                      className="clients-error-message"
                    />
                  </div>

                  <div>
                    <Field
                      name="email"
                      type="email"
                      placeholder="Email (optionnel)"
                      className="clients-input"
                    />
                    <ErrorMessage
                      name="email"
                      component="span"
                      className="clients-error-message"
                    />
                  </div>
                </div>

                <div className="clients-form-actions">
                  <Button
                    type="submit"
                    variant="primary"
                    icon={<FiSave />}
                    disabled={loading}
                    loading={loading}
                  >
                    {editClient ? "Modifier" : "Créer"} le client
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </FormCard>
      )}

      {/* Liste des clients */}
      <FormCard title={`Liste des Clients (${clients.length})`}>
        {/* Barre de recherche et filtres */}
        <FilterContainer
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Rechercher par code, raison sociale, téléphone ou email..."
          filters={[
            {
              key: "ville",
              icon: <FiFilter />,
              value: filterVille,
              onChange: setFilterVille,
              title: "Filtrer par ville",
              options: [
                { value: "", label: "Toutes les villes" },
                ...villes.map((ville) => ({ value: ville, label: ville })),
              ],
            },
          ]}
          hasActiveFilters={!!(searchTerm || filterVille)}
          onClearFilters={() => {
            setSearchTerm("");
            setFilterVille("");
          }}
        />

        <DataTable
          columns={[
            {
              key: "code",
              title: "Code",
              dataKey: "code",
              icon: <FiUsers />,
              render: (value, row) => (
                <CodeBadge
                  code={value}
                  isEditing={isEditing(String(value))}
                  isViewing={isViewing(String(value))}
                />
              ),
            },
            {
              key: "rsoc",
              title: "Raison Sociale",
              dataKey: "rsoc",
              icon: <FiUsers />,
              render: (value) => (
                <span className="clients-name-cell">{value}</span>
              ),
            },
            {
              key: "mf",
              title: "Matricule Fiscal",
              dataKey: "mf",
              icon: <FiFileText />,
              render: (value) => (
                <DataBadge variant="info">{value || "Non renseigné"}</DataBadge>
              ),
            },
            {
              key: "adresse",
              title: "Adresse",
              dataKey: "adresse",
              icon: <FiMapPin />,
              render: (value) => (
                <span className="clients-address-cell" title={value}>
                  {value && value.length > 30
                    ? `${value.substring(0, 30)}...`
                    : value || "Non renseignée"}
                </span>
              ),
            },
            {
              key: "ville",
              title: "Ville",
              dataKey: "ville",
              icon: <FiMapPin />,
              render: (value) => <DataBadge>{value}</DataBadge>,
            },
            {
              key: "tel",
              title: "Téléphone",
              dataKey: "tel",
              icon: <FiPhone />,
              render: (value) => (
                <a href={`tel:${value}`} className="clients-tel-link">
                  <FiPhone size={14} />
                  {value}
                </a>
              ),
            },
            {
              key: "email",
              title: "Email",
              dataKey: "email",
              icon: <FiMail />,
              render: (value) =>
                value ? (
                  <a href={`mailto:${value}`} className="clients-email-link">
                    <FiMail size={14} />
                    {value}
                  </a>
                ) : (
                  <span className="clients-no-data">-</span>
                ),
            },
            {
              key: "actions",
              title: "Actions",
              dataKey: "code",
              render: (value, row) => (
                <ActionButtonGroup
                  actions={[
                    {
                      key: "edit",
                      type: "edit",
                      label: "Modifier",
                      icon: <FiEdit2 />,
                      onClick: () => handleEdit(row),
                      disabled:
                        isEditing(String(value)) || isViewing(String(value)),
                      title: "Modifier le client",
                    },
                    {
                      key: "delete",
                      type: "delete",
                      label: "Supprimer",
                      icon: <FiTrash2 />,
                      onClick: () => handleDelete(value),
                      disabled:
                        isEditing(String(value)) || isViewing(String(value)),
                      title: "Supprimer le client",
                    },
                  ]}
                />
              ),
            },
          ]}
          data={filteredClients}
          getRowClass={(row) => getRowClass(String(row.code), "clients")}
          emptyState={
            <div className="clients-empty-state">
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
        />
      </FormCard>

      {loading && clients.length > 0 && (
        <div className="clients-loading-overlay">
          <div className="clients-spinner"></div>
        </div>
      )}
    </div>
  );
}
