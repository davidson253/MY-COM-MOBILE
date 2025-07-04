import React from "react";
import { FiUser } from "react-icons/fi";

/**
 * Composant d'affichage des informations du représentant connecté
 */
const RepresentantInfo = ({ representant, showLabel = true, compact = false }) => {
  if (!representant) {
    return null;
  }

  if (compact) {
    return (
      <div className="representant-info-compact">
        <FiUser size={14} />
        <span className="representant-code">{representant.code}</span>
        <span className="representant-libelle">{representant.libelle}</span>
      </div>
    );
  }

  return (
    <div className="representant-info">
      {showLabel && <label className="representant-label">Représentant :</label>}
      <div className="representant-details">
        <div className="representant-code">
          <FiUser size={16} />
          <strong>{representant.code}</strong>
        </div>
        <div className="representant-libelle">
          {representant.libelle}
        </div>
      </div>
    </div>
  );
};

export default RepresentantInfo;
