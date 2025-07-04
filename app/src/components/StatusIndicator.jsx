import React from "react";
import "./StatusIndicator.css";

/**
 * Composant réutilisable pour afficher les statuts "en cours"
 * @param {Object} props
 * @param {string} props.type - Type de statut : 'editing' ou 'viewing'
 * @param {boolean} props.show - Si true, affiche le statut
 * @param {string} props.text - Texte à afficher (par défaut "en cours")
 * @param {string} props.className - Classes CSS supplémentaires
 */
export default function StatusIndicator({
  type = "editing",
  show = false,
  text = "en cours",
  className = "",
}) {
  if (!show) return null;

  const statusClass =
    type === "editing"
      ? "status-indicator--editing"
      : "status-indicator--viewing";

  return (
    <span className={`status-indicator ${statusClass} ${className}`}>
      {text}
    </span>
  );
}
