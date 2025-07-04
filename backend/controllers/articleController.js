import Article from "../models/articleModel.js";
import Log from "../models/logModel.js";
import {
  normalizeDataForLog,
  getChangedFields,
  valuesAreEqual,
} from "../utils/dateLogUtils.js";
import {
  prepareCreateTrace,
  prepareUpdateTrace,
  prepareDeleteTrace,
} from "../utils/userTraceUtils.js";

/**
 * Controller pour la gestion des articles
 * Gère les opérations CRUD avec logging automatique des modifications
 */

export const getArticles = async (req, res) => {
  try {
    const articles = await Article.getAll();
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getArticleById = async (req, res) => {
  try {
    const article = await Article.getById(req.params.code);
    if (!article) return res.status(404).json({ error: "Article non trouvé" });
    res.json(article);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createArticle = async (req, res) => {
  try {
    // Validation des données d'entrée
    const { code, libelle, famille, prixbrut } = req.body;

    // Vérifications de base
    if (!code || !libelle || !famille || !prixbrut) {
      return res.status(400).json({
        error: "Tous les champs sont requis (code, libelle, famille, prixbrut)",
      });
    }

    // Convertir la famille en majuscules
    req.body.famille = famille.toUpperCase();

    // Validation du prix
    if (isNaN(prixbrut) || Number(prixbrut) <= 0) {
      return res.status(400).json({
        error: "Le prix brut doit être un nombre positif",
      });
    }

    // Validation de la longueur du code
    if (code.length > 50) {
      return res.status(400).json({
        error: "Le code ne peut pas dépasser 50 caractères",
      });
    }

    const result = await Article.create(req.body);

    // Log l'action
    if (req.user?.id) {
      await Log.create({
        user_id: req.user.id,
        action: "create",
        entity: "article",
        entity_id: req.body.code,
        details: req.body,
      });
    }

    res.status(201).json({
      message: "Article créé avec succès",
      result,
      article: { code, libelle, famille: req.body.famille, prixbrut },
    });
  } catch (err) {
    // Gestion spécifique des erreurs de contrainte de clé primaire
    if (err.message.includes("existe déjà")) {
      return res.status(409).json({ error: err.message });
    }

    // Gestion des erreurs de base de données MySQL
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        error: `Un article avec le code "${req.body.code}" existe déjà`,
      });
    }

    console.error("Erreur lors de la création de l'article:", err);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

export const updateArticle = async (req, res) => {
  try {
    const { code } = req.params;
    const { libelle, famille, prixbrut } = req.body;

    // Vérifier si l'article existe
    const existingArticle = await Article.getById(code);
    if (!existingArticle) {
      return res.status(404).json({ error: "Article non trouvé" });
    }

    // Validations
    if (!libelle || !famille || !prixbrut) {
      return res.status(400).json({
        error: "Tous les champs sont requis (libelle, famille, prixbrut)",
      });
    }

    if (isNaN(prixbrut) || Number(prixbrut) <= 0) {
      return res.status(400).json({
        error: "Le prix brut doit être un nombre positif",
      });
    }

    // Convertir la famille en majuscules
    req.body.famille = famille.toUpperCase();

    const oldArticle = { ...existingArticle };
    const result = await Article.update(code, req.body);

    // Log les modifications
    if (req.user?.id) {
      const changes = [];

      // Utiliser la fonction de comparaison intelligente
      if (!valuesAreEqual(oldArticle.libelle, libelle, "libelle"))
        changes.push("libelle");
      if (!valuesAreEqual(oldArticle.famille, req.body.famille, "famille"))
        changes.push("famille");
      if (!valuesAreEqual(oldArticle.prixbrut, prixbrut, "prixbrut"))
        changes.push("prixbrut");

      if (changes.length > 0) {
        // Normaliser les données pour les logs seulement s'il y a des changements
        const normalizedOldData = normalizeDataForLog(oldArticle);
        const normalizedNewData = normalizeDataForLog(req.body);

        for (const field of changes) {
          const oldValue =
            normalizedOldData[field] !== undefined
              ? normalizedOldData[field]
              : oldArticle[field];
          const newValue =
            normalizedNewData[field] !== undefined
              ? normalizedNewData[field]
              : req.body[field];

          await Log.create({
            user_id: req.user.id,
            action: "update",
            entity: "article",
            entity_id: code,
            field: field,
            entity_subid: null,
            details: {
              before: oldValue,
              after: newValue,
            },
          });
        }
      }
    }

    res.json({
      message: "Article modifié avec succès",
      result,
      article: { code, libelle, famille: req.body.famille, prixbrut },
    });
  } catch (err) {
    console.error("Erreur lors de la mise à jour de l'article:", err);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

// Suppression d'un article (soft delete)
export const deleteArticle = async (req, res) => {
  try {
    const { code } = req.params;

    // Vérifier si l'article existe avant suppression
    const existingArticle = await Article.getById(code);
    if (!existingArticle) {
      return res.status(404).json({ error: "Article non trouvé" });
    }

    if (existingArticle.users) {
      return res
        .status(400)
        .json({ error: "Article déjà supprimé (soft delete)" });
    }

    const userLibelle =
      req.user?.libelle || req.user?.name || req.user?.username || "";
    const result = await Article.softDelete(code, req.user?.code, userLibelle);

    if (result.affectedRows === 0) {
      return res
        .status(400)
        .json({ error: "Impossible de supprimer cet article" });
    }

    // Log l'action avec representant_code et données supprimées
    await Log.create({
      user_id: req.user?.id || 1,
      representant_code: req.user?.code,
      action: "DELETE",
      entity: "article",
      entity_id: code,
      details: { deleted_data: existingArticle },
    });

    res.json({
      message: "Article supprimé (soft delete) avec succès",
      result,
    });
  } catch (err) {
    console.error("Erreur lors de la suppression de l'article:", err);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

// Restauration d'un article supprimé
export const restoreArticle = async (req, res) => {
  try {
    const { code } = req.params;

    const article = await Article.getById(code);
    if (!article || !article.users) {
      return res
        .status(400)
        .json({ error: "Article non supprimé ou inexistant" });
    }

    const userLibelle =
      req.user?.libelle || req.user?.name || req.user?.username || "";
    const result = await Article.restore(code, req.user?.code, userLibelle);

    if (result.affectedRows === 0) {
      return res
        .status(400)
        .json({ error: "Impossible de restaurer cet article" });
    }

    await Log.create({
      user_id: req.user?.id || 1,
      representant_code: req.user?.code,
      action: "RESTORE",
      entity: "article",
      entity_id: code,
      details: { restored_data: article },
    });

    res.json({ message: "Article restauré" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
