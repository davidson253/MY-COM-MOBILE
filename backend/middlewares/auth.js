const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Token manquant" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.representant = {
      code: decoded.code,
      email: decoded.email,
      libelle: decoded.libelle,
      typerep: decoded.typerep,
    };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token invalide" });
  }
};
