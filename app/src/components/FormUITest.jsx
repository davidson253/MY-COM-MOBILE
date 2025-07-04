import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FaPlus, FaTimes, FaEye } from "react-icons/fa";
import "./FormUITest.css";

// Schéma de validation étendu pour le test
const testValidationSchema = Yup.object({
  code: Yup.string()
    .required("Code obligatoire")
    .matches(/^[A-Z0-9]+$/, "Format invalide"),
  rsoc: Yup.string().required("Raison sociale obligatoire"),
  email: Yup.string().email("Format invalide").required("Email obligatoire"),
  telephone: Yup.string().required("Téléphone obligatoire"),
  mf: Yup.string().required("Matricule fiscal obligatoire"),
});

// Champs de test étendus (simulation du vrai formulaire client)
const testFields = {
  groups: [
    {
      title: "Informations principales",
      key: "main",
      fields: [
        {
          name: "code",
          label: "Code client",
          type: "text",
          placeholder: "Ex: CLI001",
        },
        {
          name: "rsoc",
          label: "Raison sociale",
          type: "text",
          placeholder: "Nom de l'entreprise",
        },
        {
          name: "mf",
          label: "Matricule fiscal",
          type: "text",
          placeholder: "Matricule fiscal",
        },
        {
          name: "rc",
          label: "RC",
          type: "text",
          placeholder: "Registre de commerce",
        },
      ],
    },
    {
      title: "Adresse et coordonnées",
      key: "address",
      fields: [
        {
          name: "adresse",
          label: "Adresse",
          type: "textarea",
          placeholder: "Adresse complète",
        },
        { name: "ville", label: "Ville", type: "text", placeholder: "Ville" },
        {
          name: "cp",
          label: "Code postal",
          type: "text",
          placeholder: "Code postal",
        },
        {
          name: "telephone",
          label: "Téléphone",
          type: "tel",
          placeholder: "+216 XX XXX XXX",
        },
        {
          name: "fax",
          label: "Fax",
          type: "tel",
          placeholder: "Numéro de fax",
        },
        {
          name: "email",
          label: "Email",
          type: "email",
          placeholder: "email@exemple.com",
        },
      ],
    },
    {
      title: "Contacts entreprise",
      key: "contacts",
      fields: [
        {
          name: "respercon1",
          label: "Responsable principal",
          type: "text",
          placeholder: "Nom du responsable",
        },
        {
          name: "percon1",
          label: "Contact principal",
          type: "text",
          placeholder: "Nom du contact",
        },
        {
          name: "telpercon1",
          label: "Tél. contact principal",
          type: "tel",
          placeholder: "+216 XX XXX XXX",
        },
        {
          name: "emailpercon1",
          label: "Email contact principal",
          type: "email",
          placeholder: "contact@exemple.com",
        },
        {
          name: "percon2",
          label: "Contact secondaire",
          type: "text",
          placeholder: "Contact secondaire",
        },
        {
          name: "telpercon2",
          label: "Tél. contact secondaire",
          type: "tel",
          placeholder: "+216 XX XXX XXX",
        },
      ],
    },
    {
      title: "Informations financières",
      key: "financial",
      fields: [
        {
          name: "soldeinit",
          label: "Solde initial (DT)",
          type: "number",
          placeholder: "0.00",
        },
        {
          name: "scredit",
          label: "Solde crédit (DT)",
          type: "number",
          placeholder: "0.00",
        },
        {
          name: "delaireg",
          label: "Délai règlement (jours)",
          type: "number",
          placeholder: "30",
        },
        {
          name: "remise",
          label: "Remise (%)",
          type: "number",
          placeholder: "0.00",
        },
        {
          name: "tauxret",
          label: "Taux retenue (%)",
          type: "number",
          placeholder: "0.00",
        },
      ],
    },
    {
      title: "Informations bancaires",
      key: "banking",
      fields: [
        {
          name: "banque",
          label: "Banque",
          type: "text",
          placeholder: "Nom de la banque",
        },
        {
          name: "rib",
          label: "RIB",
          type: "text",
          placeholder: "Relevé d'identité bancaire",
        },
        {
          name: "adressebanque",
          label: "Adresse banque",
          type: "text",
          placeholder: "Adresse de la banque",
        },
        {
          name: "numcompte",
          label: "Numéro compte",
          type: "text",
          placeholder: "Numéro de compte",
        },
      ],
    },
    {
      title: "Classification et tarifs",
      key: "classification",
      fields: [
        {
          name: "codetarif",
          label: "Code tarif",
          type: "text",
          placeholder: "Code tarification",
        },
        {
          name: "codesect",
          label: "Code secteur",
          type: "text",
          placeholder: "Code secteur",
        },
        {
          name: "libsect",
          label: "Secteur",
          type: "text",
          placeholder: "Libellé secteur",
        },
        {
          name: "codereg",
          label: "Code région",
          type: "text",
          placeholder: "Code région",
        },
        {
          name: "libreg",
          label: "Région",
          type: "text",
          placeholder: "Libellé région",
        },
        {
          name: "codeact",
          label: "Code activité",
          type: "text",
          placeholder: "Code activité",
        },
      ],
    },
    {
      title: "Options et statuts",
      key: "options",
      fields: [
        {
          name: "regime",
          label: "Régime",
          type: "select",
          options: [
            { value: "", label: "Sélectionner..." },
            { value: "R", label: "Réel" },
            { value: "F", label: "Forfaitaire" },
            { value: "E", label: "Exonéré" },
          ],
        },
        {
          name: "timbre",
          label: "Timbre",
          type: "select",
          options: [
            { value: "", label: "Sélectionner..." },
            { value: "0", label: "Non" },
            { value: "1", label: "Oui" },
          ],
        },
        {
          name: "export",
          label: "Export",
          type: "select",
          options: [
            { value: "", label: "Sélectionner..." },
            { value: "0", label: "Non" },
            { value: "1", label: "Oui" },
          ],
        },
        {
          name: "validation",
          label: "Validation",
          type: "select",
          options: [
            { value: "", label: "Sélectionner..." },
            { value: "0", label: "Non validé" },
            { value: "1", label: "Validé" },
          ],
        },
      ],
    },
    {
      title: "Dates importantes",
      key: "dates",
      fields: [
        {
          name: "datedebut",
          label: "Date début",
          type: "date",
          placeholder: "Date de début",
        },
        {
          name: "datefin",
          label: "Date fin",
          type: "date",
          placeholder: "Date de fin",
        },
        {
          name: "datevalidation",
          label: "Date validation",
          type: "date",
          placeholder: "Date de validation",
        },
      ],
    },
    {
      title: "Informations complémentaires",
      key: "additional",
      fields: [
        {
          name: "adressefact",
          label: "Adresse facturation",
          type: "textarea",
          placeholder: "Si différente de l'adresse principale",
        },
        {
          name: "descl",
          label: "Description",
          type: "textarea",
          placeholder: "Description détaillée du client",
        },
        {
          name: "message",
          label: "Notes",
          type: "textarea",
          placeholder: "Notes ou commentaires",
        },
        {
          name: "comptec",
          label: "Compte comptable",
          type: "text",
          placeholder: "Numéro de compte comptable",
        },
      ],
    },
  ],
};

const FormUITest = () => {
  const [activeMode, setActiveMode] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showInline, setShowInline] = useState(false);

  const handleSubmit = (values) => {
    console.log("Données soumises:", values);
    alert("Formulaire soumis ! (voir console)");
    // Fermer tous les formulaires
    setShowModal(false);
    setShowDrawer(false);
    setShowInline(false);
  };

  const renderFormContent = () => (
    <Formik
      initialValues={{
        // Informations principales
        code: "",
        rsoc: "",
        mf: "",
        rc: "",
        // Adresse et coordonnées
        adresse: "",
        ville: "",
        cp: "",
        telephone: "",
        fax: "",
        email: "",
        // Contacts
        respercon1: "",
        percon1: "",
        telpercon1: "",
        emailpercon1: "",
        percon2: "",
        telpercon2: "",
        // Financier
        soldeinit: "",
        scredit: "",
        delaireg: "",
        remise: "",
        tauxret: "",
        // Bancaire
        banque: "",
        rib: "",
        adressebanque: "",
        numcompte: "",
        // Classification
        codetarif: "",
        codesect: "",
        libsect: "",
        codereg: "",
        libreg: "",
        codeact: "",
        // Options
        regime: "",
        timbre: "",
        export: "",
        validation: "",
        // Dates
        datedebut: "",
        datefin: "",
        datevalidation: "",
        // Complémentaire
        adressefact: "",
        descl: "",
        message: "",
        comptec: "",
      }}
      validationSchema={testValidationSchema}
      onSubmit={handleSubmit}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        isSubmitting,
      }) => (
        <Form className="test-form">
          {testFields.groups.map((group) => (
            <div key={group.key} className="test-form-group">
              <h3 className="test-group-title">{group.title}</h3>
              <div className="test-group-fields">
                {group.fields.map((field) => (
                  <div key={field.name} className="test-form-field">
                    <label className="test-form-label">{field.label}</label>
                    {field.type === "textarea" ? (
                      <textarea
                        name={field.name}
                        value={values[field.name]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder={field.placeholder}
                        className={`test-form-input ${
                          errors[field.name] && touched[field.name]
                            ? "error"
                            : ""
                        }`}
                        rows={3}
                      />
                    ) : field.type === "select" ? (
                      <select
                        name={field.name}
                        value={values[field.name]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`test-form-input ${
                          errors[field.name] && touched[field.name]
                            ? "error"
                            : ""
                        }`}
                      >
                        {field.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        name={field.name}
                        value={values[field.name]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder={field.placeholder}
                        step={field.type === "number" ? "0.01" : undefined}
                        className={`test-form-input ${
                          errors[field.name] && touched[field.name]
                            ? "error"
                            : ""
                        }`}
                      />
                    )}
                    {errors[field.name] && touched[field.name] && (
                      <span className="test-form-error">
                        {errors[field.name]}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="test-form-actions">
            <button
              type="submit"
              disabled={isSubmitting}
              className="test-btn-primary"
            >
              Enregistrer
            </button>
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                setShowDrawer(false);
                setShowInline(false);
              }}
              className="test-btn-cancel"
            >
              Annuler
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );

  return (
    <div className="form-ui-test">
      <div className="test-header">
        <h1>Test des interfaces de formulaire</h1>
        <p>Comparez les différentes approches UX :</p>
      </div>

      {/* Boutons de démonstration */}
      <div className="test-buttons">
        <button
          onClick={() => setShowModal(true)}
          className="test-demo-btn modal-btn"
        >
          <FaEye /> Modal (Actuel)
        </button>
        <button
          onClick={() => setShowDrawer(true)}
          className="test-demo-btn drawer-btn"
        >
          <FaEye /> Drawer (Moderne)
        </button>
        <button
          onClick={() => setShowInline(!showInline)}
          className="test-demo-btn inline-btn"
        >
          <FaPlus /> Section dépliable
        </button>
      </div>

      {/* Liste factice pour le contexte */}
      <div className="test-content">
        <div className="test-list">
          <div className="test-list-item">
            <span>Client 1 - Société ABC</span>
            <span>contact@abc.com</span>
          </div>
          <div className="test-list-item">
            <span>Client 2 - Entreprise XYZ</span>
            <span>info@xyz.com</span>
          </div>
          <div className="test-list-item">
            <span>Client 3 - SARL DEF</span>
            <span>admin@def.com</span>
          </div>
        </div>

        {/* Section dépliable */}
        {showInline && (
          <div className="test-inline-form">
            <div className="test-inline-header">
              <h3>Nouveau client</h3>
              <button
                onClick={() => setShowInline(false)}
                className="test-close-btn"
              >
                <FaTimes />
              </button>
            </div>
            {renderFormContent()}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="test-modal-overlay">
          <div className="test-modal">
            <div className="test-modal-header">
              <h2>Nouveau client (Modal)</h2>
              <button
                onClick={() => setShowModal(false)}
                className="test-close-btn"
              >
                <FaTimes />
              </button>
            </div>
            <div className="test-modal-content">{renderFormContent()}</div>
          </div>
        </div>
      )}

      {/* Drawer */}
      {showDrawer && (
        <>
          <div
            className="test-drawer-overlay"
            onClick={() => setShowDrawer(false)}
          />
          <div className="test-drawer">
            <div className="test-drawer-header">
              <h2>Nouveau client (Drawer)</h2>
              <button
                onClick={() => setShowDrawer(false)}
                className="test-close-btn"
              >
                <FaTimes />
              </button>
            </div>
            <div className="test-drawer-content">{renderFormContent()}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default FormUITest;
