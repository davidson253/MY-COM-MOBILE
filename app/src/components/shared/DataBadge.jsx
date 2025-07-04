import React from "react";
import "./SharedComponents.css";

/**
 * Composant badge de données réutilisable
 * @param {Object} props - Les propriétés du composant
 * @param {string} props.children - Contenu du badge
 * @param {string} props.variant - Variante du badge ('default', 'success', 'error', 'warning')
 * @param {string} props.className - Classes CSS supplémentaires
 * @param {boolean} props.interactive - Si le badge est interactif (hover)
 */
const DataBadge = ({
  children,
  variant = "default",
  className = "",
  interactive = true,
  ...props
}) => {
  const baseClass = "shared-badge";
  const variantClass = variant !== "default" ? `shared-badge--${variant}` : "";

  const combinedClassName = [baseClass, variantClass, className]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={combinedClassName} {...props}>
      {children}
    </span>
  );
};

export default DataBadge;
