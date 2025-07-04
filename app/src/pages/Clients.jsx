import React, { useEffect, useState } from "react";
import "./styles/SharedPageStyles.css";
import { FaEye, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import api from "../services/api";
import UniversalForm from "../components/shared/UniversalForm";

// Liste complète des champs de la table client (voir SQL)
const CLIENT_FIELDS = [
  { key: "code", label: "Code" },
  { key: "rsoc", label: "Raison sociale" },
  { key: "adresse", label: "Adresse" },
  { key: "mf", label: "Matricule fiscal" },
  { key: "ville", label: "Ville" },
  { key: "tel", label: "Téléphone" },
  { key: "respercon1", label: "Responsable principal" },
  { key: "coderep", label: "Code représentant" },
  { key: "librep", label: "Nom représentant" },
  { key: "fax", label: "Fax" },
  { key: "percon1", label: "Contact 1" },
  { key: "telpercon1", label: "Téléphone contact 1" },
  { key: "emailpercon1", label: "Email contact 1" },
  { key: "RC", label: "RC" },
  { key: "CP", label: "Code postal" },
  { key: "RIB", label: "RIB" },
  { key: "banque", label: "Banque" },
  { key: "timbre", label: "Timbre" },
  { key: "exo", label: "Exonération" },
  { key: "susp", label: "Suspension" },
  { key: "reel", label: "Réel" },
  { key: "datedebut", label: "Date début" },
  { key: "datefin", label: "Date fin" },
  { key: "decision", label: "Décision" },
  { key: "soldeinit", label: "Solde initial" },
  { key: "prix", label: "Prix" },
  { key: "mtreg", label: "Montant règlement" },
  { key: "rap", label: "RAP" },
  { key: "codetarif", label: "Code tarif" },
  { key: "libsect", label: "Secteur" },
  { key: "adressefact", label: "Adresse facturation" },
  { key: "percon2", label: "Contact 2" },
  { key: "respercon2", label: "Responsable 2" },
  { key: "telpercon2", label: "Téléphone contact 2" },
  { key: "emailpercon2", label: "Email contact 2" },
  { key: "email", label: "Email principal" },
  { key: "percon3", label: "Contact 3" },
  { key: "telpercon3", label: "Téléphone contact 3" },
  { key: "emailpercon3", label: "Email contact 3" },
  { key: "respercon3", label: "Responsable 3" },
  { key: "cville", label: "Code ville" },
  { key: "export", label: "Export" },
  { key: "soldeinitbl", label: "Solde init BL" },
  { key: "mtregbl", label: "Montant règlement BL" },
  { key: "rapbl", label: "RAP BL" },
  { key: "rapbc", label: "RAP BC" },
  { key: "remise", label: "Remise" },
  { key: "regime", label: "Régime" },
  { key: "soldeinitbc", label: "Solde init BC" },
  { key: "mtrapbc", label: "Montant RAP BC" },
  { key: "soldeimp", label: "Solde impayé" },
  { key: "scredit", label: "Solde crédit" },
  { key: "srisque", label: "Solde risque" },
  { key: "delaireg", label: "Délai règlement" },
  { key: "libtarif", label: "Libellé tarif" },
  { key: "codesect", label: "Code secteur" },
  { key: "codereg", label: "Code région" },
  { key: "libreg", label: "Libellé région" },
  { key: "codeact", label: "Code activité" },
  { key: "libact", label: "Libellé activité" },
  { key: "libpost", label: "Poste" },
  { key: "codetypreg", label: "Code type règlement" },
  { key: "libtypreg", label: "Libellé type règlement" },
  { key: "codebanq", label: "Code banque" },
  { key: "comptec", label: "Compte client" },
  { key: "rsocar", label: "RS AR" },
  { key: "datecreation", label: "Date création" },
  { key: "datevalidation", label: "Date validation" },
  { key: "validation", label: "Validation" },
  { key: "blocage", label: "Blocage" },
  { key: "message", label: "Message" },
  { key: "tel2", label: "Téléphone 2" },
  { key: "numcompte", label: "Numéro compte" },
  { key: "codegr", label: "Code groupe" },
  { key: "libgr", label: "Libellé groupe" },
  { key: "parunite", label: "Par unité" },
  { key: "adressear", label: "Adresse AR" },
  { key: "tauxret", label: "Taux retenue" },
  { key: "codequal", label: "Code qualité" },
  { key: "libqual", label: "Libellé qualité" },
  { key: "descl", label: "Description" },
  { key: "prod", label: "Produit" },
  { key: "adressebanque", label: "Adresse banque" },
];

// Configuration des champs pour le formulaire nouveau client organisés en groupes
const NEW_CLIENT_FORM_FIELDS = {
  groups: [
    {
      title: "Informations principales",
      key: "main",
      fields: [
        {
          name: "code",
          label: "Code client",
          type: "text",
          required: true,
          placeholder: "Ex: CLI001",
          validation: (value) => {
            if (!/^[A-Z0-9]+$/.test(value)) {
              return "Le code doit contenir uniquement des lettres majuscules et des chiffres";
            }
            return true;
          },
        },
        {
          name: "rsoc",
          label: "Raison sociale",
          type: "text",
          required: true,
          placeholder: "Nom de l'entreprise",
        },
        {
          name: "mf",
          label: "Matricule fiscal",
          type: "text",
          placeholder: "Matricule fiscal",
        },
        {
          name: "RC",
          label: "RC (Registre de commerce)",
          type: "text",
          placeholder: "Numéro RC",
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
          rows: 2,
          placeholder: "Adresse complète",
        },
        {
          name: "ville",
          label: "Ville",
          type: "text",
          placeholder: "Ville",
        },
        {
          name: "CP",
          label: "Code postal",
          type: "text",
          placeholder: "Code postal",
        },
        {
          name: "cville",
          label: "Code ville",
          type: "text",
          placeholder: "Code ville",
        },
        {
          name: "tel",
          label: "Téléphone principal",
          type: "tel",
          placeholder: "+216 XX XXX XXX",
        },
        {
          name: "tel2",
          label: "Téléphone secondaire",
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
          label: "Email principal",
          type: "email",
          placeholder: "email@exemple.com",
          validation: (value) => {
            if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
              return "Format d'email invalide";
            }
            return true;
          },
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
          placeholder: "Nom du responsable principal",
        },
        {
          name: "percon1",
          label: "Contact principal",
          type: "text",
          placeholder: "Nom du contact principal",
        },
        {
          name: "telpercon1",
          label: "Téléphone contact principal",
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
          placeholder: "Nom du contact secondaire",
        },
        {
          name: "respercon2",
          label: "Responsable secondaire",
          type: "text",
          placeholder: "Nom du responsable secondaire",
        },
        {
          name: "telpercon2",
          label: "Téléphone contact secondaire",
          type: "tel",
          placeholder: "+216 XX XXX XXX",
        },
        {
          name: "emailpercon2",
          label: "Email contact secondaire",
          type: "email",
          placeholder: "contact2@exemple.com",
        },
        {
          name: "percon3",
          label: "Contact tertiaire",
          type: "text",
          placeholder: "Nom du contact tertiaire",
        },
        {
          name: "respercon3",
          label: "Responsable tertiaire",
          type: "text",
          placeholder: "Nom du responsable tertiaire",
        },
        {
          name: "telpercon3",
          label: "Téléphone contact tertiaire",
          type: "tel",
          placeholder: "+216 XX XXX XXX",
        },
        {
          name: "emailpercon3",
          label: "Email contact tertiaire",
          type: "email",
          placeholder: "contact3@exemple.com",
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
          step: "0.01",
          placeholder: "0.00",
        },
        {
          name: "scredit",
          label: "Solde crédit (DT)",
          type: "number",
          step: "0.01",
          placeholder: "0.00",
        },
        {
          name: "srisque",
          label: "Solde risque (DT)",
          type: "number",
          step: "0.01",
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
          step: "0.01",
          placeholder: "0.00",
        },
        {
          name: "tauxret",
          label: "Taux retenue (%)",
          type: "number",
          step: "0.01",
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
          name: "RIB",
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
          label: "Numéro de compte",
          type: "text",
          placeholder: "Numéro de compte bancaire",
        },
        {
          name: "codebanq",
          label: "Code banque",
          type: "text",
          placeholder: "Code de la banque",
        },
      ],
    },
    {
      title: "Tarification et classification",
      key: "pricing",
      fields: [
        {
          name: "coderep",
          label: "Code représentant",
          type: "text",
          placeholder: "Code du représentant",
        },
        {
          name: "librep",
          label: "Nom représentant",
          type: "text",
          placeholder: "Nom du représentant",
        },
        {
          name: "codetarif",
          label: "Code tarif",
          type: "text",
          placeholder: "Code tarification",
        },
        {
          name: "libtarif",
          label: "Libellé tarif",
          type: "text",
          placeholder: "Description du tarif",
        },
        {
          name: "prix",
          label: "Type de prix",
          type: "text",
          placeholder: "Type de prix appliqué",
        },
        {
          name: "codesect",
          label: "Code secteur",
          type: "text",
          placeholder: "Code du secteur",
        },
        {
          name: "libsect",
          label: "Libellé secteur",
          type: "text",
          placeholder: "Description du secteur",
        },
        {
          name: "codereg",
          label: "Code région",
          type: "text",
          placeholder: "Code de la région",
        },
        {
          name: "libreg",
          label: "Libellé région",
          type: "text",
          placeholder: "Description de la région",
        },
        {
          name: "codeact",
          label: "Code activité",
          type: "text",
          placeholder: "Code de l'activité",
        },
        {
          name: "libact",
          label: "Libellé activité",
          type: "text",
          placeholder: "Description de l'activité",
        },
        {
          name: "codequal",
          label: "Code qualité",
          type: "text",
          placeholder: "Code qualité client",
        },
        {
          name: "libqual",
          label: "Libellé qualité",
          type: "text",
          placeholder: "Description de la qualité",
        },
        {
          name: "codetypreg",
          label: "Code type règlement",
          type: "text",
          placeholder: "Code du type de règlement",
        },
        {
          name: "libtypreg",
          label: "Type règlement",
          type: "text",
          placeholder: "Description du type de règlement",
        },
      ],
    },
    {
      title: "Statuts et options",
      key: "status",
      fields: [
        {
          name: "regime",
          label: "Régime",
          type: "select",
          options: [
            { value: "R", label: "Réel" },
            { value: "F", label: "Forfaitaire" },
            { value: "E", label: "Exonéré" },
          ],
          defaultValue: "R",
        },
        {
          name: "rap",
          label: "Rapport",
          type: "select",
          options: [
            { value: "N", label: "Non" },
            { value: "O", label: "Oui" },
          ],
          defaultValue: "N",
        },
        {
          name: "timbre",
          label: "Timbre",
          type: "select",
          options: [
            { value: "0", label: "Non" },
            { value: "1", label: "Oui" },
          ],
          defaultValue: "0",
        },
        {
          name: "exo",
          label: "Exonération",
          type: "select",
          options: [
            { value: "0", label: "Non" },
            { value: "1", label: "Oui" },
          ],
          defaultValue: "0",
        },
        {
          name: "export",
          label: "Export",
          type: "select",
          options: [
            { value: "0", label: "Non" },
            { value: "1", label: "Oui" },
          ],
          defaultValue: "0",
        },
        {
          name: "susp",
          label: "Suspendre",
          type: "select",
          options: [
            { value: "0", label: "Non" },
            { value: "1", label: "Oui" },
          ],
          defaultValue: "0",
        },
        {
          name: "blocage",
          label: "Blocage",
          type: "select",
          options: [
            { value: "0", label: "Non" },
            { value: "1", label: "Oui" },
          ],
          defaultValue: "0",
        },
        {
          name: "validation",
          label: "Validation",
          type: "select",
          options: [
            { value: "0", label: "Non validé" },
            { value: "1", label: "Validé" },
          ],
          defaultValue: "0",
        },
        {
          name: "prod",
          label: "Production",
          type: "select",
          options: [
            { value: "0", label: "Non" },
            { value: "1", label: "Oui" },
          ],
          defaultValue: "0",
        },
        {
          name: "parunite",
          label: "Par unité",
          type: "select",
          options: [
            { value: "0", label: "Non" },
            { value: "1", label: "Oui" },
          ],
          defaultValue: "0",
        },
        {
          name: "reel",
          label: "Réel",
          type: "select",
          options: [
            { value: "0", label: "Non" },
            { value: "1", label: "Oui" },
          ],
          defaultValue: "0",
        },
      ],
    },
    {
      title: "Dates importantes",
      key: "dates",
      fields: [
        {
          name: "datecreation",
          label: "Date de création",
          type: "date",
          placeholder: "Date de création du client",
          disabled: true, // Ce champ sera rempli automatiquement par le backend
        },
        {
          name: "datedebut",
          label: "Date de début",
          type: "date",
          placeholder: "Date de début de relation",
        },
        {
          name: "datefin",
          label: "Date de fin",
          type: "date",
          placeholder: "Date de fin de relation",
        },
        {
          name: "datevalidation",
          label: "Date de validation",
          type: "date",
          placeholder: "Date de validation du client",
        },
      ],
    },
    {
      title: "Informations complémentaires",
      key: "additional",
      fields: [
        {
          name: "codegr",
          label: "Code groupe",
          type: "text",
          placeholder: "Code du groupe",
        },
        {
          name: "libgr",
          label: "Libellé groupe",
          type: "text",
          placeholder: "Description du groupe",
        },
        {
          name: "adressefact",
          label: "Adresse de facturation",
          type: "textarea",
          rows: 2,
          placeholder: "Si différente de l'adresse principale",
        },
        {
          name: "adressear",
          label: "Adresse arabe",
          type: "textarea",
          rows: 2,
          placeholder: "Adresse en arabe",
        },
        {
          name: "rsocar",
          label: "Raison sociale en arabe",
          type: "text",
          placeholder: "Raison sociale en caractères arabes",
        },
        {
          name: "libpost",
          label: "Libellé postal",
          type: "text",
          placeholder: "Informations postales",
        },
        {
          name: "comptec",
          label: "Compte comptable",
          type: "text",
          placeholder: "Numéro de compte comptable",
        },
        {
          name: "decision",
          label: "Décision",
          type: "text",
          placeholder: "Décision particulière",
        },
        {
          name: "descl",
          label: "Description détaillée",
          type: "textarea",
          rows: 3,
          placeholder: "Description complète du client",
        },
        {
          name: "message",
          label: "Message/Notes",
          type: "textarea",
          rows: 2,
          placeholder: "Notes ou commentaires",
        },
      ],
    },
  ],
};

const Clients = () => {
  const [clients, setClients] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null); // Pour la modale
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadClients();
    // eslint-disable-next-line
  }, []);

  const loadClients = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getClients();
      setClients(data);
    } catch (err) {
      setError("Erreur inattendue: " + err.message);
      setClients(null);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour créer un nouveau client
  const handleCreateClient = async (formData) => {
    setIsSubmitting(true);
    try {
      await api.createClient(formData);
      setShowNewClientForm(false);
      await loadClients();
      alert("Client créé avec succès !");
    } catch (error) {
      console.error("Erreur lors de la création du client:", error);
      alert("Erreur lors de la création du client : " + error.message);
      throw error; // Pour que le formulaire garde les données
    } finally {
      setIsSubmitting(false);
    }
  };

  // Suppression d'un client (DELETE physique)
  const handleDeleteClient = async (code) => {
    if (
      !window.confirm(
        "Confirmer la suppression définitive de ce client ? Cette action est irréversible."
      )
    )
      return;
    setLoading(true);
    setError(null);
    try {
      await api.deleteClient(code);
      await loadClients();
      alert("Client supprimé définitivement.");
    } catch (err) {
      setError("Erreur suppression: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Colonnes pour affichage tableau simple
  const columns = [
    { key: "code", title: "Code" },
    { key: "rsoc", title: "Raison Sociale" },
    { key: "mf", title: "Matricule Fiscal" },
    { key: "adresse", title: "Adresse" },
    { key: "tel", title: "Téléphone" },
    { key: "email", title: "Email" },
    { key: "coderep", title: "Code Rep." },
    { key: "librep", title: "Représentant" },
    { key: "actions", title: "Actions" },
  ];

  return (
    <div className="shared-page">
      <div className="page-header">
        <h1>Clients</h1>
        <div className="page-actions">
          <button
            onClick={() => setShowNewClientForm(true)}
            className="btn btn-primary"
          >
            <FaPlus />
            Nouveau client
          </button>
          <button onClick={loadClients} className="btn btn-secondary">
            🔄 Recharger
          </button>
        </div>
      </div>

      {loading && <div>Chargement...</div>}
      {error && (
        <div style={{ color: "red", marginBottom: 16 }}>
          <b>Erreur :</b> {error}
        </div>
      )}

      <div>
        <b>Liste des clients :</b>
        <table className="shared-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(clients) && clients.length > 0 ? (
              clients.map((row, idx) => (
                <tr key={idx}>
                  {columns.map((col) =>
                    col.key === "actions" ? (
                      <td key={col.key}>
                        <button
                          className="action-btn view-btn"
                          onClick={() => setSelectedClient(row)}
                          title="Voir les détails"
                        >
                          <FaEye style={{ verticalAlign: "middle" }} />
                        </button>

                        <button
                          className="action-btn edit-btn"
                          onClick={() => alert(`Modifier client ${row.code}`)}
                          title="Modifier"
                        >
                          <FaEdit style={{ verticalAlign: "middle" }} />
                        </button>

                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDeleteClient(row.code)}
                          title="Supprimer définitivement"
                        >
                          <FaTrash style={{ verticalAlign: "middle" }} />
                        </button>
                      </td>
                    ) : (
                      <td key={col.key}>{row[col.key] || ""}</td>
                    )
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: "center" }}>
                  Aucun client à afficher.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modale d'affichage détaillé du client */}
      {selectedClient && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.4)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setSelectedClient(null)}
        >
          <div
            className="modal-content shared-modal"
            style={{
              minWidth: 350,
              maxWidth: 600,
              maxHeight: "80vh",
              overflowY: "auto",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="action-btn modal-close-btn"
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                minWidth: 80,
              }}
              onClick={() => setSelectedClient(null)}
            >
              Fermer
            </button>
            <h2 style={{ marginTop: 0, marginBottom: 20 }}>
              Détails du client
            </h2>
            <table
              className="shared-table"
              style={{ width: "100%", borderCollapse: "collapse" }}
            >
              <tbody>
                {CLIENT_FIELDS.map((field) => (
                  <tr key={field.key}>
                    <td
                      style={{
                        fontWeight: "bold",
                        padding: "4px 8px",
                        borderBottom: "1px solid #eee",
                        width: 180,
                      }}
                    >
                      {field.label}
                    </td>
                    <td
                      style={{
                        padding: "4px 8px",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      {selectedClient[field.key] || ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Formulaire nouveau client */}
      <UniversalForm
        isOpen={showNewClientForm}
        onClose={() => setShowNewClientForm(false)}
        onSubmit={handleCreateClient}
        title="Nouveau client"
        fields={NEW_CLIENT_FORM_FIELDS}
        isLoading={isSubmitting}
        submitButtonText="Créer le client"
        width="700px"
      />
    </div>
  );
};

export default Clients;
