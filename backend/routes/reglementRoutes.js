import express from "express";
import auth from "../middleware/auth.js";
import filterByRepresentant from "../middleware/filterByRepresentant.js";
import {
  getReglements,
  getReglementById,
  getReglementsByClient,
  createReglement,
  updateReglement,
  deleteReglement,
  restoreReglement,
  getStatsReglements,
} from "../controllers/reglementController.js";

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(auth);
router.use(filterByRepresentant); // Appliquer le middleware à toutes les routes règlements

router.get("/", getReglements);
router.get("/stats", getStatsReglements);
router.get("/:numreg", getReglementById);
router.get("/client/:codecli", filterByRepresentant, getReglementsByClient);
router.post("/", createReglement);
router.put("/:numreg", updateReglement);

router.delete("/:numreg", deleteReglement);
router.patch("/:numreg/restore", restoreReglement);

export default router;
