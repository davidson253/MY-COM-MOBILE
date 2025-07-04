/**
 * Utilitaires pour la traçabilité des actions utilisateur
 * Gère l'attribution automatique des champs usera, userm, users
 */

import db from "../models/db.js";

/**
 * Récupère les informations utilisateur pour la traçabilité
 * @param {number} userId - ID de l'utilisateur
 * @returns {object} - Objet avec code et libellé utilisateur
 */
export const getUserTraceInfo = async (userId) => {
  try {
    const [rows] = await db.query(
      "SELECT u_id, name, email FROM users WHERE u_id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return {
        code: userId.toString(),
        libelle: "Utilisateur inconnu",
      };
    }

    const user = rows[0];
    return {
      code: user.u_id.toString(),
      libelle: user.name || user.email,
    };
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des infos utilisateur:",
      error
    );
    return {
      code: userId.toString(),
      libelle: "Erreur récupération",
    };
  }
};

/**
 * Prépare les champs de traçabilité pour la création
 * @param {number} userId - ID de l'utilisateur
 * @returns {object} - Champs usera et libusera
 */
export const prepareCreateTrace = async (userId) => {
  const userInfo = await getUserTraceInfo(userId);
  return {
    usera: userInfo.code,
    libusera: userInfo.libelle,
  };
};

/**
 * Prépare les champs de traçabilité pour la modification
 * @param {number} userId - ID de l'utilisateur
 * @returns {object} - Champs userm, libuserm et datem
 */
export const prepareUpdateTrace = async (userId) => {
  const userInfo = await getUserTraceInfo(userId);
  return {
    userm: userInfo.code,
    libuserm: userInfo.libelle,
    datem: new Date().toISOString().split("T")[0], // Format YYYY-MM-DD
  };
};

/**
 * Prépare les champs de traçabilité pour la suppression
 * @param {number} userId - ID de l'utilisateur
 * @returns {object} - Champs users et libusers
 */
export const prepareDeleteTrace = async (userId) => {
  const userInfo = await getUserTraceInfo(userId);
  return {
    users: userInfo.code,
    libusers: userInfo.libelle,
  };
};
