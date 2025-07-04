import React from "react";
import "./SharedComponents.css";

/**
 * Composant bouton principal réutilisable
 * @param {Object} props - Les propriétés du composant
 * @param {string} props.variant - Variante du bouton ('primary', 'secondary', 'success', 'danger', 'warning')
 * @param {React.ReactNode} props.icon - Icône du bouton
 * @param {React.ReactNode} props.children - Contenu du bouton
 * @param {boolean} props.disabled - État désactivé
 * @param {boolean} props.loading - État de chargement
 * @param {string} props.className - Classes CSS supplémentaires
 * @param {Function} props.onClick - Fonction appelée au clic
 */
const Button = ({
  variant = "primary",
  icon,
  children,
  disabled = false,
  loading = false,
  className = "",
  onClick,
  ...props
}) => {
  const handleClick = (e) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    onClick && onClick(e);
  };

  const baseClass = "shared-btn theme-magnetic";
  const variantClass = `shared-btn-${variant}`;
  const loadingClass = loading ? "shared-button-loading" : "";

  const combinedClassName = [baseClass, variantClass, loadingClass, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      className={combinedClassName}
      {...props}
    >
      {icon && !loading && React.cloneElement(icon)}
      {!loading && children}
      {loading && "En cours..."}
    </button>
  );
};

export default Button;
