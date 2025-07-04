import Reglement from "../models/reglementModel.js";
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
 * Controller pour la gestion des règlements
 * Gère les opérations CRUD avec logging automatique des modifications
 */

// Restauration d'un règlement supprimé
export const restoreReglement = async (req, res) => {
  try {
    const reglement = await Reglement.getById(req.params.numreg);
    const representantCode = req.user?.code;
    if (!representantCode) {
      return res.status(401).json({ error: "Représentant non authentifié" });
    }
    if (!reglement || !reglement.users) {
      return res
        .status(400)
        .json({ error: "Règlement non supprimé ou inexistant" });
    }
    // Vider les champs de suppression et renseigner userm/libuserm/datem
    const now = new Date();
    const updateFields = {
      users: null,
      libusers: null,
      userm: req.user?.code,
      libuserm: req.user?.libelle || req.user?.name || req.user?.username || "",
      datem: now,
    };
    await Reglement.update(req.params.numreg, updateFields);
    await Log.create({
      user_id: req.user?.id || 1,
      representant_code: representantCode,
      action: "RESTORE",
      entity: "reglement",
      entity_id: req.params.numreg,
      details: { restored_data: reglement },
    });
    res.json({ message: "Règlement restauré" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getReglements = async (req, res) => {
  try {
    const representantCode = req.representant_id;
    if (!representantCode) {
      return res.status(401).json({ error: "Représentant non authentifié" });
    }
    const reglements = await Reglement.getByRepresentant(representantCode);
    if (!Array.isArray(reglements)) {
      return res.json([]);
    }
    res.json(reglements);
  } catch (error) {
    res.status(500).json({ error: error.message || "Erreur serveur" });
  }
};

export const getReglementById = async (req, res) => {
  try {
    const representantCode = req.user?.code;
    if (!representantCode) {
      return res.status(401).json({ error: "Représentant non authentifié" });
    }
    const reglement = await Reglement.getByIdAndRepresentant(
      req.params.numreg,
      representantCode
    );
    if (!reglement)
      return res.status(404).json({ error: "Règlement non trouvé" });
    res.json(reglement);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getReglementsByClient = async (req, res) => {
  try {
    const representantCode = req.user?.code;
    if (!representantCode) {
      return res.status(401).json({ error: "Représentant non authentifié" });
    }
    const reglements = await Reglement.getByClientAndRepresentant(
      req.params.codecli,
      representantCode
    );
    res.json(reglements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createReglement = async (req, res) => {
  try {
    const reglementData = { ...req.body };
    if (req.user?.id) {
      const createTrace = await prepareCreateTrace(req.user.id);
      Object.assign(reglementData, createTrace);
    }
    const result = await Reglement.create(reglementData);
    if (req.user?.id) {
      await Log.create({
        user_id: req.user.id,
        action: "create",
        entity: "reglement",
        entity_id: result.numreg,
        details: reglementData,
      });
    }
    res.status(201).json({ message: "Règlement créé", result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateReglement = async (req, res) => {
  try {
    const oldReglement = await Reglement.getById(req.params.numreg);
    const reglementData = { ...req.body };
    if (req.user?.id) {
      const updateTrace = await prepareUpdateTrace(req.user.id);
      Object.assign(reglementData, updateTrace);
    }
    const result = await Reglement.update(req.params.numreg, reglementData);
    if (req.user?.id && oldReglement) {
      const dataForComparison = { ...req.body };
      const changedFields = getChangedFields(oldReglement, dataForComparison);
      if (Object.keys(changedFields).length > 0) {
        const normalizedOldData = normalizeDataForLog(oldReglement);
        const normalizedNewData = normalizeDataForLog(dataForComparison);
        for (const key of Object.keys(changedFields)) {
          const oldValue =
            normalizedOldData[key] !== undefined
              ? normalizedOldData[key]
              : oldReglement[key];
          const newValue =
            normalizedNewData[key] !== undefined
              ? normalizedNewData[key]
              : dataForComparison[key];
          await Log.create({
            user_id: req.user.id,
            action: "update",
            entity: "reglement",
            entity_id: req.params.numreg,
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
    res.json({ message: "Règlement modifié", result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Suppression (soft delete) : met à jour users/libusers avec l'utilisateur connecté
export const deleteReglement = async (req, res) => {
  try {
    const representantCode = req.user?.code;
    if (!representantCode) {
      return res.status(401).json({ error: "Représentant non authentifié" });
    }
    const reglement = await Reglement.getByIdAndRepresentant(
      req.params.numreg,
      representantCode
    );
    if (!reglement) {
      return res.status(404).json({ error: "Règlement non trouvé" });
    }
    if (reglement.users) {
      return res
        .status(400)
        .json({ error: "Règlement déjà supprimé (soft delete)" });
    }
    // Met à jour users/libusers avec l'utilisateur connecté
    const now = new Date();
    const deleteTrace = {
      users: req.user?.code,
      libusers: req.user?.libelle || req.user?.name || req.user?.username || "",
      datem: now,
    };
    await Reglement.update(req.params.numreg, deleteTrace);
    await Log.create({
      user_id: req.user?.id || 1,
      representant_code: representantCode,
      action: "DELETE",
      entity: "reglement",
      entity_id: req.params.numreg,
      details: { deleted_data: reglement },
    });
    res.json({ message: "Suppression (soft delete) effectuée avec succès." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getStatsReglements = async (req, res) => {
  try {
    const { dateDebut, dateFin } = req.query;
    const stats = await Reglement.getStatsByPeriod(dateDebut, dateFin);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
