/**
 * Utilitaires pour la normalisation des dates et des données dans les logs
 * Assure la cohérence du formatage des dates entre les champs "before" et "after" des logs
 */

// Liste des champs de date reconnus dans l'application
const DATE_FIELDS = [
  "dateech",
  "datereg",
  "datefact",
  "dateenc",
  "datevers",
  "dateblp",
  "datebc",
  "datedebut",
  "datefin",
  "datecreation",
  "datevalidation",
];

/**
 * Normalise une date au format YYYY-MM-DD pour les logs
 * @param {*} value - La valeur à normaliser (Date, string, etc.)
 * @returns {string|null} - Date au format YYYY-MM-DD ou null
 */
export const normalizeDateForLog = (value) => {
  if (!value) return null;

  // Si c'est déjà une string au format YYYY-MM-DD, on la retourne telle quelle
  if (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return value;
  }

  // Si c'est un objet Date, on extrait la partie date
  if (value instanceof Date) {
    return value.toISOString().split("T")[0];
  }

  // Si c'est une string avec timestamp ISO, on extrait la partie date
  if (typeof value === "string" && value.includes("T")) {
    return value.split("T")[0];
  }

  // Si c'est une string datetime SQL format, on la convertit
  if (
    typeof value === "string" &&
    value.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/)
  ) {
    return value.split(" ")[0];
  }

  // Pour tout autre cas, on retourne la valeur telle quelle
  return value;
};

/**
 * Normalise une valeur en traitant null, "", undefined comme équivalents
 * @param {*} value - La valeur à normaliser
 * @returns {*} - Valeur normalisée (null pour les valeurs vides)
 */
export const normalizeValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  return value;
};

/**
 * Normalise toutes les données d'un objet pour les logs
 * Applique la normalisation des dates et des valeurs vides
 * @param {object} data - L'objet à normaliser
 * @returns {object} - Objet avec données normalisées
 */
export const normalizeDataForLog = (data) => {
  if (!data || typeof data !== "object") return data;

  const normalizedData = {};

  for (const [key, value] of Object.entries(data)) {
    if (DATE_FIELDS.includes(key)) {
      normalizedData[key] = normalizeDateForLog(value);
    } else {
      normalizedData[key] = normalizeValue(value);
    }
  }

  return normalizedData;
};

/**
 * Compare deux valeurs en tenant compte de la normalisation
 * @param {*} oldValue - Ancienne valeur
 * @param {*} newValue - Nouvelle valeur
 * @param {string} fieldName - Nom du champ (pour déterminer le type)
 * @returns {boolean} - true si les valeurs sont équivalentes
 */
export const valuesAreEqual = (oldValue, newValue, fieldName) => {
  let normalizedOldValue, normalizedNewValue;

  if (DATE_FIELDS.includes(fieldName)) {
    normalizedOldValue = normalizeDateForLog(oldValue);
    normalizedNewValue = normalizeDateForLog(newValue);
  } else {
    normalizedOldValue = normalizeValue(oldValue);
    normalizedNewValue = normalizeValue(newValue);
  }

  return normalizedOldValue === normalizedNewValue;
};

/**
 * Filtre les champs qui ont réellement changé entre deux objets
 * @param {object} oldData - Anciennes données
 * @param {object} newData - Nouvelles données
 * @returns {object} - Objet contenant seulement les champs modifiés
 */
export const getChangedFields = (oldData, newData) => {
  const changedFields = {};

  for (const key in newData) {
    if (!valuesAreEqual(oldData[key], newData[key], key)) {
      changedFields[key] = newData[key];
    }
  }

  return changedFields;
};
