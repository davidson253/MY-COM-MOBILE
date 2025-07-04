import express from "express";
import auth from "../middleware/auth.js";
import filterByRepresentant from "../middleware/filterByRepresentant.js";
import {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  getClientLogs,
} from "../controllers/clientController.js";

const router = express.Router();

// Toutes les routes nécessitent une authentification ET un filtrage par représentant
router.get("/", auth, filterByRepresentant, getClients);
router.get("/:code", auth, filterByRepresentant, getClientById);
router.get("/:code/logs", auth, filterByRepresentant, getClientLogs);
router.post("/", auth, filterByRepresentant, createClient);
router.put("/:code", auth, filterByRepresentant, updateClient);
router.delete("/:code", auth, filterByRepresentant, deleteClient);

export default router;
