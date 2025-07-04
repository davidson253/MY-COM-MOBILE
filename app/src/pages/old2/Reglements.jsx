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
import "./styles/Common.css";
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

const DEVISES = [
  { code: "TND", nom: "Dinar Tunisien" },
  { code: "EUR", nom: "Euro" },
  { code: "USD", nom: "Dollar US" },
  { code: "DZD", nom: "Dinar Algérien" },
  { code: "MAD", nom: "Dirham Marocain" },
];

const STATUTS_ENCAISSEMENT = [
  { code: 0, label: "Non encaissé", variant: "warning" },
  { code: 1, label: "Encaissé", variant: "success" },
  { code: 2, label: "Retourné", variant: "danger" },
];

// Champs requis selon le type de règlement
const CHAMPS_REQUIS = {
  Espèces: ["typereg", "datereg", "mtreg", "codecli"],
  Chèque: [
    "typereg",
    "datereg",
    "mtreg",
    "codecli",
    "numcheff",
    "signataire",
    "banque",
  ],
  Virement: ["typereg", "datereg", "mtreg", "codecli", "numpaiement"],
  "Carte bancaire": ["typereg", "datereg", "mtreg", "codecli", "numpaiement"],
  TPE: ["typereg", "datereg", "mtreg", "codecli", "numpaiement"],
  "Effet de commerce": [
    "typereg",
    "datereg",
    "mtreg",
    "codecli",
    "numcheff",
    "dateech",
    "banque",
  ],
  Retenue: ["typereg", "datereg", "mtreg", "codecli", "description"],
};

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

  const isTokenValid = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      console.error("Erreur lors de la vérification du token:", error);
      return false;
    }
  };

  useEffect(() => {
    if (isTokenValid()) {
      loadData();
    } else {
      console.warn(
        "Token invalide ou expiré. Redirection vers la page de login."
      );
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const representantId = localStorage.getItem("representant_id"); // Récupérer l'ID du représentant depuis le stockage local
      const [reglementsData, clientsData] = await Promise.all([
        api.getReglements({ representant_id: representantId }), // Passer representant_id comme paramètre
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

    // Validations de base pour tous les types
    if (!values.typereg) errors.typereg = "Type de règlement requis";
    if (!values.datereg) errors.datereg = "Date requise";
    if (!values.codecli) errors.codecli = "Client requis";
    if (!values.mtreg || values.mtreg <= 0) errors.mtreg = "Montant requis";

    // Validations spécifiques selon le type de règlement
    const champsRequis = CHAMPS_REQUIS[values.typereg] || [];

    champsRequis.forEach((champ) => {
      if (
        !values[champ] ||
        (typeof values[champ] === "string" && values[champ].trim() === "")
      ) {
        switch (champ) {
          case "numcheff":
            errors.numcheff =
              values.typereg === "Chèque"
                ? "Numéro de chèque requis"
                : "Numéro d'effet requis";
            break;
          case "signataire":
            errors.signataire = "Signataire requis";
            break;
          case "banque":
            errors.banque = "Banque requise";
            break;
          case "numpaiement":
            errors.numpaiement =
              values.typereg === "Virement"
                ? "Référence virement requise"
                : "Numéro de transaction requis";
            break;
          case "dateech":
            errors.dateech = "Date d'échéance requise";
            break;
          case "description":
            errors.description =
              "Description requise pour ce type de règlement";
            break;
        }
      }
    });

    // Validations métier
    if (
      values.dateech &&
      values.datereg &&
      new Date(values.dateech) < new Date(values.datereg)
    ) {
      errors.dateech =
        "La date d'échéance ne peut pas être antérieure à la date de règlement";
    }

    if (values.taux && (values.taux <= 0 || values.taux > 1000)) {
      errors.taux = "Taux de change invalide";
    }

    if (values.fraisb && values.fraisb < 0) {
      errors.fraisb = "Les frais bancaires ne peuvent pas être négatifs";
    }

    return errors;
  };

  // Fonction pour déterminer les champs à afficher selon le type
  const getFieldsToShow = (typeReg) => {
    const base = {
      showNumCheff: false,
      showSignataire: false,
      showBanque: false,
      showDateEch: false,
      showNumPaiement: false,
      showNumBord: false,
      showDevise: true,
      showFrais: false,
    };

    switch (typeReg) {
      case "Chèque":
        return {
          ...base,
          showNumCheff: true,
          showSignataire: true,
          showBanque: true,
          showDateEch: true,
          showFrais: true,
        };
      case "Effet de commerce":
        return {
          ...base,
          showNumCheff: true,
          showSignataire: true,
          showBanque: true,
          showDateEch: true,
          showFrais: true,
        };
      case "Virement":
        return {
          ...base,
          showNumPaiement: true,
          showNumBord: true,
          showBanque: true,
          showFrais: true,
        };
      case "Carte bancaire":
      case "TPE":
        return {
          ...base,
          showNumPaiement: true,
          showBanque: true,
          showFrais: true,
        };
      case "Retenue":
        return {
          ...base,
          showDevise: false,
        };
      default:
        return base;
    }
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
    if (!reglement) return false;

    const searchLower = searchTerm.toLowerCase();
    // Adaptation pour le nouveau format de code client (string vs string)
    const client = clients.find((c) => c.code === reglement.codecli);

    const matchesSearch =
      !searchTerm ||
      reglement.numreg.toString().includes(searchLower) ||
      reglement.typereg.toLowerCase().includes(searchLower) ||
      (client && client.rsoc.toLowerCase().includes(searchLower)) ||
      reglement.datereg.includes(searchLower) ||
      reglement.mtreg.toString().includes(searchLower);

    const matchesType = !filterType || reglement.typereg === filterType;
    // Adaptation pour le nouveau format de code client (string vs string)
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
          code={`REG-${reglement?.numreg || "N/A"}`}
          onClick={() => reglement && handleView(reglement)}
        />
      ),
    },
    {
      icon: <FiUser size={16} />,
      title: "Client",
      dataKey: "codecli",
      render: (reglement) => {
        if (!reglement)
          return <span className="page-no-data">Données manquantes</span>;
        const client = clients.find((c) => c.code === reglement.codecli);
        return client ? (
          <span className="page-name-cell">{client.rsoc}</span>
        ) : (
          <span className="page-no-data">Client introuvable</span>
        );
      },
    },
    {
      icon: <FiUser size={16} />,
      title: "Représentant",
      dataKey: "representant",
      render: (reglement) => (
        <div className="representant-info">
          <div style={{ fontWeight: "600", color: "var(--color-primary)" }}>
            {reglement?.coderep || "N/A"}
          </div>
          <div
            style={{ fontSize: "0.85em", color: "var(--color-text-secondary)" }}
          >
            {reglement?.librep || ""}
          </div>
        </div>
      ),
    },
    {
      icon: <FiCreditCard size={16} />,
      title: "Type",
      dataKey: "typereg",
      render: (reglement) => {
        const getVariant = (type) => {
          switch (type) {
            case "Espèces":
              return "success";
            case "Chèque":
              return "warning";
            case "Virement":
              return "info";
            case "Carte bancaire":
            case "TPE":
              return "primary";
            default:
              return "secondary";
          }
        };
        return (
          <DataBadge
            value={reglement?.typereg || "N/A"}
            variant={getVariant(reglement?.typereg)}
          />
        );
      },
    },
    {
      icon: <FiCalendar size={16} />,
      title: "Date",
      dataKey: "datereg",
      render: (reglement) => (
        <DataBadge value={reglement?.datereg || "N/A"} variant="info" />
      ),
    },
    {
      icon: <DTIcon name="tunisian-dinar" size={16} />,
      title: "Montant",
      dataKey: "mtreg",
      render: (reglement) => (
        <div className="page-flex-container">
          <DTIcon name="tunisian-dinar" size={14} />
          <span style={{ fontWeight: "600", color: "var(--color-success)" }}>
            {parseFloat(reglement?.mtreg || 0).toFixed(3)}
          </span>
          {reglement?.devise && reglement.devise !== "TND" && (
            <span
              style={{
                fontSize: "0.8em",
                marginLeft: "4px",
                color: "var(--color-text-muted)",
              }}
            >
              {reglement.devise}
            </span>
          )}
        </div>
      ),
    },
    {
      icon: <FiFileText size={16} />,
      title: "Référence",
      dataKey: "reference",
      render: (reglement) => {
        if (!reglement)
          return <span className="page-no-data">Données manquantes</span>;

        if (reglement.numcheff) {
          return (
            <DataBadge
              value={`${
                reglement.typereg === "Effet de commerce" ? "Effet" : "Chèque"
              }: ${reglement.numcheff}`}
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
      icon: <FiCheckCircle size={16} />,
      title: "Banque",
      dataKey: "banque",
      render: (reglement) => {
        if (!reglement?.banque) {
          return <span className="page-no-data">-</span>;
        }
        return <DataBadge value={reglement.banque} variant="secondary" />;
      },
    },
    {
      icon: <FiCalendar size={16} />,
      title: "Échéance",
      dataKey: "dateech",
      render: (reglement) => {
        if (!reglement?.dateech) {
          return <span className="page-no-data">-</span>;
        }
        const isEchue = new Date(reglement.dateech) < new Date();
        return (
          <DataBadge
            value={reglement.dateech}
            variant={isEchue ? "danger" : "info"}
          />
        );
      },
    },
    {
      icon: <FiCheckCircle size={16} />,
      title: "Statut",
      dataKey: "statut",
      render: (reglement) => {
        if (!reglement) return <span className="page-no-data">-</span>;

        const statuts = [];
        if (reglement.enc === 1) statuts.push("Encaissé");
        if (reglement.rap === 1) statuts.push("Rapproché");
        if (reglement.vers === 1) statuts.push("Versé");
        if (reglement.integ === 1) statuts.push("Intégré");

        if (statuts.length === 0) {
          return <DataBadge value="En attente" variant="warning" />;
        }

        const statusText = statuts.join(" • ");
        const variant = reglement.enc === 1 ? "success" : "info";

        return <DataBadge value={statusText} variant={variant} />;
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
              variant: "view",
              onClick: () => reglement && handleView(reglement),
            },
            {
              icon: <FiEdit2 size={14} />,
              label: "Modifier",
              variant: "edit",
              onClick: () => reglement && handleEdit(reglement),
            },
            {
              icon: <FiTrash2 size={14} />,
              label: "Supprimer",
              variant: "delete",
              onClick: () => reglement && handleDelete(reglement.numreg),
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
    // Nouveaux champs métiers
    numfact: "",
    description: "",
    signataire: "",
    banque: "",
    ville: "",
    dateech: "",
    numbord: "",
    codebanq: "",
    devise: "TND",
    taux: 1,
    fraisb: 0,
    // Statuts
    enc: 0,
    rap: 0,
    vers: 0,
    integ: 0,
    imp: 0,
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
        // Nouveaux champs métiers
        numfact: editReglement.numfact || "",
        description: editReglement.description || "",
        signataire: editReglement.signataire || "",
        banque: editReglement.banque || "",
        ville: editReglement.ville || "",
        dateech: editReglement.dateech || "",
        numbord: editReglement.numbord || "",
        codebanq: editReglement.codebanq || "",
        devise: editReglement.devise || "TND",
        taux: editReglement.taux || 1,
        fraisb: editReglement.fraisb || 0,
        // Statuts
        enc: editReglement.enc || 0,
        rap: editReglement.rap || 0,
        vers: editReglement.vers || 0,
        integ: editReglement.integ || 0,
        imp: editReglement.imp || 0,
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
            {({ isSubmitting, errors, touched, values }) => {
              const fieldsToShow = getFieldsToShow(values.typereg);

              return (
                <Form>
                  <div className="page-form-grid">
                    {/* Champs de base - toujours affichés */}
                    <div>
                      <label className="page-label">Client *</label>
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
                      <label className="page-label">Type de règlement *</label>
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
                      <label className="page-label">Date *</label>
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
                      <label className="page-label">Montant *</label>
                      <div className="page-input-with-icon">
                        <Field
                          name="mtreg"
                          type="number"
                          step="0.001"
                          placeholder="0.000"
                          className={`page-input ${
                            showErrors && errors.mtreg && touched.mtreg
                              ? "page-input--error"
                              : ""
                          }`}
                        />
                        <DTIcon name="tunisian-dinar" size={16} />
                      </div>
                      {showErrors && (
                        <ErrorMessage
                          name="mtreg"
                          component="div"
                          className="page-error-message"
                        />
                      )}
                    </div>

                    {/* Numéro de facture - optionnel */}
                    <div>
                      <label className="page-label">
                        N° Facture (optionnel)
                      </label>
                      <Field
                        name="numfact"
                        type="text"
                        placeholder="Numéro de facture"
                        className="page-input"
                      />
                    </div>

                    {/* Champs spécifiques aux chèques et effets */}
                    {fieldsToShow.showNumCheff && (
                      <div>
                        <label className="page-label">
                          {values.typereg === "Effet de commerce"
                            ? "N° Effet *"
                            : "N° Chèque *"}
                        </label>
                        <Field
                          name="numcheff"
                          type="text"
                          placeholder={`Numéro du ${
                            values.typereg === "Effet de commerce"
                              ? "effet"
                              : "chèque"
                          }`}
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

                    {fieldsToShow.showSignataire && (
                      <div>
                        <label className="page-label">Signataire *</label>
                        <Field
                          name="signataire"
                          type="text"
                          placeholder="Nom du signataire"
                          className={`page-input ${
                            showErrors &&
                            errors.signataire &&
                            touched.signataire
                              ? "page-input--error"
                              : ""
                          }`}
                        />
                        {showErrors && (
                          <ErrorMessage
                            name="signataire"
                            component="div"
                            className="page-error-message"
                          />
                        )}
                      </div>
                    )}

                    {fieldsToShow.showDateEch && (
                      <div>
                        <label className="page-label">
                          Date d'échéance{" "}
                          {values.typereg === "Effet de commerce" ? "*" : ""}
                        </label>
                        <Field
                          name="dateech"
                          type="date"
                          className={`page-input ${
                            showErrors && errors.dateech && touched.dateech
                              ? "page-input--error"
                              : ""
                          }`}
                        />
                        {showErrors && (
                          <ErrorMessage
                            name="dateech"
                            component="div"
                            className="page-error-message"
                          />
                        )}
                      </div>
                    )}

                    {/* Champs pour les paiements électroniques */}
                    {fieldsToShow.showNumPaiement && (
                      <div>
                        <label className="page-label">
                          {values.typereg === "Virement"
                            ? "Référence virement *"
                            : values.typereg === "TPE"
                            ? "N° Transaction TPE *"
                            : "N° Transaction *"}
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

                    {fieldsToShow.showNumBord && (
                      <div>
                        <label className="page-label">N° Bordereau</label>
                        <Field
                          name="numbord"
                          type="text"
                          placeholder="Numéro de bordereau"
                          className="page-input"
                        />
                      </div>
                    )}

                    {/* Informations bancaires */}
                    {fieldsToShow.showBanque && (
                      <>
                        <div>
                          <label className="page-label">
                            Banque{" "}
                            {values.typereg === "Chèque" ||
                            values.typereg === "Effet de commerce"
                              ? "*"
                              : ""}
                          </label>
                          <Field
                            name="banque"
                            type="text"
                            placeholder="Nom de la banque"
                            className={`page-input ${
                              showErrors && errors.banque && touched.banque
                                ? "page-input--error"
                                : ""
                            }`}
                          />
                          {showErrors && (
                            <ErrorMessage
                              name="banque"
                              component="div"
                              className="page-error-message"
                            />
                          )}
                        </div>

                        <div>
                          <label className="page-label">Code banque</label>
                          <Field
                            name="codebanq"
                            type="text"
                            placeholder="Code de la banque"
                            className="page-input"
                          />
                        </div>

                        <div>
                          <label className="page-label">Ville banque</label>
                          <Field
                            name="ville"
                            type="text"
                            placeholder="Ville de la banque"
                            className="page-input"
                          />
                        </div>
                      </>
                    )}

                    {/* Devise et taux de change */}
                    {fieldsToShow.showDevise && (
                      <>
                        <div>
                          <label className="page-label">Devise</label>
                          <Field
                            name="devise"
                            as="select"
                            className="page-input"
                          >
                            {DEVISES.map((devise) => (
                              <option key={devise.code} value={devise.code}>
                                {devise.nom} ({devise.code})
                              </option>
                            ))}
                          </Field>
                        </div>

                        {values.devise !== "TND" && (
                          <div>
                            <label className="page-label">Taux de change</label>
                            <Field
                              name="taux"
                              type="number"
                              step="0.0001"
                              min="0"
                              placeholder="1.0000"
                              className={`page-input ${
                                showErrors && errors.taux && touched.taux
                                  ? "page-input--error"
                                  : ""
                              }`}
                            />
                            {showErrors && (
                              <ErrorMessage
                                name="taux"
                                component="div"
                                className="page-error-message"
                              />
                            )}
                          </div>
                        )}
                      </>
                    )}

                    {/* Frais bancaires */}
                    {fieldsToShow.showFrais && (
                      <div>
                        <label className="page-label">Frais bancaires</label>
                        <div className="page-input-with-icon">
                          <Field
                            name="fraisb"
                            type="number"
                            step="0.001"
                            min="0"
                            placeholder="0.000"
                            className={`page-input ${
                              showErrors && errors.fraisb && touched.fraisb
                                ? "page-input--error"
                                : ""
                            }`}
                          />
                          <DTIcon name="tunisian-dinar" size={16} />
                        </div>
                        {showErrors && (
                          <ErrorMessage
                            name="fraisb"
                            component="div"
                            className="page-error-message"
                          />
                        )}
                      </div>
                    )}

                    {/* Description/observations */}
                    <div className="page-span-full">
                      <label className="page-label">
                        Description/Observations{" "}
                        {values.typereg === "Retenue" ? "*" : ""}
                      </label>
                      <Field
                        name="description"
                        as="textarea"
                        rows="3"
                        placeholder="Notes et observations sur ce règlement..."
                        className={`page-input ${
                          showErrors &&
                          errors.description &&
                          touched.description
                            ? "page-input--error"
                            : ""
                        }`}
                      />
                      {showErrors && (
                        <ErrorMessage
                          name="description"
                          component="div"
                          className="page-error-message"
                        />
                      )}
                    </div>

                    {/* Statuts de gestion - seulement en modification */}
                    {editReglement && (
                      <>
                        <div className="page-span-full">
                          <h4
                            style={{
                              margin: "20px 0 10px 0",
                              color: "var(--color-primary)",
                            }}
                          >
                            Statuts de gestion
                          </h4>
                        </div>

                        <div className="page-checkbox-group">
                          <label className="page-checkbox-label">
                            <Field
                              name="enc"
                              type="checkbox"
                              className="page-checkbox"
                            />
                            <span>Encaissé</span>
                          </label>
                        </div>

                        <div className="page-checkbox-group">
                          <label className="page-checkbox-label">
                            <Field
                              name="rap"
                              type="checkbox"
                              className="page-checkbox"
                            />
                            <span>Rapprochement effectué</span>
                          </label>
                        </div>

                        <div className="page-checkbox-group">
                          <label className="page-checkbox-label">
                            <Field
                              name="vers"
                              type="checkbox"
                              className="page-checkbox"
                            />
                            <span>Versé en banque</span>
                          </label>
                        </div>

                        <div className="page-checkbox-group">
                          <label className="page-checkbox-label">
                            <Field
                              name="integ"
                              type="checkbox"
                              className="page-checkbox"
                            />
                            <span>Intégré en comptabilité</span>
                          </label>
                        </div>

                        <div className="page-checkbox-group">
                          <label className="page-checkbox-label">
                            <Field
                              name="imp"
                              type="checkbox"
                              className="page-checkbox"
                            />
                            <span>Document imprimé</span>
                          </label>
                        </div>
                      </>
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
                        : editReglement
                        ? "Modifier"
                        : "Ajouter"}
                    </Button>
                  </div>
                </Form>
              );
            }}
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
            reglement ? getRowClass(reglement.numreg, "reglements") : ""
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
