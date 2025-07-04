import db from "./db.js";
import bcrypt from "bcrypt";

const Representant = {
  findByEmail: async (email) => {
    const [rows] = await db.query(
      "SELECT * FROM representant WHERE email = ?",
      [email]
    );
    return rows[0];
  },

  findByCode: async (code) => {
    const [rows] = await db.query("SELECT * FROM representant WHERE code = ?", [
      code,
    ]);
    return rows[0];
  },

  create: async ({
    code,
    libelle,
    email,
    password,
    typerep = "Commercial",
  }) => {
    const hash = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      "INSERT INTO representant (code, libelle, email, password, typerep) VALUES (?, ?, ?, ?, ?)",
      [code, libelle, email, hash, typerep]
    );
    return result;
  },

  getAll: async () => {
    const [rows] = await db.query(
      "SELECT code, libelle, email, typerep, codedep, libdep FROM representant"
    );
    return rows;
  },

  // Générer le prochain code représentant (R001, R002, etc.)
  generateNextCode: async () => {
    const [rows] = await db.query(
      "SELECT code FROM representant ORDER BY code DESC LIMIT 1"
    );
    if (rows.length === 0) {
      return "R001";
    }
    const lastCode = rows[0].code;
    const num = parseInt(lastCode.substring(1)) + 1;
    return `R${num.toString().padStart(3, "0")}`;
  },
};

export default Representant;
