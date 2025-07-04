import jwt from "jsonwebtoken";

export default function (req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return res.status(401).json({ error: "Non autorisé" });
  try {
    const token = auth.split(" ")[1];
    req.representant = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback-secret"
    );
    req.user = req.representant; // Compatibilité avec l'ancien code
    next();
  } catch {
    res.status(401).json({ error: "Token invalide" });
  }
}
