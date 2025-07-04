import db from "./db.js";

const Article = {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM article");
    return rows;
  },
  getById: async (code) => {
    const [rows] = await db.query("SELECT * FROM article WHERE code = ?", [
      code,
    ]);
    return rows[0];
  },

  // Vérifier si un article existe par son code
  exists: async (code) => {
    const [rows] = await db.query(
      "SELECT COUNT(*) as count FROM article WHERE code = ?",
      [code]
    );
    return rows[0].count > 0;
  },

  create: async (data) => {
    const { code, libelle, famille, prixbrut } = data;

    // Vérifier si le code existe déjà
    const codeExists = await Article.exists(code);
    if (codeExists) {
      throw new Error(`Un article avec le code "${code}" existe déjà`);
    }

    const [result] = await db.query(
      "INSERT INTO article (code, libelle, famille, prixbrut) VALUES (?, ?, ?, ?)",
      [code, libelle, famille, prixbrut]
    );
    return result;
  },
  update: async (code, data) => {
    const { libelle, famille, prixbrut } = data;
    const [result] = await db.query(
      "UPDATE article SET libelle=?, famille=?, prixbrut=? WHERE code=?",
      [libelle, famille, prixbrut, code]
    );
    return result;
  },
  delete: async (code) => {
    const [result] = await db.query("DELETE FROM article WHERE code = ?", [
      code,
    ]);
    return result;
  },

  // Soft delete - met à jour users/libusers/datem au lieu de supprimer
  softDelete: async (code, userCode, userLibelle) => {
    const now = new Date();
    const [result] = await db.query(
      "UPDATE article SET users = ?, libusers = ?, datem = ? WHERE code = ? AND (users IS NULL OR users = '')",
      [userCode, userLibelle, now, code]
    );
    return result;
  },

  // Restauration d'un article supprimé
  restore: async (code, userCode, userLibelle) => {
    const now = new Date();
    const [result] = await db.query(
      "UPDATE article SET users = NULL, libusers = NULL, userm = ?, libuserm = ?, datem = ? WHERE code = ? AND users IS NOT NULL",
      [userCode, userLibelle, now, code]
    );
    return result;
  },
};

export default Article;
