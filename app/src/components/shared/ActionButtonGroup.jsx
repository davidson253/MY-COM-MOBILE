import React from "react";
import ActionButton from "./ActionButton";
import "./SharedComponents.css";

/**
 * Composant groupe de boutons d'action
 * @param {Object} props - Les propriétés du composant
 * @param {Array} props.actions - Tableau des actions
 * @param {boolean} props.disabled - État global désactivé
 * @param {string} props.className - Classes CSS supplémentaires
 */
const ActionButtonGroup = ({
  actions = [],
  disabled = false,
  className = "",
  ...props
}) => {
  const combinedClassName = ["shared-actions-container", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={combinedClassName} {...props}>
      {actions.map((action, index) => (
        <ActionButton
          key={action.key || index}
          type={action.variant || action.type}
          onClick={action.onClick}
          disabled={disabled || action.disabled}
          icon={action.icon}
          title={action.title}
          className={action.className}
        >
          {action.label}
        </ActionButton>
      ))}
    </div>
  );
};

export default ActionButtonGroup;
