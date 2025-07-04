import React, { useEffect, useState } from "react";
import "./styles/SharedPageStyles.css";
import { FaEye, FaEdit, FaTrash, FaPlus, FaUsers } from "react-icons/fa";
import api from "../services/apiClient";
import UniversalFormV2 from "../components/shared/UniversalFormV2";
import { useToast } from "../components/shared/Toast";
import { CLIENT_FORM_CONFIG } from "../config/clientFormConfig";
import {
  clientValidationSchema,
  clientDefaultValues,
} from "../validations/clientValidation";

// Liste complète des champs de la table client (pour la modal de visualisation)
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

// Liste des champs pour l'affichage du tableau (informations essentielles uniquement)
const DISPLAY_FIELDS = [
  { key: "code", label: "Code" },
  { key: "rsoc", label: "Raison sociale" },
  { key: "mf", label: "Matricule fiscal" },
  { key: "ville", label: "Ville" },
  { key: "tel", label: "Téléphone" },
  { key: "librep", label: "Représentant" },
  { key: "email", label: "Email" },
];

const ClientsV2 = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  // Hook pour les notifications
  const { showToast, ToastContainer } = useToast();
  // État pour les notifications
  const [notification, setNotification] = useState(null);

  // Fonction pour afficher une notification
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    // Auto-fermeture après 4 secondes
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Charger les clients
  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const response = await api.get("/clients");
      setClients(response.data);
      setError(""); // Réinitialiser l'erreur en cas de succès
    } catch (err) {
      setError("Erreur lors du chargement des clients");
      showToast("Erreur lors du chargement des clients", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les clients (pour compatibilité, mais on n'utilise plus la recherche)
  const filteredClients = clients;

  // Préparer les valeurs initiales pour le formulaire
  const getInitialValues = (client = null) => {
    if (client) {
      // Mode édition : utiliser les données du client existant
      return {
        ...clientDefaultValues,
        ...client,
        // Convertir les dates au format approprié pour les inputs date
        datedebut: client.datedebut
          ? new Date(client.datedebut).toISOString().split("T")[0]
          : "",
        datefin: client.datefin
          ? new Date(client.datefin).toISOString().split("T")[0]
          : "",
        datecreation: client.datecreation
          ? new Date(client.datecreation).toISOString().split("T")[0]
          : "",
        datevalidation: client.datevalidation
          ? new Date(client.datevalidation).toISOString().split("T")[0]
          : "",
      };
    } else {
      // Mode création : utiliser les valeurs par défaut
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      return {
        ...clientDefaultValues,
        coderep: userInfo.code || "",
        librep: userInfo.libelle || "",
        datecreation: new Date().toISOString().split("T")[0],
      };
    }
  };

  // Gestionnaire de soumission du formulaire
  const handleFormSubmit = async (values) => {
    setIsSubmitting(true);

    try {
      // Préparer les données pour l'API
      const submitData = {
        ...values,
        // Convertir les valeurs booléennes checkbox en string
        timbre: values.timbre ? "1" : "0",
        exo: values.exo ? "1" : "0",
        susp: values.susp ? "1" : "0",
        reel: values.reel ? "1" : "0",
        export: values.export ? "1" : "0",
        prod: values.prod ? "1" : "0",
        // Convertir les dates vides en null
        datedebut: values.datedebut || null,
        datefin: values.datefin || null,
        datevalidation: values.datevalidation || null,
      };

      if (editingClient) {
        // Mode édition
        await api.put(`/clients/${editingClient.code}`, submitData);
        setClients((prevClients) =>
          prevClients.map((client) =>
            client.code === editingClient.code
              ? { ...client, ...submitData }
              : client
          )
        );
        showToast(
          `Client "${
            submitData.rsoc || editingClient.code
          }" modifié avec succès`,
          "success"
        );
      } else {
        // Mode création
        const response = await api.post("/clients", submitData);
        setClients((prevClients) => [...prevClients, response.data]);
        showToast(
          `Client "${submitData.rsoc || submitData.code}" créé avec succès`,
          "success"
        );
      }

      // Fermer le formulaire et réinitialiser
      setIsFormOpen(false);
      setEditingClient(null);
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);

      // Afficher une notification d'erreur
      let errorMessage = "Erreur lors de l'enregistrement du client";

      // Gérer les erreurs spécifiques
      if (error.response?.status === 409) {
        errorMessage = "Un client avec ce code existe déjà";
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data.error || "Données invalides";
      } else if (error.message) {
        errorMessage = error.message;
      }

      showToast(errorMessage, "error");
      throw new Error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Ouvrir le formulaire pour nouveau client
  const handleAddClient = () => {
    setEditingClient(null);
    setIsFormOpen(true);
  };

  // Ouvrir le formulaire pour édition
  const handleEditClient = (client) => {
    setEditingClient(client);
    setIsFormOpen(true);
  };

  // Supprimer un client
  const handleDeleteClient = async (clientCode) => {
    // Trouver le client pour afficher son nom dans la confirmation
    const clientToDelete = clients.find((client) => client.code === clientCode);
    const clientName = clientToDelete
      ? clientToDelete.rsoc || clientCode
      : clientCode;

    if (
      !window.confirm(
        `Confirmer la suppression définitive du client "${clientName}" ? Cette action est irréversible.`
      )
    ) {
      return;
    }

    setLoading(true);
    setError("");
    try {
      await api.delete(`/clients/${clientCode}`);
      setClients((prevClients) =>
        prevClients.filter((client) => client.code !== clientCode)
      );
      showToast(`Client "${clientName}" supprimé définitivement`, "success");
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      const errorMessage =
        error.message || "Erreur lors de la suppression du client";
      setError("Erreur suppression: " + errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  // Voir les détails d'un client
  const handleViewClient = (client) => {
    setSelectedClient(client);
  };

  // Fermer le formulaire avec confirmation si des données ont été modifiées
  const handleCloseForm = () => {
    // Pour l'instant, on ferme directement.
    // La logique de confirmation sera gérée dans UniversalFormV2
    setIsFormOpen(false);
    setEditingClient(null);
  };

  // Fermer la modal de visualisation
  const handleCloseViewModal = () => {
    setSelectedClient(null);
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-loading">
          <div className="page-spinner"></div>
          <p>Chargement des clients...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="shared-page">
        {/* En-tête */}
        <div className="page-header">
          <h1>Clients</h1>
          <div className="page-actions">
            <button onClick={handleAddClient} className="btn btn-primary">
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

        {/* Tableau des clients */}
        <div>
          <b>Liste des clients :</b>
          <table className="shared-table">
            <thead>
              <tr>
                {DISPLAY_FIELDS.map((field) => (
                  <th key={field.key}>{field.label}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(filteredClients) && filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <tr key={client.code}>
                    {DISPLAY_FIELDS.map((field) => (
                      <td key={field.key}>{client[field.key] || ""}</td>
                    ))}
                    <td>
                      <button
                        className="action-btn view-btn"
                        onClick={() => handleViewClient(client)}
                        title="Voir les détails"
                      >
                        <FaEye style={{ verticalAlign: "middle" }} />
                      </button>

                      <button
                        className="action-btn edit-btn"
                        onClick={() => handleEditClient(client)}
                        title="Modifier"
                      >
                        <FaEdit style={{ verticalAlign: "middle" }} />
                      </button>

                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteClient(client.code)}
                        title="Supprimer définitivement"
                      >
                        <FaTrash style={{ verticalAlign: "middle" }} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={DISPLAY_FIELDS.length + 1}
                    style={{ textAlign: "center" }}
                  >
                    Aucun client à afficher.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Formulaire avec UniversalFormV2 */}
        <UniversalFormV2
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          onSubmit={handleFormSubmit}
          title={editingClient ? "Modifier le client" : "Nouveau client"}
          fields={CLIENT_FORM_CONFIG}
          initialValues={getInitialValues(editingClient)}
          validationSchema={clientValidationSchema}
          isLoading={isSubmitting}
          mode={editingClient ? "edit" : "create"}
          useDrawer={true}
          submitButtonText={editingClient ? "Modifier" : "Créer"}
          closeOnOverlayClick={false}
          confirmBeforeClose={true}
        />

        {/* Modal de visualisation des détails */}
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
            onClick={handleCloseViewModal}
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
                onClick={handleCloseViewModal}
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
      </div>

      {/* Container de toasts pour les notifications */}
      <ToastContainer />
    </>
  );
};

export default ClientsV2;
