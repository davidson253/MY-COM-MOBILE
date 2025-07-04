import { useState, useEffect } from "react";
import api from "../../services/api";
import "./styles/Common.css";

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [limit, setLimit] = useState(50);

  useEffect(() => {
    loadLogs();
  }, [limit]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const data = await api.getAllConnectionLogs(limit);
      setLogs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatAction = (action) => {
    const actions = {
      LOGIN_SUCCESS: "🟢 Connexion",
      LOGOUT: "🚪 Déconnexion",
      REGISTER: "📝 Inscription",
    };
    return actions[action] || action;
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString("fr-FR");
  };

  const formatDetails = (details) => {
    try {
      const parsed =
        typeof details === "string" ? JSON.parse(details) : details;
      return parsed.ip_display || parsed.email || "N/A";
    } catch {
      return "N/A";
    }
  };

  if (loading)
    return <div className="page-container">Chargement des logs...</div>;
  if (error) return <div className="page-container error">Erreur: {error}</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📊 Logs de Connexion</h1>
        <div className="page-actions">
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="form-select"
          >
            <option value={25}>25 derniers</option>
            <option value={50}>50 derniers</option>
            <option value={100}>100 derniers</option>
            <option value={200}>200 derniers</option>
          </select>
          <button onClick={loadLogs} className="btn btn-primary">
            🔄 Actualiser
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Action</th>
              <th>Représentant</th>
              <th>Email</th>
              <th>IP</th>
              <th>Date/Heure</th>
              <th>Détails</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{formatAction(log.action)}</td>
                <td>{log.representant_code}</td>
                <td>{log.entity_id}</td>
                <td>{log.ip_address}</td>
                <td>{formatTimestamp(log.timestamp)}</td>
                <td>{formatDetails(log.details)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {logs.length === 0 && (
        <div className="empty-state">
          <p>Aucun log de connexion trouvé</p>
        </div>
      )}
    </div>
  );
}
