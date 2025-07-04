import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import clientRoutes from "./routes/clientRoutes.js";
import articleRoutes from "./routes/articleRoutes.js";
import commandeRoutes from "./routes/commandeRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import reglementRoutes from "./routes/reglementRoutes.js";
import factureRoutes from "./routes/factureRoutes.js";
import auth from "./middleware/auth.js";

// Charger les variables d'environnement
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Exemple de route de test
app.get("/api", (req, res) => {
  res.json({ message: "API backend opérationnelle !" });
});

app.use("/api/clients", clientRoutes);

// Routes avec authentification
app.use("/api/articles", auth, articleRoutes);
app.use("/api/commandes", auth, commandeRoutes);
app.use("/api/reglements", auth, reglementRoutes);
app.use("/api/factures", auth, factureRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur le port ${PORT}`);
});
