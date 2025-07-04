import express from "express";
import auth from "../middleware/auth.js";
import filterByRepresentant from "../middleware/filterByRepresentant.js";
import {
  getCommandes,
  getCommandeById,
  createCommande,
  updateCommande,
  deleteCommande,
  restoreCommande,
} from "../controllers/commandeController.js";

const router = express.Router();

// Appliquer le middleware à toutes les routes commandes
router.use(filterByRepresentant);

// Toutes les routes nécessitent une authentification
router.get("/", auth, getCommandes);
router.get("/:numbc", auth, getCommandeById);
router.post("/", auth, createCommande);
router.put("/:numbc", auth, updateCommande);
router.delete("/:numbc", auth, deleteCommande);
router.patch("/:numbc/restore", auth, restoreCommande);

export default router;
