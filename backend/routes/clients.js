router.get("/", authMiddleware, async (req, res) => {
  const codeRep = req.representant.code;
  // ... requête SQL ...
  const clients = await db.query("SELECT * FROM client WHERE coderep = ?", [
    codeRep,
  ]);
  res.json(clients);
});
