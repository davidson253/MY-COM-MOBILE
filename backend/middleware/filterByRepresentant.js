export default function filterByRepresentant(req, res, next) {
  // Le token contient 'code', pas 'representant_id'
  const representantId = req.user?.code || req.representant?.code;
  if (!representantId) {
    return res
      .status(403)
      .json({ error: "Accès interdit : représentant non identifié." });
  }
  req.representant_id = representantId;
  next();
}
