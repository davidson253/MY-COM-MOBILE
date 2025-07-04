import Representant from "../models/representantModel.js";
import Log from "../models/logModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Fonction helper pour extraire l'IP
const getClientIP = (req) => {
  let ip =
    req.ip ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
    "unknown";

  // Convertir IPv6 localhost en IPv4
  if (ip === "::1" || ip === "::ffff:127.0.0.1") {
    ip = "127.0.0.1";
  }

  // Nettoyer le préfixe IPv6-to-IPv4
  if (ip.startsWith("::ffff:")) {
    ip = ip.substring(7);
  }

  return ip;
};

export const register = async (req, res) => {
  try {
    const { libelle, email, password, typerep } = req.body;
    if (!libelle || !email || !password)
      return res.status(400).json({ error: "Champs requis" });

    const existing = await Representant.findByEmail(email);
    if (existing) return res.status(409).json({ error: "Email déjà utilisé" });

    const code = await Representant.generateNextCode();
    await Representant.create({ code, libelle, email, password, typerep });

    // Log de l'inscription
    await Log.logRegistration({
      representant_code: code,
      email,
      ip_address: getClientIP(req),
      user_agent: req.get("User-Agent"),
    });

    res.status(201).json({ message: "Représentant créé", code });
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const clientIP = getClientIP(req);
    const userAgent = req.get("User-Agent");

    const representant = await Representant.findByEmail(email);
    if (!representant) {
      return res.status(401).json({ error: "Identifiants invalides" });
    }

    const valid = await bcrypt.compare(password, representant.password);
    if (!valid) {
      return res.status(401).json({ error: "Identifiants invalides" });
    }

    const token = jwt.sign(
      {
        code: representant.code,
        email: representant.email,
        libelle: representant.libelle,
        typerep: representant.typerep,
      },
      process.env.JWT_SECRET || "fallback-secret",
      {
        expiresIn: "1d",
      }
    );

    // Log de connexion réussie uniquement
    await Log.logSuccessfulConnection({
      representant_code: representant.code,
      email,
      ip_address: clientIP,
      user_agent: userAgent,
    });

    res.json({
      token,
      user: {
        code: representant.code,
        libelle: representant.libelle,
        email: representant.email,
        typerep: representant.typerep,
      },
    });
  } catch (error) {
    console.error("🚨 Erreur lors de la connexion:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const logout = async (req, res) => {
  try {
    const clientIP = getClientIP(req);
    const userAgent = req.get("User-Agent");

    // Récupérer les infos du représentant depuis le token (middleware auth)
    const { code, email, libelle } = req.representant || req.user;

    // Log de déconnexion
    await Log.logLogout({
      representant_code: code,
      email,
      ip_address: clientIP,
      user_agent: userAgent,
    });

    res.json({
      message: "Déconnexion réussie",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("🚨 Erreur lors de la déconnexion:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
