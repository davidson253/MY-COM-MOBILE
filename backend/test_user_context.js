// Test d'affichage du contexte utilisateur reçu par le backend
import express from "express";
import auth from "./middleware/auth.js";

const app = express();
app.use(express.json());
app.use(auth);

app.get("/api/test-user", (req, res) => {
  console.log("[TEST] req.user:", req.user);
  res.json({ user: req.user });
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(
    `Serveur de test user lancé sur http://localhost:${PORT}/api/test-user`
  );
});

// Pour tester :
// 1. Lancer ce fichier : node backend/test_user_context.js
// 2. Appeler http://localhost:5001/api/test-user avec le même token JWT que votre front
// 3. Vérifier la console et la réponse pour voir le contenu de req.user
