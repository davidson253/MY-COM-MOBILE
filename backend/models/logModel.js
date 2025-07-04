import db from "./db.js";

const Log = {
  create: async ({
    representant_code,
    action,
    entity,
    entity_id = null,
    field = null,
    entity_subid = null,
    details = null,
    ip_address = null,
    user_agent = null,
  }) => {
    await db.query(
      "INSERT INTO logs (representant_code, action, entity, entity_id, field, entity_subid, details, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        representant_code,
        action,
        entity,
        entity_id,
        field,
        entity_subid,
        details ? JSON.stringify(details) : null,
        ip_address,
        user_agent,
      ]
    );
  },

  // Log spécifique pour les connexions réussies uniquement
  logSuccessfulConnection: async ({
    representant_code,
    email,
    ip_address,
    user_agent,
  }) => {
    const details = {
      email,
      timestamp: new Date().toISOString(),
      ip_display: ip_address === "::1" ? "localhost (IPv6)" : ip_address,
    };

    await Log.create({
      representant_code,
      action: "LOGIN",
      entity: "authentication",
      entity_id: email,
      details,
      ip_address,
      user_agent,
    });
  },

  // Log spécifique pour les déconnexions
  logLogout: async ({ representant_code, email, ip_address, user_agent }) => {
    const details = {
      email,
      timestamp: new Date().toISOString(),
      ip_display: ip_address === "::1" ? "localhost (IPv6)" : ip_address,
    };

    await Log.create({
      representant_code,
      action: "LOGOUT",
      entity: "authentication",
      entity_id: email,
      details,
      ip_address,
      user_agent,
    });
  },

  // Log pour les inscriptions
  logRegistration: async ({
    representant_code,
    email,
    ip_address,
    user_agent,
  }) => {
    await Log.create({
      representant_code,
      action: "REGISTER",
      entity: "authentication",
      entity_id: representant_code,
      details: {
        email,
        timestamp: new Date().toISOString(),
        ip_display: ip_address === "::1" ? "localhost (IPv6)" : ip_address,
      },
      ip_address,
      user_agent,
    });
  },

  // Récupérer les logs de connexion/déconnexion
  getConnectionLogs: async (limit = 50) => {
    const [rows] = await db.query(
      "SELECT * FROM logs WHERE action IN ('LOGIN', 'LOGOUT', 'REGISTER') ORDER BY timestamp DESC LIMIT ?",
      [limit]
    );
    return rows;
  },

  // Récupérer les logs par représentant
  getLogsByRepresentant: async (representant_code, limit = 50) => {
    const [rows] = await db.query(
      "SELECT * FROM logs WHERE representant_code = ? ORDER BY timestamp DESC LIMIT ?",
      [representant_code, limit]
    );
    return rows;
  },
};

export default Log;
