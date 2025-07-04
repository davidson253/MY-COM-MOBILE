import React from "react";
import StatusIndicator from "../StatusIndicator";
import "./SharedComponents.css";

/**
 * Composant badge de code avec indicateurs de statut
 * @param {Object} props - Les propriétés du composant
 * @param {string|number} props.code - Code à afficher
 * @param {string} props.prefix - Préfixe du code (ex: '#')
 * @param {boolean} props.isEditing - Indique si en cours d'édition
 * @param {boolean} props.isViewing - Indique si en cours de visualisation
 * @param {string} props.className - Classes CSS supplémentaires
 */
const CodeBadge = ({
  code,
  prefix = "#",
  isEditing = false,
  isViewing = false,
  className = "",
  ...props
}) => {
  const combinedClassName = ["shared-code-badge", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={combinedClassName} {...props}>
      <div className="shared-flex-container">
        {prefix}
        {code}
        <StatusIndicator type="editing" show={isEditing} />
        <StatusIndicator type="viewing" show={isViewing} />
      </div>
    </div>
  );
};

export default CodeBadge;
