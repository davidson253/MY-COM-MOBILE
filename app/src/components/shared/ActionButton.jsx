import React from "react";
import "./SharedComponents.css";

/**
 * Composant bouton d'action réutilisable
 * @param {Object} props - Les propriétés du composant
 * @param {string} props.type - Type du bouton ('view', 'edit', 'delete')
 * @param {Function} props.onClick - Fonction appelée au clic
 * @param {boolean} props.disabled - État désactivé
 * @param {React.ReactNode} props.icon - Icône du bouton
 * @param {string} props.children - Texte du bouton
 * @param {string} props.title - Titre pour l'accessibilité
 * @param {string} props.className - Classes CSS supplémentaires
 */
const ActionButton = ({
  type = "view",
  onClick,
  disabled = false,
  icon,
  children,
  title,
  className = "",
  ...props
}) => {
  const handleClick = (e) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    onClick && onClick(e);
  };

  const baseClass = "shared-action-button theme-magnetic";
  const typeClass = `shared-action-button--${type}`;
  const disabledClass = disabled ? "shared-button-disabled" : "";

  const combinedClassName = [baseClass, typeClass, disabledClass, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={combinedClassName}
      title={title}
      {...props}
    >
      {icon && React.cloneElement(icon, { size: 14 })}
      {children}
    </button>
  );
};

export default ActionButton;
