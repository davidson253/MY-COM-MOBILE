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
  FiSearch,
  FiFilter,
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
import StatusIndicator from "../../components/StatusIndicator";
import { useStatusManager } from "../../hooks/useStatusManager";

// CSS avec système de thème centralisé
import "./styles/Common.css";
import "./job/styles/SharedPageStyles.css";

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
  const [editReglement, setEditReglement] = useState(null);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("list"); // 'list', 'details'

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
    api.getReglements().then(setReglements);
    api.getClients().then(setClients);
  }, []);

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

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setLoading(true);
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
      resetAllStatus(); // Utiliser la fonction du hook
      setDetails(null);
      setViewMode("list");
      api.getReglements().then(setReglements);
      resetForm();
    } catch (err) {
      alert("Erreur lors de la sauvegarde");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (reglement) => {
    startEditing(reglement.numreg); // Utiliser la fonction du hook
    setEditReglement(reglement);
    setShowForm(true);
    setDetails(null);
    setViewMode("list");
  };

  const handleDelete = async (numreg) => {
    if (window.confirm("Supprimer ce règlement ?")) {
      await api.deleteReglement(numreg);
      api.getReglements().then(setReglements);
      setDetails(null);
      setViewMode("list");
    }
  };

  const showDetails = (reglement) => {
    setDetails(reglement);
    startViewing(reglement.numreg); // Utiliser la fonction du hook
    setViewMode("details");
    setShowForm(false);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditReglement(null);
    resetAllStatus(); // Utiliser la fonction du hook
    setDetails(null);
    setViewMode("list");
  };

  const handleBackToList = () => {
    setDetails(null);
    stopViewing(); // Utiliser la fonction du hook
    setViewMode("list");
    setShowForm(false);
  };

  const renderSpecificFields = (values, setFieldValue) => {
    const { typereg } = values;

    if (typereg === "Chèque") {
      return (
        <>
          <div className="form-group">
            <label className="form-label">Numéro de chèque *</label>
            <Field
              name="numcheff"
              placeholder="Numéro de chèque"
              className="form-input"
            />
            <ErrorMessage
              name="numcheff"
              component="span"
              className="form-error"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Signataire</label>
            <Field
              name="signataire"
              placeholder="Signataire"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Banque</label>
            <Field name="banque" placeholder="Banque" className="form-input" />
          </div>

          <div className="form-group">
            <label className="form-label">Date d'échéance</label>
            <Field
              type="date"
              name="dateech"
              placeholder="Date d'échéance"
              className="form-input"
            />
          </div>
        </>
      );
    }

    if (typereg === "Virement") {
      return (
        <>
          <div className="form-group">
            <label className="form-label">Référence virement *</label>
            <Field
              name="numpaiement"
              placeholder="Référence virement"
              className="form-input"
            />
            <ErrorMessage
              name="numpaiement"
              component="span"
              className="form-error"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Banque</label>
            <Field name="banque" placeholder="Banque" className="form-input" />
          </div>

          <div className="form-group">
            <label className="form-label">Numéro bordereau</label>
            <Field
              name="numbord"
              placeholder="Numéro bordereau"
              className="form-input"
            />
          </div>
        </>
      );
    }

    if (typereg === "Carte bancaire" || typereg === "TPE") {
      return (
        <>
          <div className="form-group">
            <label className="form-label">Numéro transaction</label>
            <Field
              name="numpaiement"
              placeholder="Numéro transaction"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Banque émettrice</label>
            <Field
              name="banque"
              placeholder="Banque émettrice"
              className="form-input"
            />
          </div>
        </>
      );
    }

    if (typereg === "Effet de commerce") {
      return (
        <>
          <div className="form-group">
            <label className="form-label">Numéro effet</label>
            <Field
              name="numcheff"
              placeholder="Numéro effet"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Date d'échéance</label>
            <Field
              type="date"
              name="dateech"
              placeholder="Date d'échéance"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Signataire</label>
            <Field
              name="signataire"
              placeholder="Signataire"
              className="form-input"
            />
          </div>
        </>
      );
    }

    return null;
  };

  // Configuration des colonnes pour la table
  const columns = [
    {
      icon: <FiFileText size={16} />,
      title: "N°",
      dataKey: "numreg",
      render: (reglement) => (
        <CodeBadge
          code={`#${reglement.numreg}`}
          onClick={() => startViewing(reglement.numreg)}
        />
      ),
    },
    {
      icon: <FiCalendar size={16} />,
      title: "Date",
      dataKey: "datereg",
      render: (reglement) => reglement.datereg?.slice(0, 10),
    },
    {
      icon: <FiCreditCard size={16} />,
      title: "Type",
      dataKey: "typereg",
      render: (reglement) => (
        <DataBadge value={reglement.typereg} variant="primary" />
      ),
    },
    {
      icon: <FiUser size={16} />,
      title: "Client",
      dataKey: "rsoc",
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
      title: "Description",
      dataKey: "description",
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
              label: "Voir détails",
              variant: "view",
              onClick: () => showDetails(reglement),
            },
            {
              icon: <FiEdit2 size={14} />,
              label: "Modifier",
              variant: "edit",
              onClick: () => handleEdit(reglement),
            },
            {
              icon: <FiTrash2 size={14} />,
              label: "Supprimer",
              variant: "delete",
              onClick: () => handleDelete(reglement.numreg),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="page-container">
      {/* Header avec titre et actions */}
      <div className="page-header">
        <div className="page-header-content">
          <div className="page-title-section">
            <div className="page-title-wrapper">
              <div className="page-icon">
                <FiCreditCard />
              </div>
              <div>
                <h1 className="page-title">Gestion des Règlements</h1>
                <p className="page-subtitle">
                  Suivi et gestion des paiements clients
                </p>
              </div>
            </div>
          </div>

          <div className="page-actions">
            {viewMode === "list" && !showForm && (
              <Button
                onClick={() => {
                  setShowForm(true);
                  setEditReglement(null);
                  setDetails(null);
                }}
                variant="primary"
                icon={<FiPlus />}
              >
                Nouveau Règlement
              </Button>
            )}

            {viewMode === "list" && showForm && (
              <Button onClick={handleCancel} variant="secondary" icon={<FiX />}>
                Annuler
              </Button>
            )}

            {viewMode === "details" && (
              <Button
                onClick={handleBackToList}
                variant="secondary"
                icon={<FiX />}
              >
                Retour à la liste
              </Button>
            )}
          </div>
        </div>

        {/* Indicateur de chargement */}
        {loading && (
          <div className="page-loading">
            <div className="page-loading-spinner"></div>
            <span>Opération en cours...</span>
          </div>
        )}
      </div>

      {/* Formulaire d'ajout/modification */}
      {showForm && (
        <div className="page-card">
          <div className="form-card">
            <div className="form-header">
              <h3 className="form-title">
                {editReglement ? <FiEdit2 /> : <FiPlus />}
                {editReglement
                  ? "Modifier le règlement"
                  : "Créer un nouveau règlement"}
              </h3>
            </div>

            <Formik
              enableReinitialize
              initialValues={
                editReglement
                  ? {
                      typereg: editReglement.typereg || "",
                      datereg: editReglement.datereg?.slice(0, 10) || "",
                      codecli: editReglement.codecli || "",
                      mtreg: editReglement.mtreg || "",
                      description: editReglement.description || "",
                      numfact: editReglement.numfact || "",
                      numcheff: editReglement.numcheff || "",
                      signataire: editReglement.signataire || "",
                      banque: editReglement.banque || "",
                      dateech: editReglement.dateech?.slice(0, 10) || "",
                      numpaiement: editReglement.numpaiement || "",
                      numbord: editReglement.numbord || "",
                    }
                  : {
                      typereg: "",
                      datereg: new Date().toISOString().slice(0, 10),
                      codecli: "",
                      mtreg: "",
                      description: "",
                      numfact: "",
                      numcheff: "",
                      signataire: "",
                      banque: "",
                      dateech: "",
                      numpaiement: "",
                      numbord: "",
                    }
              }
              validate={validate}
              onSubmit={handleSubmit}
            >
              {({ values, setFieldValue }) => (
                <Form>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Type de règlement *</label>
                      <Field as="select" name="typereg" className="form-input">
                        <option value="">-- Type de règlement --</option>
                        {TYPES_REGLEMENT.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="typereg"
                        component="span"
                        className="form-error"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Client *</label>
                      <Field as="select" name="codecli" className="form-input">
                        <option value="">-- Client --</option>
                        {clients.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.rsoc}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="codecli"
                        component="span"
                        className="form-error"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Date du règlement *</label>
                      <Field
                        type="date"
                        name="datereg"
                        className="form-input"
                      />
                      <ErrorMessage
                        name="datereg"
                        component="span"
                        className="form-error"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Montant *</label>
                      <Field
                        type="number"
                        step="0.01"
                        name="mtreg"
                        placeholder="Montant"
                        className="form-input"
                      />
                      <ErrorMessage
                        name="mtreg"
                        component="span"
                        className="form-error"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Description</label>
                      <Field
                        name="description"
                        placeholder="Description"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Numéro facture</label>
                      <Field
                        name="numfact"
                        placeholder="Numéro facture (optionnel)"
                        className="form-input"
                      />
                    </div>

                    {renderSpecificFields(values, setFieldValue)}
                  </div>

                  <div className="form-actions">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={loading}
                      icon={<FiSave />}
                    >
                      {loading
                        ? "En cours..."
                        : editReglement
                        ? "Modifier"
                        : "Créer"}{" "}
                      le règlement
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleCancel}
                      icon={<FiX />}
                    >
                      Annuler
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {/* Vue détaillée */}
      {viewMode === "details" && details && (
        <div className="page-card">
          <div className="detail-header">
            <div className="detail-title-section">
              <h3 className="detail-title">
                <FiCheckCircle />
                Règlement #{details.numreg}
              </h3>
            </div>

            <div className="detail-badges">
              <DataBadge value={details.typereg} variant="primary" />
              <div className="price-badge">
                <DTIcon name="tunisian-dinar" size={16} />
                <span>{parseFloat(details.mtreg).toFixed(3)} DT</span>
              </div>
            </div>
          </div>

          <div className="detail-actions">
            <ActionButtonGroup
              actions={[
                {
                  icon: <FiEdit2 size={16} />,
                  label: "Modifier",
                  variant: "edit",
                  onClick: () => handleEdit(details),
                },
                {
                  icon: <FiTrash2 size={16} />,
                  label: "Supprimer",
                  variant: "delete",
                  onClick: () => handleDelete(details.numreg),
                },
              ]}
            />
          </div>

          <div className="detail-content">
            <div className="detail-section">
              <h4 className="detail-section-title">
                <FiUser />
                Informations générales
              </h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Client :</span>
                  <span className="detail-value">{details.rsoc}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Date :</span>
                  <span className="detail-value">
                    {details.datereg?.slice(0, 10)}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Type :</span>
                  <span className="detail-value">
                    <DataBadge value={details.typereg} variant="secondary" />
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Montant :</span>
                  <span className="detail-value price-value">
                    <DTIcon name="tunisian-dinar" size={14} />
                    {parseFloat(details.mtreg).toFixed(3)} DT
                  </span>
                </div>
                {details.description && (
                  <div className="detail-item detail-item--full">
                    <span className="detail-label">Description :</span>
                    <span className="detail-value">{details.description}</span>
                  </div>
                )}
                {details.numfact && (
                  <div className="detail-item">
                    <span className="detail-label">N° Facture :</span>
                    <span className="detail-value">{details.numfact}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Section détails du paiement */}
            {(details.numcheff ||
              details.numpaiement ||
              details.banque ||
              details.dateech ||
              details.signataire ||
              details.numbord) && (
              <div className="detail-section">
                <h4 className="detail-section-title">
                  <FiCreditCard />
                  Détails du paiement
                </h4>
                <div className="detail-grid">
                  {details.numcheff && (
                    <div className="detail-item">
                      <span className="detail-label">
                        {details.typereg === "Effet de commerce"
                          ? "N° Effet :"
                          : "N° Chèque :"}
                      </span>
                      <span className="detail-value">{details.numcheff}</span>
                    </div>
                  )}
                  {details.numpaiement && (
                    <div className="detail-item">
                      <span className="detail-label">
                        {details.typereg === "Virement"
                          ? "Référence virement :"
                          : "N° Transaction :"}
                      </span>
                      <span className="detail-value">
                        {details.numpaiement}
                      </span>
                    </div>
                  )}
                  {details.banque && (
                    <div className="detail-item">
                      <span className="detail-label">Banque :</span>
                      <span className="detail-value">{details.banque}</span>
                    </div>
                  )}
                  {details.dateech && (
                    <div className="detail-item">
                      <span className="detail-label">Date d'échéance :</span>
                      <span className="detail-value">
                        {details.dateech?.slice(0, 10)}
                      </span>
                    </div>
                  )}
                  {details.signataire && (
                    <div className="detail-item">
                      <span className="detail-label">Signataire :</span>
                      <span className="detail-value">{details.signataire}</span>
                    </div>
                  )}
                  {details.numbord && (
                    <div className="detail-item">
                      <span className="detail-label">N° Bordereau :</span>
                      <span className="detail-value">{details.numbord}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Liste des règlements - toujours visible */}
      {(viewMode === "list" || viewMode === "details") && (
        <div className="page-card">
          <div className="page-card-header">
            <h3 className="page-card-title">
              Liste des Règlements ({reglements.length})
            </h3>
          </div>

          {reglements.length === 0 ? (
            <div className="page-empty-state">
              <FiFileText size={48} className="page-empty-icon" />
              <p className="page-empty-text">
                Aucun règlement trouvé. Créez votre premier règlement pour
                commencer.
              </p>
            </div>
          ) : (
            <DataTable
              data={reglements}
              columns={columns}
              rowKey="numreg"
              className="page-data-table"
              emptyText="Aucun règlement trouvé."
              loading={loading}
              onRowClick={(row) => showDetails(row)}
            />
          )}
        </div>
      )}
    </div>
  );
}
