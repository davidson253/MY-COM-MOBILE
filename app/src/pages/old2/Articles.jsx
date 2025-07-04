import { useState, useEffect } from "react";
import api from "../../services/api";
import { DataTable } from "../../components/shared";
import {
  SearchBar,
  FilterContainer,
  FormCard,
  Button,
} from "../../components/shared";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter } from "react-icons/fi";

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [filters, setFilters] = useState({
    famille: "",
    sousfamille: "",
    marque: "",
    actif: "all",
  });

  // Nouveau article
  const [newArticle, setNewArticle] = useState({
    code: "",
    libelle: "",
    famille: "",
    sousfamille: "",
    marque: "",
    prix_unitaire: "",
    prix_achat: "",
    stock: "",
    unite: "",
    tva: "20",
    actif: true,
    description: "",
    reference_fournisseur: "",
    code_barre: "",
    poids: "",
    dimension: "",
  });

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const representantId = localStorage.getItem("representant_id"); // Récupérer l'ID du représentant depuis le stockage local
      const data = await api.getArticles({ representant_id: representantId }); // Passer representant_id comme paramètre
      setArticles(data);
    } catch (error) {
      setError("Erreur lors du chargement des articles");
    } finally {
      setLoading(false);
    }
  };

  const handleAddArticle = async (e) => {
    e.preventDefault();
    try {
      await api.createArticle(newArticle);
      setShowAddForm(false);
      setNewArticle({
        code: "",
        libelle: "",
        famille: "",
        sousfamille: "",
        marque: "",
        prix_unitaire: "",
        prix_achat: "",
        stock: "",
        unite: "",
        tva: "20",
        actif: true,
        description: "",
        reference_fournisseur: "",
        code_barre: "",
        poids: "",
        dimension: "",
      });
      loadArticles();
    } catch (error) {
      setError("Erreur lors de l'ajout de l'article");
    }
  };

  const handleEditArticle = async (e) => {
    e.preventDefault();
    try {
      await api.updateArticle(editingArticle.code, editingArticle);
      setEditingArticle(null);
      loadArticles();
    } catch (error) {
      setError("Erreur lors de la modification de l'article");
    }
  };

  const handleDeleteArticle = async (code) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
      try {
        await api.deleteArticle(code);
        loadArticles();
      } catch (error) {
        setError("Erreur lors de la suppression de l'article");
      }
    }
  };

  // Filtrage des articles
  const filteredArticles = articles.filter((article) => {
    if (!article) return false;

    const matchesSearch =
      (article.code &&
        article.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (article.libelle &&
        article.libelle.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (article.famille &&
        article.famille.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (article.marque &&
        article.marque.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilters =
      (filters.famille === "" || article.famille === filters.famille) &&
      (filters.sousfamille === "" ||
        article.sousfamille === filters.sousfamille) &&
      (filters.marque === "" || article.marque === filters.marque) &&
      (filters.actif === "all" ||
        (filters.actif === "actif" && article.actif) ||
        (filters.actif === "inactif" && !article.actif));

    return matchesSearch && matchesFilters;
  });

  const columns = [
    { key: "code", label: "Code", sortable: true },
    { key: "libelle", label: "Libellé", sortable: true },
    { key: "famille", label: "Famille", sortable: true },
    { key: "sousfamille", label: "Sous-famille", sortable: true },
    { key: "marque", label: "Marque", sortable: true },
    {
      key: "prix_unitaire",
      label: "Prix TTC",
      sortable: true,
      render: (article) =>
        article.prix_unitaire
          ? `${parseFloat(article.prix_unitaire).toFixed(2)} DT`
          : "-",
    },
    {
      key: "stock",
      label: "Stock",
      sortable: true,
      render: (article) => `${article.stock || 0} ${article.unite || ""}`,
    },
    {
      key: "actif",
      label: "Statut",
      render: (article) => (
        <span className={`status ${article.actif ? "active" : "inactive"}`}>
          {article.actif ? "Actif" : "Inactif"}
        </span>
      ),
    },
  ];

  const actions = [
    {
      icon: FiEdit2,
      label: "Modifier",
      onClick: (article) => setEditingArticle(article),
      className: "edit",
    },
    {
      icon: FiTrash2,
      label: "Supprimer",
      onClick: (article) => handleDeleteArticle(article.code),
      className: "delete",
    },
  ];

  // Obtenir les valeurs uniques pour les filtres
  const uniqueFamilles = [
    ...new Set(articles.map((a) => a.famille).filter(Boolean)),
  ];
  const uniqueSousFamilles = [
    ...new Set(articles.map((a) => a.sousfamille).filter(Boolean)),
  ];
  const uniqueMarques = [
    ...new Set(articles.map((a) => a.marque).filter(Boolean)),
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Catalogue Articles</h1>
        <Button
          onClick={() => setShowAddForm(true)}
          className="primary"
          icon={FiPlus}
        >
          Ajouter un article
        </Button>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
          <button onClick={() => setError("")}>×</button>
        </div>
      )}

      <div className="filters-section">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Rechercher par code, libellé, famille ou marque..."
          icon={FiSearch}
        />

        <FilterContainer>
          <select
            value={filters.famille}
            onChange={(e) =>
              setFilters({ ...filters, famille: e.target.value })
            }
          >
            <option value="">Toutes les familles</option>
            {uniqueFamilles.map((famille) => (
              <option key={famille} value={famille}>
                {famille}
              </option>
            ))}
          </select>

          <select
            value={filters.sousfamille}
            onChange={(e) =>
              setFilters({ ...filters, sousfamille: e.target.value })
            }
          >
            <option value="">Toutes les sous-familles</option>
            {uniqueSousFamilles.map((sousfamille) => (
              <option key={sousfamille} value={sousfamille}>
                {sousfamille}
              </option>
            ))}
          </select>

          <select
            value={filters.marque}
            onChange={(e) => setFilters({ ...filters, marque: e.target.value })}
          >
            <option value="">Toutes les marques</option>
            {uniqueMarques.map((marque) => (
              <option key={marque} value={marque}>
                {marque}
              </option>
            ))}
          </select>

          <select
            value={filters.actif}
            onChange={(e) => setFilters({ ...filters, actif: e.target.value })}
          >
            <option value="all">Tous les statuts</option>
            <option value="actif">Actifs seulement</option>
            <option value="inactif">Inactifs seulement</option>
          </select>
        </FilterContainer>
      </div>

      <DataTable
        data={filteredArticles}
        columns={columns}
        actions={actions}
        loading={loading}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        itemsPerPage={20}
      />

      {/* Formulaire d'ajout */}
      {showAddForm && (
        <FormCard
          title="Ajouter un article"
          onClose={() => setShowAddForm(false)}
        >
          <form onSubmit={handleAddArticle}>
            <div className="form-grid">
              <div className="form-group">
                <label>Code *</label>
                <input
                  type="text"
                  value={newArticle.code}
                  onChange={(e) =>
                    setNewArticle({ ...newArticle, code: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Libellé *</label>
                <input
                  type="text"
                  value={newArticle.libelle}
                  onChange={(e) =>
                    setNewArticle({ ...newArticle, libelle: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Famille</label>
                <input
                  type="text"
                  value={newArticle.famille}
                  onChange={(e) =>
                    setNewArticle({ ...newArticle, famille: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Sous-famille</label>
                <input
                  type="text"
                  value={newArticle.sousfamille}
                  onChange={(e) =>
                    setNewArticle({
                      ...newArticle,
                      sousfamille: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Marque</label>
                <input
                  type="text"
                  value={newArticle.marque}
                  onChange={(e) =>
                    setNewArticle({ ...newArticle, marque: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Prix unitaire TTC</label>
                <input
                  type="number"
                  step="0.01"
                  value={newArticle.prix_unitaire}
                  onChange={(e) =>
                    setNewArticle({
                      ...newArticle,
                      prix_unitaire: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Prix d'achat</label>
                <input
                  type="number"
                  step="0.01"
                  value={newArticle.prix_achat}
                  onChange={(e) =>
                    setNewArticle({ ...newArticle, prix_achat: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Stock</label>
                <input
                  type="number"
                  value={newArticle.stock}
                  onChange={(e) =>
                    setNewArticle({ ...newArticle, stock: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Unité</label>
                <input
                  type="text"
                  value={newArticle.unite}
                  onChange={(e) =>
                    setNewArticle({ ...newArticle, unite: e.target.value })
                  }
                  placeholder="pièce, kg, litre..."
                />
              </div>

              <div className="form-group">
                <label>TVA (%)</label>
                <select
                  value={newArticle.tva}
                  onChange={(e) =>
                    setNewArticle({ ...newArticle, tva: e.target.value })
                  }
                >
                  <option value="0">0%</option>
                  <option value="7">7%</option>
                  <option value="13">13%</option>
                  <option value="20">20%</option>
                </select>
              </div>

              <div className="form-group">
                <label>Code barre</label>
                <input
                  type="text"
                  value={newArticle.code_barre}
                  onChange={(e) =>
                    setNewArticle({ ...newArticle, code_barre: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Référence fournisseur</label>
                <input
                  type="text"
                  value={newArticle.reference_fournisseur}
                  onChange={(e) =>
                    setNewArticle({
                      ...newArticle,
                      reference_fournisseur: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group full-width">
                <label>Description</label>
                <textarea
                  value={newArticle.description}
                  onChange={(e) =>
                    setNewArticle({
                      ...newArticle,
                      description: e.target.value,
                    })
                  }
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={newArticle.actif}
                    onChange={(e) =>
                      setNewArticle({ ...newArticle, actif: e.target.checked })
                    }
                  />
                  Article actif
                </label>
              </div>
            </div>

            <div className="form-actions">
              <Button type="button" onClick={() => setShowAddForm(false)}>
                Annuler
              </Button>
              <Button type="submit" className="primary">
                Ajouter
              </Button>
            </div>
          </form>
        </FormCard>
      )}

      {/* Formulaire de modification */}
      {editingArticle && (
        <FormCard
          title="Modifier l'article"
          onClose={() => setEditingArticle(null)}
        >
          <form onSubmit={handleEditArticle}>
            <div className="form-grid">
              <div className="form-group">
                <label>Code</label>
                <input type="text" value={editingArticle.code} disabled />
              </div>

              <div className="form-group">
                <label>Libellé *</label>
                <input
                  type="text"
                  value={editingArticle.libelle}
                  onChange={(e) =>
                    setEditingArticle({
                      ...editingArticle,
                      libelle: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Famille</label>
                <input
                  type="text"
                  value={editingArticle.famille || ""}
                  onChange={(e) =>
                    setEditingArticle({
                      ...editingArticle,
                      famille: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Sous-famille</label>
                <input
                  type="text"
                  value={editingArticle.sousfamille || ""}
                  onChange={(e) =>
                    setEditingArticle({
                      ...editingArticle,
                      sousfamille: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Marque</label>
                <input
                  type="text"
                  value={editingArticle.marque || ""}
                  onChange={(e) =>
                    setEditingArticle({
                      ...editingArticle,
                      marque: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Prix unitaire TTC</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingArticle.prix_unitaire || ""}
                  onChange={(e) =>
                    setEditingArticle({
                      ...editingArticle,
                      prix_unitaire: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Prix d'achat</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingArticle.prix_achat || ""}
                  onChange={(e) =>
                    setEditingArticle({
                      ...editingArticle,
                      prix_achat: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Stock</label>
                <input
                  type="number"
                  value={editingArticle.stock || ""}
                  onChange={(e) =>
                    setEditingArticle({
                      ...editingArticle,
                      stock: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Unité</label>
                <input
                  type="text"
                  value={editingArticle.unite || ""}
                  onChange={(e) =>
                    setEditingArticle({
                      ...editingArticle,
                      unite: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>TVA (%)</label>
                <select
                  value={editingArticle.tva || "20"}
                  onChange={(e) =>
                    setEditingArticle({
                      ...editingArticle,
                      tva: e.target.value,
                    })
                  }
                >
                  <option value="0">0%</option>
                  <option value="7">7%</option>
                  <option value="13">13%</option>
                  <option value="20">20%</option>
                </select>
              </div>

              <div className="form-group">
                <label>Code barre</label>
                <input
                  type="text"
                  value={editingArticle.code_barre || ""}
                  onChange={(e) =>
                    setEditingArticle({
                      ...editingArticle,
                      code_barre: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Référence fournisseur</label>
                <input
                  type="text"
                  value={editingArticle.reference_fournisseur || ""}
                  onChange={(e) =>
                    setEditingArticle({
                      ...editingArticle,
                      reference_fournisseur: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group full-width">
                <label>Description</label>
                <textarea
                  value={editingArticle.description || ""}
                  onChange={(e) =>
                    setEditingArticle({
                      ...editingArticle,
                      description: e.target.value,
                    })
                  }
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={editingArticle.actif}
                    onChange={(e) =>
                      setEditingArticle({
                        ...editingArticle,
                        actif: e.target.checked,
                      })
                    }
                  />
                  Article actif
                </label>
              </div>
            </div>

            <div className="form-actions">
              <Button type="button" onClick={() => setEditingArticle(null)}>
                Annuler
              </Button>
              <Button type="submit" className="primary">
                Modifier
              </Button>
            </div>
          </form>
        </FormCard>
      )}
    </div>
  );
}
