import { useState, useEffect } from "react";
import {
  FiFileText,
  FiUser,
  FiCalendar,
  FiDollarSign,
  FiEye,
  FiPrinter,
} from "react-icons/fi";
import api from "../../services/api";
import DataTable from "../../components/shared/DataTable";
import SearchBar from "../../components/shared/SearchBar";
import FilterContainer from "../../components/shared/FilterContainer";
import Button from "../../components/shared/Button";
import Modal from "../../components/ui/Modal";
import PageHeader from "../../components/ui/PageHeader";
import "./styles/Common.css";

export default function Factures() {
  const [factures, setFactures] = useState([]);
  const [commandesNonFacturees, setCommandesNonFacturees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClient, setFilterClient] = useState("");
  const [showFactureModal, setShowFactureModal] = useState(false);
  const [showCreationModal, setShowCreationModal] = useState(false);
  const [selectedFacture, setSelectedFacture] = useState(null);
  const [selectedCommande, setSelectedCommande] = useState(null);
  const [stats, setStats] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [facturesData, commandesData, statsData] = await Promise.all([
        api.getFactures(),
        api.getCommandesNonFacturees(),
        api.getStatsFactures(),
      ]);

      setFactures(facturesData);
      setCommandesNonFacturees(commandesData);
      setStats(statsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (facture) => {
    try {
      const factureDetails = await api.getFacture(facture.numfact);
      setSelectedFacture(factureDetails);
      setShowFactureModal(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreateFromCommande = (commande) => {
    setSelectedCommande(commande);
    setShowCreationModal(true);
  };

  const handleCreateFacture = async (formData) => {
    try {
      if (!selectedCommande) return;

      await api.createFactureFromCommande(selectedCommande.numbc, {
        numfactf: formData.numfactf,
        datefact: formData.datefact,
        typeFacture: formData.typeFacture || "NORMALE",
      });

      setShowCreationModal(false);
      setSelectedCommande(null);
      loadData(); // Recharger les données
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePrint = (facture) => {
    // Fonction d'impression de facture
    window.print();
  };

  // Filtrage des données
  const filteredFactures = factures.filter((facture) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      facture.numfact?.toString().includes(searchLower) ||
      facture.rsoc?.toLowerCase().includes(searchLower) ||
      facture.datefact?.includes(searchLower);

    const matchesClient = !filterClient || facture.ccl === filterClient;
    return matchesSearch && matchesClient;
  });

  // Configuration des colonnes pour les factures
  const facturesColumns = [
    {
      icon: <FiFileText size={16} />,
      title: "N° Facture",
      dataKey: "numfact",
      render: (facture) => (
        <span className="page-code-cell">FACT-{facture.numfact}</span>
      ),
    },
    {
      icon: <FiUser size={16} />,
      title: "Client",
      dataKey: "rsoc",
      render: (facture) => (
        <span className="page-name-cell">{facture.rsoc}</span>
      ),
    },
    {
      icon: <FiCalendar size={16} />,
      title: "Date",
      dataKey: "datefact",
      render: (facture) =>
        new Date(facture.datefact).toLocaleDateString("fr-FR"),
    },
    {
      icon: <FiDollarSign size={16} />,
      title: "Montant TTC",
      dataKey: "mttc",
      render: (facture) => (
        <span className="page-amount-cell">{facture.mttc?.toFixed(2)} DT</span>
      ),
    },
    {
      title: "Actions",
      dataKey: "actions",
      render: (facture) => (
        <div className="page-actions-cell">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleView(facture)}
            icon={<FiEye size={14} />}
          >
            Voir
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handlePrint(facture)}
            icon={<FiPrinter size={14} />}
          >
            Imprimer
          </Button>
        </div>
      ),
    },
  ];

  // Configuration des colonnes pour les commandes non facturées
  const commandesColumns = [
    {
      title: "N° Commande",
      dataKey: "numbc",
      render: (commande) => (
        <span className="page-code-cell">CMD-{commande.numbc}</span>
      ),
    },
    {
      title: "Client",
      dataKey: "rsoc",
      render: (commande) => (
        <span className="page-name-cell">{commande.rsoc}</span>
      ),
    },
    {
      title: "Date",
      dataKey: "datebc",
      render: (commande) =>
        new Date(commande.datebc).toLocaleDateString("fr-FR"),
    },
    {
      title: "Montant TTC",
      dataKey: "mttc",
      render: (commande) => (
        <span className="page-amount-cell">{commande.mttc?.toFixed(2)} DT</span>
      ),
    },
    {
      title: "Actions",
      dataKey: "actions",
      render: (commande) => (
        <Button
          variant="primary"
          size="sm"
          onClick={() => handleCreateFromCommande(commande)}
        >
          Facturer
        </Button>
      ),
    },
  ];

  if (loading) return <div className="page-container">Chargement...</div>;
  if (error) return <div className="page-container error">Erreur: {error}</div>;

  return (
    <div className="page-container">
      <PageHeader
        title="📄 Gestion des Factures"
        subtitle="Gestion des factures et facturation des commandes"
      />

      {/* Statistiques */}
      <div className="page-stats-grid">
        <div className="page-stat-card">
          <h3>Total Factures</h3>
          <p>{stats.total_factures || 0}</p>
        </div>
        <div className="page-stat-card">
          <h3>CA Total TTC</h3>
          <p>{stats.total_ttc?.toFixed(2) || "0.00"} DT</p>
        </div>
        <div className="page-stat-card">
          <h3>Facture Moyenne</h3>
          <p>{stats.moyenne_facture?.toFixed(2) || "0.00"} DT</p>
        </div>
        <div className="page-stat-card">
          <h3>Commandes à Facturer</h3>
          <p>{commandesNonFacturees.length}</p>
        </div>
      </div>

      {/* Section Commandes à facturer */}
      {commandesNonFacturees.length > 0 && (
        <div className="page-section">
          <h2>🕐 Commandes à Facturer</h2>
          <DataTable
            data={commandesNonFacturees}
            columns={commandesColumns}
            emptyMessage="Aucune commande en attente de facturation"
          />
        </div>
      )}

      {/* Section Factures */}
      <div className="page-section">
        <div className="page-section-header">
          <h2>📄 Liste des Factures</h2>
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Rechercher par numéro, client..."
          />
        </div>

        <DataTable
          data={filteredFactures}
          columns={facturesColumns}
          emptyMessage="Aucune facture trouvée"
        />
      </div>

      {/* Modal de détails de facture */}
      {showFactureModal && selectedFacture && (
        <Modal
          isOpen={showFactureModal}
          onClose={() => setShowFactureModal(false)}
          title={`Facture FACT-${selectedFacture.entete?.numfact}`}
        >
          <div className="page-modal-content">
            <div className="page-info-grid">
              <div>
                <strong>Client :</strong> {selectedFacture.entete?.rsoc}
              </div>
              <div>
                <strong>Date :</strong>{" "}
                {new Date(selectedFacture.entete?.datefact).toLocaleDateString(
                  "fr-FR"
                )}
              </div>
              <div>
                <strong>Montant HT :</strong>{" "}
                {selectedFacture.entete?.mht?.toFixed(2)} DT
              </div>
              <div>
                <strong>TVA :</strong>{" "}
                {selectedFacture.entete?.mtva?.toFixed(2)} DT
              </div>
              <div>
                <strong>Montant TTC :</strong>{" "}
                {selectedFacture.entete?.mttc?.toFixed(2)} DT
              </div>
            </div>

            {/* Lignes de la facture */}
            {selectedFacture.lignes && selectedFacture.lignes.length > 0 && (
              <div className="page-lines-section">
                <h4>Détail des articles</h4>
                <table className="page-table">
                  <thead>
                    <tr>
                      <th>Article</th>
                      <th>Quantité</th>
                      <th>Prix unitaire</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedFacture.lignes.map((ligne, index) => (
                      <tr key={index}>
                        <td>{ligne.libart}</td>
                        <td>{ligne.qte}</td>
                        <td>{ligne.puart?.toFixed(2)} DT</td>
                        <td>{ligne.montant_ligne?.toFixed(2)} DT</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Modal de création de facture */}
      {showCreationModal && selectedCommande && (
        <Modal
          isOpen={showCreationModal}
          onClose={() => setShowCreationModal(false)}
          title={`Facturer la commande CMD-${selectedCommande.numbc}`}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              handleCreateFacture(Object.fromEntries(formData));
            }}
          >
            <div className="page-form-group">
              <label>Numéro de facture</label>
              <input
                type="text"
                name="numfactf"
                defaultValue={`FACT-${selectedCommande.numbc}`}
                required
              />
            </div>
            <div className="page-form-group">
              <label>Date de facture</label>
              <input
                type="date"
                name="datefact"
                defaultValue={new Date().toISOString().split("T")[0]}
                required
              />
            </div>
            <div className="page-form-group">
              <label>Type de facture</label>
              <select name="typeFacture" defaultValue="NORMALE">
                <option value="NORMALE">Normale</option>
                <option value="AVOIR">Avoir</option>
                <option value="PROFORMA">Pro-forma</option>
              </select>
            </div>
            <div className="page-form-actions">
              <Button type="submit" variant="primary">
                Créer la facture
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowCreationModal(false)}
              >
                Annuler
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
