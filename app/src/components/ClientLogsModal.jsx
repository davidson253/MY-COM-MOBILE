import React, { useState, useEffect } from "react";
import { FiClock, FiX, FiUser, FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import api from "../services/api";
import "./ClientLogsModal.css";

export default function ClientLogsModal({
  clientCode,
  clientName,
  isOpen,
  onClose,
}) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && clientCode) {
      loadLogs();
    }
  }, [isOpen, clientCode]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const clientLogs = await api.getClientLogs(clientCode);
      setLogs(clientLogs);
    } catch (error) {
      console.error("Erreur lors du chargement des logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case "CREATE":
        return <FiPlus className="action-icon action-icon--create" />;
      case "UPDATE":
        return <FiEdit className="action-icon action-icon--update" />;
      case "DELETE":
        return <FiTrash className="action-icon action-icon--delete" />;
      default:
        return <FiClock className="action-icon" />;
    }
  };

  const getActionLabel = (action) => {
    switch (action) {
      case "CREATE":
        return "Création";
      case "UPDATE":
        return "Modification";
      case "DELETE":
        return "Suppression";
      default:
        return action;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("fr-FR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const renderLogDetails = (log) => {
    if (!log.details) return null;

    const details =
      typeof log.details === "string" ? JSON.parse(log.details) : log.details;

    switch (log.action) {
      case "CREATE":
        return (
          <div className="log-details">
            <strong>Données créées :</strong>
            <ul>
              <li>Nom : {details.clientData?.rsoc}</li>
              <li>Email : {details.clientData?.email}</li>
              <li>Téléphone : {details.clientData?.tel}</li>
              <li>Adresse : {details.clientData?.adresse}</li>
              <li>Ville : {details.clientData?.ville}</li>
            </ul>
          </div>
        );

      case "UPDATE":
        return (
          <div className="log-details">
            <strong>Modifications :</strong>
            <div className="changes-grid">
              {Object.keys(details.after || {}).map((key) => {
                const before = details.before?.[key];
                const after = details.after?.[key];
                if (before !== after) {
                  return (
                    <div key={key} className="change-item">
                      <span className="field-name">{key} :</span>
                      <span className="change-before">
                        {before || "(vide)"}
                      </span>
                      <span className="change-arrow">→</span>
                      <span className="change-after">{after || "(vide)"}</span>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        );

      case "DELETE":
        return (
          <div className="log-details">
            <strong>Données supprimées :</strong>
            <ul>
              <li>Nom : {details.deletedData?.rsoc}</li>
              <li>Email : {details.deletedData?.email}</li>
              <li>Téléphone : {details.deletedData?.tel}</li>
              <li>Adresse : {details.deletedData?.adresse}</li>
              <li>Ville : {details.deletedData?.ville}</li>
            </ul>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="logs-modal-overlay">
      <div className="logs-modal">
        <div className="logs-modal-header">
          <h2 className="logs-modal-title">
            <FiClock className="logs-modal-icon" />
            Historique du client {clientName} ({clientCode})
          </h2>
          <button className="logs-modal-close" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="logs-modal-content">
          {loading ? (
            <div className="logs-loading">
              <div className="logs-spinner"></div>
              <p>Chargement de l'historique...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="logs-empty">
              <FiClock className="logs-empty-icon" />
              <p>Aucun historique disponible pour ce client.</p>
            </div>
          ) : (
            <div className="logs-list">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className={`log-item log-item--${log.action.toLowerCase()}`}
                >
                  <div className="log-header">
                    <div className="log-action">
                      {getActionIcon(log.action)}
                      <span className="log-action-text">
                        {getActionLabel(log.action)}
                      </span>
                    </div>
                    <div className="log-date">{formatDate(log.created_at)}</div>
                  </div>
                  {renderLogDetails(log)}
                  {log.details?.ip && (
                    <div className="log-meta">
                      <small>IP: {log.details.ip}</small>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="logs-modal-footer">
          <button className="logs-modal-button" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
