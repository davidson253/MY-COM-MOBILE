// Fichier pour centraliser les appels à l'API backend
// Exemple d'utilisation : import api from './services/api';

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Helper pour ajouter le header Authorization si token
function authFetch(url, options = {}) {
  const token = localStorage.getItem("token");
  const headers = { ...(options.headers || {}) };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  return fetch(url, { ...options, headers }).then(async (res) => {
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      return Promise.reject("Session expirée");
    }

    // Gérer les erreurs HTTP avec les messages du serveur
    if (!res.ok) {
      const errorData = await res
        .json()
        .catch(() => ({ error: "Erreur inconnue" }));
      throw new Error(errorData.error || `Erreur HTTP ${res.status}`);
    }

    return res;
  });
}

const api = {
  // Clients
  getClients: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.representant_id) {
      queryParams.append("representant_id", params.representant_id);
    }
    const url = queryParams.toString()
      ? `${API_BASE}/clients?${queryParams.toString()}`
      : `${API_BASE}/clients`;
    return authFetch(url).then((res) => res.json());
  },
  getClient: (code) =>
    authFetch(`${API_BASE}/clients/${code}`).then((res) => res.json()),
  createClient: (data) =>
    authFetch(`${API_BASE}/clients`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((res) => res.json()),
  updateClient: (code, data) =>
    authFetch(`${API_BASE}/clients/${code}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((res) => res.json()),
  deleteClient: (code) =>
    authFetch(`${API_BASE}/clients/${code}`, {
      method: "DELETE",
    }).then((res) => res.json()),
  getClientLogs: (code) =>
    authFetch(`${API_BASE}/clients/${code}/logs`).then((res) => res.json()),
  // Articles
  getArticles: () =>
    authFetch(`${API_BASE}/articles`).then((res) => res.json()),
  getArticle: (code) =>
    authFetch(`${API_BASE}/articles/${code}`).then((res) => res.json()),
  createArticle: (data) =>
    authFetch(`${API_BASE}/articles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((res) => res.json()),
  updateArticle: (code, data) =>
    authFetch(`${API_BASE}/articles/${code}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((res) => res.json()),
  deleteArticle: (code) =>
    authFetch(`${API_BASE}/articles/${code}`, {
      method: "DELETE",
    }).then((res) => res.json()),
  restoreArticle: (code) =>
    authFetch(`${API_BASE}/articles/${code}/restore`, {
      method: "PATCH",
    }).then((res) => res.json()),
  // Commandes
  getCommandes: () =>
    authFetch(`${API_BASE}/commandes`).then((res) => res.json()),
  getCommande: (numbc) =>
    authFetch(`${API_BASE}/commandes/${numbc}`).then((res) => res.json()),
  createCommande: (data) =>
    authFetch(`${API_BASE}/commandes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((res) => res.json()),
  updateCommande: (numbc, data) =>
    authFetch(`${API_BASE}/commandes/${numbc}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((res) => res.json()),
  deleteCommande: (numbc) =>
    authFetch(`${API_BASE}/commandes/${numbc}`, {
      method: "DELETE",
    }).then((res) => res.json()),
  restoreCommande: (numbc) =>
    authFetch(`${API_BASE}/commandes/${numbc}/restore`, {
      method: "PATCH",
    }).then((res) => res.json()),
  // Auth
  login: async (email, password) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Erreur HTTP ${response.status}`);
    }

    // Stocker le token et les infos utilisateur
    if (data.token && data.user) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("userInfo", JSON.stringify(data.user));
      // Stocker le code du représentant comme representant_id pour compatibilité
      localStorage.setItem("representant_id", data.user.code);
    }

    return data;
  },
  register: async (name, email, password) => {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Erreur HTTP ${response.status}`);
    }

    return data;
  },
  logout: async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await authFetch(`${API_BASE}/auth/logout`, {
          method: "POST",
        });
      } catch (error) {
        // Même si l'appel échoue, on supprime les données locales
      }
    }

    // Nettoyer les données locales
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("representant_id");

    // Rediriger vers la page de connexion
    window.location.href = "/login";
  },
  isAuthenticated: () => {
    const token = localStorage.getItem("token");
    const userInfo = localStorage.getItem("userInfo");

    if (!token || !userInfo) return false;

    try {
      // Vérifier si le token n'est pas expiré
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  },
  // Règlements
  getReglements: () =>
    authFetch(`${API_BASE}/reglements`).then((res) => res.json()),
  getReglement: (numreg) =>
    authFetch(`${API_BASE}/reglements/${numreg}`).then((res) => res.json()),
  getReglementsByClient: (codecli) =>
    authFetch(`${API_BASE}/reglements/client/${codecli}`).then((res) =>
      res.json()
    ),
  createReglement: (data) =>
    authFetch(`${API_BASE}/reglements`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((res) => res.json()),
  updateReglement: (numreg, data) =>
    authFetch(`${API_BASE}/reglements/${numreg}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((res) => res.json()),
  deleteReglement: (numreg) =>
    authFetch(`${API_BASE}/reglements/${numreg}`, {
      method: "DELETE",
    }).then((res) => res.json()),
  restoreReglement: (numreg) =>
    authFetch(`${API_BASE}/reglements/${numreg}/restore`, {
      method: "PATCH",
    }).then((res) => res.json()),
  getStatsReglements: (dateDebut, dateFin) =>
    authFetch(
      `${API_BASE}/reglements/stats?dateDebut=${dateDebut}&dateFin=${dateFin}`
    ).then((res) => res.json()),

  // Factures
  getFactures: () =>
    authFetch(`${API_BASE}/factures`).then((res) => res.json()),
  getFacture: (numfact) =>
    authFetch(`${API_BASE}/factures/${numfact}`).then((res) => res.json()),
  createFactureFromCommande: (numbc, data) =>
    authFetch(`${API_BASE}/factures/from-commande/${numbc}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((res) => res.json()),
  getCommandesNonFacturees: () =>
    authFetch(`${API_BASE}/factures/commandes-non-facturees`).then((res) =>
      res.json()
    ),
  getStatsFactures: () =>
    authFetch(`${API_BASE}/factures/stats`).then((res) => res.json()),
  marquerFacturePayee: (numfact, data) =>
    authFetch(`${API_BASE}/factures/${numfact}/payment`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((res) => res.json()),
  getFactureLogs: (numfact) =>
    authFetch(`${API_BASE}/factures/${numfact}/logs`).then((res) => res.json()),
  // ...autres endpoints à venir...
};

export default api;
