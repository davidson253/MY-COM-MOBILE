// Utilitaires pour la gestion des dates

/**
 * Normalise une date au format YYYY-MM-DD (sans heure)
 * @param {Date|string|null} date - La date à normaliser
 * @returns {string|null} - Date au format YYYY-MM-DD ou null
 */
export const normalizeDateOnly = (date) => {
  if (!date) return null;

  // Si c'est déjà un objet Date
  if (date instanceof Date) {
    return date.toISOString().split("T")[0];
  }

  // Si c'est une string avec timestamp
  if (typeof date === "string") {
    if (date.includes("T")) {
      return date.split("T")[0];
    }
    // Si c'est déjà au bon format YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }
  }

  // Essayer de parser la date
  try {
    const parsedDate = new Date(date);
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate.toISOString().split("T")[0];
    }
  } catch (error) {
    console.error("Erreur lors du parsing de la date:", error);
  }

  return null;
};

/**
 * Normalise une date au format datetime ISO pour la BD
 * @param {Date|string|null} date - La date à normaliser
 * @returns {string|null} - Date au format ISO ou null
 */
export const normalizeDatetime = (date) => {
  if (!date) return null;

  if (date instanceof Date) {
    return date.toISOString();
  }

  if (typeof date === "string") {
    try {
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate.toISOString();
      }
    } catch (error) {
      console.error("Erreur lors du parsing de la date:", error);
    }
  }

  return null;
};

/**
 * Convertit une date pour l'affichage dans un input date HTML
 * @param {Date|string|null} date - La date à convertir
 * @returns {string} - Date au format YYYY-MM-DD pour input
 */
export const formatForDateInput = (date) => {
  const normalized = normalizeDateOnly(date);
  return normalized || "";
};

/**
 * Obtient la date actuelle au format YYYY-MM-DD
 * @returns {string} - Date du jour
 */
export const getCurrentDate = () => {
  return new Date().toISOString().split("T")[0];
};

/**
 * Obtient le timestamp actuel
 * @returns {string} - Timestamp ISO
 */
export const getCurrentTimestamp = () => {
  return new Date().toISOString();
};

/**
 * Normalise les données pour les logs (uniformiser les formats)
 * @param {Object} data - Objet contenant les données
 * @param {Array} dateFields - Liste des champs de type date
 * @returns {Object} - Données avec dates normalisées
 */
export const normalizeDataForLogs = (data, dateFields = []) => {
  if (!data || typeof data !== "object") return data;

  const normalized = { ...data };

  dateFields.forEach((field) => {
    if (normalized[field]) {
      normalized[field] = normalizeDateOnly(normalized[field]);
    }
  });

  return normalized;
};

// Listes des champs de date par table pour faciliter l'usage
export const DATE_FIELDS = {
  reglement: ["datereg", "dateech", "datefact", "dateenc", "datevers"],
  commande: ["datebc", "dateblp"],
  client: ["datedebut", "datefin", "datecreation", "datevalidation"],
  article: ["datem", "datecreation"],
};
