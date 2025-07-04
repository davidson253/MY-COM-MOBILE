import express from "express";
import Representant from "../models/representantModel.js";
import Log from "../models/logModel.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Obtenir tous les représentants
router.get("/", auth, async (req, res) => {
  try {
    const representants = await Representant.getAll();
    res.json(representants);
  } catch (error) {
    console.error("Erreur lors de la récupération des représentants:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Obtenir un représentant par code
router.get("/:code", auth, async (req, res) => {
  try {
    const representant = await Representant.findByCode(req.params.code);
    if (!representant) {
      return res.status(404).json({ error: "Représentant non trouvé" });
    }
    // Ne pas renvoyer le mot de passe
    delete representant.password;
    res.json(representant);
  } catch (error) {
    console.error("Erreur lors de la récupération du représentant:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Obtenir les logs de connexion (admin uniquement ou représentant pour ses propres logs)
router.get("/:code/logs", auth, async (req, res) => {
  try {
    const requestedCode = req.params.code;
    const currentUserCode = req.representant.code;

    // Vérifier que l'utilisateur consulte ses propres logs ou est admin
    if (
      requestedCode !== currentUserCode &&
      req.representant.typerep !== "Admin"
    ) {
      return res.status(403).json({ error: "Accès non autorisé" });
    }

    const logs = await Log.getLogsByRepresentant(requestedCode);
    res.json(logs);
  } catch (error) {
    console.error("Erreur lors de la récupération des logs:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Obtenir tous les logs de connexion (admin uniquement)
router.get("/logs/all", auth, async (req, res) => {
  try {
    if (req.representant.typerep !== "Admin") {
      return res
        .status(403)
        .json({ error: "Accès réservé aux administrateurs" });
    }

    const limit = parseInt(req.query.limit) || 100;
    const logs = await Log.getConnectionLogs(limit);
    res.json(logs);
  } catch (error) {
    console.error("Erreur lors de la récupération des logs:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
