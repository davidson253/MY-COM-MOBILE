import React from "react";
import { FiSearch } from "react-icons/fi";
import "./SharedComponents.css";

/**
 * Composant barre de recherche réutilisable
 * @param {Object} props - Les propriétés du composant
 * @param {string} props.value - Valeur de recherche
 * @param {Function} props.onChange - Fonction appelée au changement
 * @param {string} props.placeholder - Texte de placeholder
 * @param {React.ReactNode} props.icon - Icône personnalisée
 * @param {string} props.className - Classes CSS supplémentaires
 */
const SearchBar = ({
  value = "",
  onChange,
  placeholder = "Rechercher...",
  icon = <FiSearch />,
  className = "",
  ...props
}) => {
  const handleChange = (e) => {
    onChange && onChange(e.target.value, e);
  };

  const combinedClassName = ["shared-search-container", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={combinedClassName}>
      {React.cloneElement(icon, {
        className: "shared-search-icon",
      })}
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="shared-search-input"
        {...props}
      />
    </div>
  );
};

export default SearchBar;
