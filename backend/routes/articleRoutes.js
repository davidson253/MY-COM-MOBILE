import express from "express";
import auth from "../middleware/auth.js";
import {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  restoreArticle,
} from "../controllers/articleController.js";

const router = express.Router();

// Catalogue accessible à tous les représentants authentifiés
router.get("/", auth, getArticles);
router.get("/:code", auth, getArticleById);
router.post("/", auth, createArticle);
router.put("/:code", auth, updateArticle);
router.delete("/:code", auth, deleteArticle);
router.patch("/:code/restore", auth, restoreArticle);

export default router;
