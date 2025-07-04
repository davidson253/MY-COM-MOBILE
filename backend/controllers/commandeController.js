import Commande from "../models/commandeModel.js";
import Log from "../models/logModel.js";
import {
  normalizeDataForLog,
  getChangedFields,
} from "../utils/dateLogUtils.js";
import {
  prepareCreateTrace,
  prepareUpdateTrace,
  prepareDeleteTrace,
} from "../utils/userTraceUtils.js";
import { Op } from "sequelize";

/**
 * Controller pour la gestion des commandes
 * Gère les opérations CRUD avec logging automatique des modifications
 */

export const getCommandes = async (req, res) => {
  try {
    // Utilise la méthode du modèle adaptée à la récupération par représentant
    const commandes = await Commande.getByRepresentant(req.representant_id);
    res.json(commandes);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des commandes." });
  }
};

export const getCommandeById = async (req, res) => {
  try {
    // Filtrage automatique par représentant connecté
    const representantCode = req.user?.code;
    if (!representantCode) {
      return res.status(401).json({ error: "Représentant non authentifié" });
    }

    const commande = await Commande.getByIdAndRepresentant(
      req.params.numbc,
      representantCode
    );
    if (!commande.entete)
      return res.status(404).json({ error: "Commande non trouvée" });
    res.json(commande);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createCommande = async (req, res) => {
  try {
    // Vérifier l'authentification du représentant
    const representantCode = req.user?.code;
    if (!representantCode) {
      return res.status(401).json({ error: "Représentant non authentifié" });
    }

    // Préparer les données avec traçabilité utilisateur et champs métiers enrichis
    const commandeData = {
      ...req.body,
      coderep: representantCode, // Assignation automatique au représentant connecté
      librep: req.user?.libelle, // Libellé du représentant
    };

    // Calculs automatiques des montants si les lignes sont fournies
    if (commandeData.lignes && Array.isArray(commandeData.lignes)) {
      let totalHT = 0;
      let totalTVA = 0;

      commandeData.lignes.forEach((ligne) => {
        const sousTotal =
          parseFloat(ligne.puart || 0) * parseInt(ligne.qte || 0);
        totalHT += sousTotal;
        // Calcul TVA (supposons 19% par défaut, peut être personnalisé)
        totalTVA += sousTotal * 0.19;
      });

      // Appliquer la remise si définie
      const remise = parseFloat(commandeData.remise || 0);
      if (remise > 0) {
        totalHT = totalHT * (1 - remise / 100);
        totalTVA = totalTVA * (1 - remise / 100);
      }

      commandeData.mht = totalHT;
      commandeData.mtva = totalTVA;
      commandeData.mttc = totalHT + totalTVA;
    }

    if (req.user?.id) {
      const createTrace = await prepareCreateTrace(req.user.id);
      Object.assign(commandeData, createTrace);
    }

    const result = await Commande.create(commandeData);

    // Log l'action
    if (req.user?.id) {
      await Log.create({
        user_id: req.user.id,
        action: "create",
        entity: "commande",
        entity_id: result.numbc,
        details: commandeData,
      });
    }
    res.status(201).json({ message: "Commande créée", result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCommande = async (req, res) => {
  try {
    // Récupérer la commande avant modification
    const oldCommande = await Commande.getById(req.params.numbc);
    const result = await Commande.update(req.params.numbc, req.body);

    // Log modifications entête
    if (oldCommande && oldCommande.entete && req.user?.id) {
      // Filtrer seulement les champs qui ont réellement changé (sauf lignes)
      const bodyWithoutLignes = { ...req.body };
      delete bodyWithoutLignes.lignes;

      const changedFields = getChangedFields(
        oldCommande.entete,
        bodyWithoutLignes
      );

      // Normaliser les données pour les logs seulement s'il y a des changements
      if (Object.keys(changedFields).length > 0) {
        const normalizedOldData = normalizeDataForLog(oldCommande.entete);
        const normalizedNewData = normalizeDataForLog(bodyWithoutLignes);

        for (const key of Object.keys(changedFields)) {
          const oldValue =
            normalizedOldData[key] !== undefined
              ? normalizedOldData[key]
              : oldCommande.entete[key];
          const newValue =
            normalizedNewData[key] !== undefined
              ? normalizedNewData[key]
              : req.body[key];

          await Log.create({
            user_id: req.user.id,
            action: "update",
            entity: "commande",
            entity_id: req.params.numbc,
            field: key,
            entity_subid: null,
            details: {
              before: oldValue,
              after: newValue,
            },
          });
        }
      }
    }

    // Log modifications lignes
    if (
      oldCommande &&
      Array.isArray(oldCommande.lignes) &&
      req.body.lignes &&
      req.user?.id
    ) {
      // Indexer les anciennes lignes par codeart
      const oldLignes = {};
      oldCommande.lignes.forEach((l) => {
        oldLignes[l.codeart] = l;
      });

      // Indexer les nouvelles lignes par codeart
      const newLignes = {};
      req.body.lignes.forEach((l) => {
        newLignes[l.codeart] = l;
      });

      // Modifications et suppressions
      for (const codeart in oldLignes) {
        if (!newLignes[codeart]) {
          // Suppression de ligne
          await Log.create({
            user_id: req.user.id,
            action: "delete",
            entity: "commande_ligne",
            entity_id: req.params.numbc,
            field: null,
            entity_subid: codeart,
            details: normalizeDataForLog(oldLignes[codeart]),
          });
        } else {
          // Modification de ligne
          const oldL = oldLignes[codeart];
          const newL = newLignes[codeart];
          const normalizedOldL = normalizeDataForLog(oldL);
          const normalizedNewL = normalizeDataForLog(newL);

          for (const key of ["qte", "puart", "famille", "libart"]) {
            if (oldL[key] !== newL[key]) {
              await Log.create({
                user_id: req.user.id,
                action: "update",
                entity: "commande_ligne",
                entity_id: req.params.numbc,
                field: key,
                entity_subid: codeart,
                details: {
                  before: normalizedOldL[key] || oldL[key],
                  after: normalizedNewL[key] || newL[key],
                },
              });
            }
          }
        }
      }
      // Ajouts
      for (const codeart in newLignes) {
        if (!oldLignes[codeart]) {
          await Log.create({
            user_id: req.user.id,
            action: "create",
            entity: "commande_ligne",
            entity_id: req.params.numbc,
            field: null,
            entity_subid: codeart,
            details: normalizeDataForLog(newLignes[codeart]),
          });
        }
      }
    }

    res.json({ message: "Commande modifiée", result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Suppression d'une commande du représentant connecté (soft delete)
export const deleteCommande = async (req, res) => {
  try {
    const representantCode = req.user?.code;
    if (!representantCode) {
      return res.status(401).json({ error: "Représentant non authentifié" });
    }

    const existingCommande = await Commande.getByIdAndRepresentant(
      req.params.numbc,
      representantCode
    );
    if (!existingCommande?.entete) {
      return res
        .status(404)
        .json({ error: "Commande non trouvée ou non autorisée" });
    }

    if (existingCommande.entete.users) {
      return res
        .status(400)
        .json({ error: "Commande déjà supprimée (soft delete)" });
    }

    const userLibelle =
      req.user?.libelle || req.user?.name || req.user?.username || "";
    const result = await Commande.softDelete(
      req.params.numbc,
      representantCode,
      req.user?.code,
      userLibelle
    );

    if (result.affectedRows === 0) {
      return res
        .status(400)
        .json({ error: "Impossible de supprimer cette commande" });
    }

    await Log.create({
      user_id: req.user?.id || 1,
      representant_code: representantCode,
      action: "DELETE",
      entity: "commande",
      entity_id: req.params.numbc,
      details: { deleted_data: existingCommande },
    });

    res.json({ message: "Commande supprimée (soft delete) avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Restauration d'une commande supprimée
export const restoreCommande = async (req, res) => {
  try {
    const representantCode = req.user?.code;
    if (!representantCode) {
      return res.status(401).json({ error: "Représentant non authentifié" });
    }

    const commande = await Commande.getByIdAndRepresentant(
      req.params.numbc,
      representantCode
    );
    if (!commande?.entete || !commande.entete.users) {
      return res
        .status(400)
        .json({ error: "Commande non supprimée ou inexistante" });
    }

    const userLibelle =
      req.user?.libelle || req.user?.name || req.user?.username || "";
    const result = await Commande.restore(
      req.params.numbc,
      representantCode,
      req.user?.code,
      userLibelle
    );

    if (result.affectedRows === 0) {
      return res
        .status(400)
        .json({ error: "Impossible de restaurer cette commande" });
    }

    await Log.create({
      user_id: req.user?.id || 1,
      representant_code: representantCode,
      action: "RESTORE",
      entity: "commande",
      entity_id: req.params.numbc,
      details: { restored_data: commande },
    });

    res.json({ message: "Commande restaurée" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
