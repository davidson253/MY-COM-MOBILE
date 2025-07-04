import { useEffect, useState } from "react";
import api from "../../services/api";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCreditCard,
  FiCalendar,
  FiEye,
  FiX,
  FiSave,
  FiUser,
  FiFileText,
  FiCheckCircle,
  FiDollarSign,
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

const TYPES_REGLEMENT = [
  "Espèces",
  "Chèque",
  "Virement",
  "Carte bancaire",
  "TPE",
  "Effet de commerce",
  "Retenue",
];

export default function Reglements() {
  const [reglements, setReglements] = useState([]);
  const [clients, setClients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalReglement, setModalReglement] = useState(null);
  const [editReglement, setEditReglement] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterClient, setFilterClient] = useState("");
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
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [reglementsData, clientsData] = await Promise.all([
        api.getReglements(),
        api.getClients(),
      ]);
      setReglements(reglementsData);
      setClients(clientsData);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setLoading(false);
    }
  };

  const validate = (values) => {
    const errors = {};
    if (!values.typereg) errors.typereg = "Type de règlement requis";
    if (!values.datereg) errors.datereg = "Date requise";
    if (!values.codecli) errors.codecli = "Client requis";
    if (!values.mtreg || values.mtreg <= 0) errors.mtreg = "Montant requis";

    // Validations spécifiques par type
    if (values.typereg === "Chèque" && !values.numcheff) {
      errors.numcheff = "Numéro de chèque requis";
    }
    if (values.typereg === "Virement" && !values.numpaiement) {
      errors.numpaiement = "Référence virement requise";
    }

    return errors;
  };

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    setShowErrors(true);
    setSubmitError("");
    setSubmitting(true);

    try {
      // Récupérer le nom du client
      const client = clients.find((c) => c.code === values.codecli);
      const dataToSend = { ...values, rscli: client?.rsoc || "" };

      if (editReglement) {
        await api.updateReglement(editReglement.numreg, dataToSend);
      } else {
        await api.createReglement(dataToSend);
      }

      setShowForm(false);
      setEditReglement(null);
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

  const handleEdit = (reglement) => {
    setEditReglement(reglement);
    setShowErrors(false);
    setSubmitError("");
    setShowForm(true);
    startEditing(reglement.numreg);

    setTimeout(() => {
      const formElement = document.getElementById("reglement-form");
      if (formElement) {
        formElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }
    }, 100);
  };

  const handleView = (reglement) => {
    setModalReglement(reglement);
    setShowModal(true);
    startViewing(reglement.numreg);
  };

  const handleDelete = async (numreg) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce règlement ?")) {
      try {
        await api.deleteReglement(numreg);
        await loadData();
        resetAllStatus();
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditReglement(null);
    setShowErrors(false);
    setSubmitError("");
    resetAllStatus();
  };

  const handleNewReglement = () => {
    setShowForm(true);
    setEditReglement(null);
    setShowErrors(false);
    setSubmitError("");
    resetAllStatus();
  };

  // Filtrage
  const filteredReglements = reglements.filter((reglement) => {
    const searchLower = searchTerm.toLowerCase();
    const client = clients.find((c) => c.code === reglement.codecli);

    const matchesSearch =
      !searchTerm ||
      reglement.numreg.toString().includes(searchLower) ||
      reglement.typereg.toLowerCase().includes(searchLower) ||
      (client && client.rsoc.toLowerCase().includes(searchLower)) ||
      reglement.datereg.includes(searchLower) ||
      reglement.mtreg.toString().includes(searchLower);

    const matchesType = !filterType || reglement.typereg === filterType;
    const matchesClient = !filterClient || reglement.codecli === filterClient;

    return matchesSearch && matchesType && matchesClient;
  });

  // Configuration des colonnes
  const columns = [
    {
      icon: <FiFileText size={16} />,
      title: "Numéro",
      dataKey: "numreg",
      render: (reglement) => (
        <CodeBadge
          code={`REG-${reglement.numreg}`}
          onClick={() => handleView(reglement)}
        />
      ),
    },
    {
      icon: <FiUser size={16} />,
      title: "Client",
      dataKey: "codecli",
      render: (reglement) => {
        const client = clients.find((c) => c.code === reglement.codecli);
        return client ? (
          <span className="page-name-cell">{client.rsoc}</span>
        ) : (
          <span className="page-no-data">Client introuvable</span>
        );
      },
    },
    {
      icon: <FiCreditCard size={16} />,
      title: "Type",
      dataKey: "typereg",
      render: (reglement) => (
        <DataBadge value={reglement.typereg} variant="secondary" />
      ),
    },
    {
      icon: <FiCalendar size={16} />,
      title: "Date",
      dataKey: "datereg",
      render: (reglement) => (
        <DataBadge value={reglement.datereg} variant="info" />
      ),
    },
    {
      icon: <DTIcon name="tunisian-dinar" size={16} />,
      title: "Montant (DT)",
      dataKey: "mtreg",
      render: (reglement) => (
        <div className="page-flex-container">
          <DTIcon name="tunisian-dinar" size={14} />
          <span style={{ fontWeight: "600", color: "var(--color-success)" }}>
            {parseFloat(reglement.mtreg).toFixed(3)}
          </span>
        </div>
      ),
    },
    {
      icon: <FiFileText size={16} />,
      title: "Référence",
      dataKey: "reference",
      render: (reglement) => {
        if (reglement.numcheff) {
          return (
            <DataBadge
              value={`Chèque: ${reglement.numcheff}`}
              variant="warning"
            />
          );
        }
        if (reglement.numpaiement) {
          return (
            <DataBadge value={`Réf: ${reglement.numpaiement}`} variant="info" />
          );
        }
        return <span className="page-no-data">Non renseigné</span>;
      },
    },
    {
      icon: null,
      title: "Actions",
      dataKey: "actions",
      render: (reglement) => (
        <ActionButtonGroup
          actions={[
            {
              icon: <FiEye size={14} />,
              label: "Voir",
              variant: "success",
              onClick: () => handleView(reglement),
            },
            {
              icon: <FiEdit2 size={14} />,
              label: "Modifier",
              variant: "warning",
              onClick: () => handleEdit(reglement),
            },
            {
              icon: <FiTrash2 size={14} />,
              label: "Supprimer",
              variant: "danger",
              onClick: () => handleDelete(reglement.numreg),
            },
          ]}
        />
      ),
    },
  ];

  const initialValues = {
    typereg: "",
    datereg: new Date().toISOString().split("T")[0],
    codecli: "",
    mtreg: "",
    numcheff: "",
    numpaiement: "",
    observations: "",
  };

  const getInitialValues = () => {
    if (editReglement) {
      return {
        typereg: editReglement.typereg || "",
        datereg:
          editReglement.datereg || new Date().toISOString().split("T")[0],
        codecli: editReglement.codecli || "",
        mtreg: editReglement.mtreg || "",
        numcheff: editReglement.numcheff || "",
        numpaiement: editReglement.numpaiement || "",
        observations: editReglement.observations || "",
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
            <FiCreditCard size={32} />
            Règlements
          </h1>
          <div className="page-status-nav">
            {loading && reglements.length === 0 && (
              <div className="page-status">
                <div className="page-status-loading">
                  <div className="page-spinner"></div>
                  <span>Chargement des règlements...</span>
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
          id="reglement-form"
          title={
            <>
              {editReglement ? <FiEdit2 size={20} /> : <FiPlus size={20} />}
              {editReglement ? "Modifier le règlement" : "Nouveau règlement"}
            </>
          }
        >
          <Formik
            initialValues={getInitialValues()}
            validate={validate}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting, errors, touched, values }) => (
              <Form>
                <div className="page-form-grid">
                  <div>
                    <label className="page-label">Client</label>
                    <Field
                      name="codecli"
                      as="select"
                      className={`page-input ${
                        showErrors && errors.codecli && touched.codecli
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
                        name="codecli"
                        component="div"
                        className="page-error-message"
                      />
                    )}
                  </div>

                  <div>
                    <label className="page-label">Type de règlement</label>
                    <Field
                      name="typereg"
                      as="select"
                      className={`page-input ${
                        showErrors && errors.typereg && touched.typereg
                          ? "page-input--error"
                          : ""
                      }`}
                    >
                      <option value="">Sélectionner un type</option>
                      {TYPES_REGLEMENT.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </Field>
                    {showErrors && (
                      <ErrorMessage
                        name="typereg"
                        component="div"
                        className="page-error-message"
                      />
                    )}
                  </div>

                  <div>
                    <label className="page-label">Date</label>
                    <Field
                      name="datereg"
                      type="date"
                      className={`page-input ${
                        showErrors && errors.datereg && touched.datereg
                          ? "page-input--error"
                          : ""
                      }`}
                    />
                    {showErrors && (
                      <ErrorMessage
                        name="datereg"
                        component="div"
                        className="page-error-message"
                      />
                    )}
                  </div>

                  <div>
                    <label className="page-label">Montant (DT)</label>
                    <Field
                      name="mtreg"
                      type="number"
                      step="0.001"
                      placeholder="Montant du règlement"
                      className={`page-input ${
                        showErrors && errors.mtreg && touched.mtreg
                          ? "page-input--error"
                          : ""
                      }`}
                    />
                    {showErrors && (
                      <ErrorMessage
                        name="mtreg"
                        component="div"
                        className="page-error-message"
                      />
                    )}
                  </div>

                  {/* Champs conditionnels selon le type */}
                  {values.typereg === "Chèque" && (
                    <div>
                      <label className="page-label">Numéro de chèque</label>
                      <Field
                        name="numcheff"
                        type="text"
                        placeholder="Numéro du chèque"
                        className={`page-input ${
                          showErrors && errors.numcheff && touched.numcheff
                            ? "page-input--error"
                            : ""
                        }`}
                      />
                      {showErrors && (
                        <ErrorMessage
                          name="numcheff"
                          component="div"
                          className="page-error-message"
                        />
                      )}
                    </div>
                  )}

                  {(values.typereg === "Virement" ||
                    values.typereg === "Carte bancaire") && (
                    <div>
                      <label className="page-label">
                        {values.typereg === "Virement"
                          ? "Référence virement"
                          : "Référence transaction"}
                      </label>
                      <Field
                        name="numpaiement"
                        type="text"
                        placeholder="Référence de la transaction"
                        className={`page-input ${
                          showErrors &&
                          errors.numpaiement &&
                          touched.numpaiement
                            ? "page-input--error"
                            : ""
                        }`}
                      />
                      {showErrors && (
                        <ErrorMessage
                          name="numpaiement"
                          component="div"
                          className="page-error-message"
                        />
                      )}
                    </div>
                  )}

                  <div className="full-width">
                    <label className="page-label">
                      Observations (optionnel)
                    </label>
                    <Field
                      name="observations"
                      as="textarea"
                      rows="3"
                      placeholder="Observations concernant ce règlement"
                      className="page-input"
                    />
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
                      : editReglement
                      ? "Modifier"
                      : "Ajouter"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </FormCard>
      )}

      {/* Liste des règlements */}
      <div className="page-card">
        <div className="page-header">
          <h2 className="page-list-title">
            <FiCreditCard size={20} />
            Liste des règlements ({filteredReglements.length})
          </h2>
          <Button
            variant="primary"
            icon={<FiPlus size={16} />}
            onClick={handleNewReglement}
          >
            Nouveau règlement
          </Button>
        </div>

        {/* Filtres */}
        <FilterContainer>
          <div className="filter-row">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Rechercher un règlement..."
            />
            <div className="filter-select">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="page-input"
              >
                <option value="">Tous les types</option>
                {TYPES_REGLEMENT.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
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
          data={filteredReglements}
          columns={columns}
          emptyState={
            <div className="page-empty-state">
              <FiCreditCard
                size={48}
                style={{ marginBottom: "20px", opacity: 0.5 }}
              />
              <p>
                {searchTerm || filterType || filterClient
                  ? "Aucun règlement trouvé avec ces critères de recherche."
                  : "Aucun règlement trouvé. Créez votre premier règlement pour commencer."}
              </p>
            </div>
          }
          getRowClass={(reglement) =>
            getRowClass(reglement.numreg, "reglements")
          }
        />
      </div>

      {/* Modal de détails */}
      {showModal && modalReglement && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                <FiCreditCard size={20} />
                Détails du règlement #{modalReglement.numreg}
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
                    {clients.find((c) => c.code === modalReglement.codecli)
                      ?.rsoc || "Client introuvable"}
                  </p>
                </div>
                <div>
                  <label className="page-label">Type</label>
                  <p>{modalReglement.typereg}</p>
                </div>
                <div>
                  <label className="page-label">Date</label>
                  <p>{modalReglement.datereg}</p>
                </div>
                <div>
                  <label className="page-label">Montant</label>
                  <p className="page-flex-container">
                    <DTIcon name="tunisian-dinar" size={16} />
                    <strong>
                      {parseFloat(modalReglement.mtreg).toFixed(3)} DT
                    </strong>
                  </p>
                </div>
                {modalReglement.numcheff && (
                  <div>
                    <label className="page-label">Numéro de chèque</label>
                    <p>{modalReglement.numcheff}</p>
                  </div>
                )}
                {modalReglement.numpaiement && (
                  <div>
                    <label className="page-label">Référence</label>
                    <p>{modalReglement.numpaiement}</p>
                  </div>
                )}
                {modalReglement.observations && (
                  <div className="full-width">
                    <label className="page-label">Observations</label>
                    <p>{modalReglement.observations}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overlay de chargement */}
      {loading && reglements.length > 0 && (
        <div className="loading-overlay">
          <div className="page-spinner"></div>
        </div>
      )}
    </div>
  );
}
