// API client moderne compatible axios pour les appels REST
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Helper pour gérer les réponses et erreurs
async function handleResponse(response) {
  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    window.location.href = "/login";
    throw new Error("Session expirée");
  }

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: "Erreur inconnue" }));
    throw new Error(errorData.error || `Erreur HTTP ${response.status}`);
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  return response.text();
}

// Helper pour créer les headers avec authentification
function getHeaders(customHeaders = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...customHeaders,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

// Client API compatible avec la syntaxe axios
const apiClient = {
  async get(url, config = {}) {
    const response = await fetch(`${API_BASE}${url}`, {
      method: "GET",
      headers: getHeaders(config.headers),
      ...config,
    });

    const data = await handleResponse(response);
    return { data };
  },

  async post(url, data, config = {}) {
    const response = await fetch(`${API_BASE}${url}`, {
      method: "POST",
      headers: getHeaders(config.headers),
      body: JSON.stringify(data),
      ...config,
    });

    const responseData = await handleResponse(response);
    return { data: responseData };
  },

  async put(url, data, config = {}) {
    const response = await fetch(`${API_BASE}${url}`, {
      method: "PUT",
      headers: getHeaders(config.headers),
      body: JSON.stringify(data),
      ...config,
    });

    const responseData = await handleResponse(response);
    return { data: responseData };
  },

  async delete(url, config = {}) {
    const response = await fetch(`${API_BASE}${url}`, {
      method: "DELETE",
      headers: getHeaders(config.headers),
      ...config,
    });

    const responseData = await handleResponse(response);
    return { data: responseData };
  },

  async patch(url, data, config = {}) {
    const response = await fetch(`${API_BASE}${url}`, {
      method: "PATCH",
      headers: getHeaders(config.headers),
      body: JSON.stringify(data),
      ...config,
    });

    const responseData = await handleResponse(response);
    return { data: responseData };
  },
};

export default apiClient;
