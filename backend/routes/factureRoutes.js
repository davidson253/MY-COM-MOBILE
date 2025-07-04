import express from "express";
import auth from "../middleware/auth.js";
import {
  getFactures,
  getFactureById,
  createFactureFromCommande,
  getCommandesNonFacturees,
  getStatsFactures,
  marquerFacturePayee,
  getFactureLogs,
} from "../controllers/factureController.js";

const router = express.Router();

// Middleware pour filtrer par representant_id
const filterByRepresentant = (req, res, next) => {
  if (req.user && req.user.representant_id) {
    req.representant_id = req.user.representant_id;
  } else {
    return res
      .status(403)
      .json({ message: "Accès interdit : representant_id manquant." });
  }
  next();
};

// Toutes les routes nécessitent une authentification
router.get("/", auth, filterByRepresentant, getFactures);
router.get("/stats", auth, getStatsFactures);
router.get(
  "/commandes-non-facturees",
  auth,
  filterByRepresentant,
  getCommandesNonFacturees
);
router.get("/:numfact", auth, getFactureById);
router.get("/:numfact/logs", auth, getFactureLogs);
router.post("/from-commande/:numbc", auth, createFactureFromCommande);
router.put("/:numfact/payment", auth, marquerFacturePayee);

export default router;
