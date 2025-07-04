import express from "express";
import { register, login, logout } from "../controllers/authController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", auth, logout); // Nécessite une authentification

export default router;
