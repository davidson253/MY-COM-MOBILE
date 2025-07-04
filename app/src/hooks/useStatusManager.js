import { useState } from "react";

/**
 * Hook personnalisé pour gérer les statuts d'édition et de consultation
 * @returns {Object} Objet contenant les états et les fonctions de gestion
 */
export function useStatusManager() {
  const [editingId, setEditingId] = useState(null);
  const [viewingId, setViewingId] = useState(null);

  // Fonctions pour gérer l'édition
  const startEditing = (id) => {
    setEditingId(id);
    setViewingId(null); // Réinitialiser la consultation pour éviter le double statut
  };

  const stopEditing = () => {
    setEditingId(null);
  };

  // Fonctions pour gérer la consultation
  const startViewing = (id) => {
    setViewingId(id);
    setEditingId(null); // Réinitialiser l'édition pour éviter le double statut
  };

  const stopViewing = () => {
    setViewingId(null);
  };

  // Fonction pour réinitialiser tous les statuts
  const resetAllStatus = () => {
    setEditingId(null);
    setViewingId(null);
  };

  // Fonctions utilitaires pour vérifier les statuts
  const isEditing = (id) => editingId === id;
  const isViewing = (id) => viewingId === id;
  const hasAnyStatus = (id) => isEditing(id) || isViewing(id);

  // Fonction pour obtenir la classe CSS de la ligne
  const getRowClass = (id, baseClass = "") => {
    let rowClass = baseClass;
    if (isEditing(id)) rowClass += " row--editing";
    else if (isViewing(id)) rowClass += " row--viewing";
    return rowClass.trim();
  };

  return {
    // États
    editingId,
    viewingId,

    // Fonctions de gestion
    startEditing,
    stopEditing,
    startViewing,
    stopViewing,
    resetAllStatus,

    // Fonctions utilitaires
    isEditing,
    isViewing,
    hasAnyStatus,
    getRowClass,
  };
}
