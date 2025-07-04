import Facture from "../models/factureModel.js";
import Log from "../models/logModel.js";
import db from "../models/db.js";

/**
 * Controller pour la gestion des factures
 * Basé sur les tables ebcw/lbcw avec filtrage par représentant
 */

export const getFactures = async (req, res) => {
  try {
    // Filtrage automatique par représentant connecté
    const representantCode = req.user?.code;
    if (!representantCode) {
      return res.status(401).json({ error: "Représentant non authentifié" });
    }

    const factures = await Facture.getByRepresentant(representantCode);
    res.json(factures);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getFactureById = async (req, res) => {
  try {
    // Filtrage automatique par représentant connecté
    const representantCode = req.user?.code;
    if (!representantCode) {
      return res.status(401).json({ error: "Représentant non authentifié" });
    }

    const facture = await Facture.getByIdAndRepresentant(
      req.params.numfact,
      representantCode
    );

    if (!facture) {
      return res
        .status(404)
        .json({
          error: "Facture non trouvée ou n'appartenant pas à ce représentant",
        });
    }

    res.json(facture);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createFactureFromCommande = async (req, res) => {
  try {
    // Vérifier l'authentification du représentant
    const representantCode = req.user?.code;
    if (!representantCode) {
      return res.status(401).json({ error: "Représentant non authentifié" });
    }

    const { numbc } = req.params;
    const factureData = {
      numfactf: req.body.numfactf,
      datefact: req.body.datefact || new Date().toISOString().split("T")[0],
      typeFacture: req.body.typeFacture || "NORMALE",
    };

    // Vérifier que la commande appartient au représentant
    const commande = await Facture.getByIdAndRepresentant(
      numbc,
      representantCode
    );
    if (!commande) {
      return res
        .status(404)
        .json({
          error: "Commande non trouvée ou n'appartenant pas à ce représentant",
        });
    }

    const result = await Facture.createFromCommande(numbc, factureData);

    // Enregistrer l'action dans les logs
    await Log.create({
      representant_code: representantCode,
      action: "CREATE_FACTURE",
      entity: "facture",
      entity_id: result.numfact,
      details: {
        numbc: numbc,
        numfactf: result.numfactf,
        datefact: factureData.datefact,
        typeFacture: factureData.typeFacture,
      },
    });

    res.status(201).json({
      message: "Facture créée à partir de la commande",
      numfact: result.numfact,
      numfactf: result.numfactf,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCommandesNonFacturees = async (req, res) => {
  try {
    // Filtrage automatique par représentant connecté
    const representantCode = req.user?.code;
    if (!representantCode) {
      return res.status(401).json({ error: "Représentant non authentifié" });
    }

    const commandes = await Facture.getCommandesNonFacturees(representantCode);
    res.json(commandes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getStatsFactures = async (req, res) => {
  try {
    // Filtrage automatique par représentant connecté
    const representantCode = req.user?.code;
    if (!representantCode) {
      return res.status(401).json({ error: "Représentant non authentifié" });
    }

    const stats = await Facture.getStatsFactures(representantCode);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const marquerFacturePayee = async (req, res) => {
  try {
    // Vérifier l'authentification du représentant
    const representantCode = req.user?.code;
    if (!representantCode) {
      return res.status(401).json({ error: "Représentant non authentifié" });
    }

    const { numfact } = req.params;
    const { montantPaye } = req.body;

    // Vérifier que la facture appartient au représentant
    const facture = await Facture.getByIdAndRepresentant(
      numfact,
      representantCode
    );
    if (!facture) {
      return res
        .status(404)
        .json({
          error: "Facture non trouvée ou n'appartenant pas à ce représentant",
        });
    }

    const result = await Facture.marquerPayee(numfact, montantPaye);

    // Enregistrer l'action dans les logs
    await Log.create({
      representant_code: representantCode,
      action: "PAYMENT",
      entity: "facture",
      entity_id: numfact,
      details: {
        montantPaye: montantPaye,
        ancien_montant: facture.entete?.mpayer || 0,
      },
    });

    res.json({
      message: "Facture marquée comme payée",
      montantPaye: montantPaye,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getFactureLogs = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM logs WHERE entity = 'facture' AND entity_id = ? ORDER BY timestamp DESC",
      [req.params.numfact]
    );

    // Parser les détails JSON pour un affichage plus lisible
    const logs = rows.map((log) => ({
      ...log,
      details: log.details ? JSON.parse(log.details) : null,
    }));

    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
