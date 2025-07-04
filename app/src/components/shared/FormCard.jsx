import React from "react";
import "./SharedComponents.css";

/**
 * Composant carte de formulaire réutilisable
 * @param {Object} props - Les propriétés du composant
 * @param {string} props.title - Titre de la carte
 * @param {React.ReactNode} props.icon - Icône du titre
 * @param {React.ReactNode} props.children - Contenu de la carte
 * @param {string} props.className - Classes CSS supplémentaires
 * @param {string} props.id - ID de la carte
 */
const FormCard = ({ title, icon, children, className = "", id, ...props }) => {
  const combinedClassName = [
    "shared-card",
    "shared-fade-in",
    "theme-immersive-card",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div id={id} className={combinedClassName} {...props}>
      {title && (
        <h3 className="shared-card-title">
          {icon && React.cloneElement(icon)}
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

export default FormCard;
