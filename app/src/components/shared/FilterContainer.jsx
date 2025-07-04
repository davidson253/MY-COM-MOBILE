import React from "react";
import { FiFilter, FiX } from "react-icons/fi";
import SearchBar from "./SearchBar";
import "./SharedComponents.css";

/**
 * Composant conteneur de filtres réutilisable
 * @param {Object} props - Les propriétés du composant
 * @param {string} props.searchValue - Valeur de recherche
 * @param {Function} props.onSearchChange - Fonction appelée au changement de recherche
 * @param {string} props.searchPlaceholder - Placeholder de recherche
 * @param {Array} props.filters - Tableau des filtres
 * @param {Function} props.onClearFilters - Fonction pour effacer les filtres
 * @param {boolean} props.hasActiveFilters - Indique si des filtres sont actifs
 * @param {string} props.className - Classes CSS supplémentaires
 */
const FilterContainer = ({
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Rechercher...",
  filters = [],
  onClearFilters,
  hasActiveFilters = false,
  className = "",
  ...props
}) => {
  const combinedClassName = ["shared-filters", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={combinedClassName} {...props}>
      <SearchBar
        value={searchValue}
        onChange={onSearchChange}
        placeholder={searchPlaceholder}
      />

      {filters.map((filter, index) => (
        <div key={filter.key || index} className="shared-filter-container">
          {filter.icon &&
            React.cloneElement(filter.icon, {
              className: "shared-filter-icon",
            })}
          <select
            value={filter.value}
            onChange={(e) =>
              filter.onChange && filter.onChange(e.target.value, e)
            }
            className="shared-filter-select"
            title={filter.title}
          >
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      ))}

      {hasActiveFilters && onClearFilters && (
        <button
          onClick={onClearFilters}
          className="shared-clear-filters"
          title="Effacer les filtres"
        >
          <FiX />
        </button>
      )}
    </div>
  );
};

export default FilterContainer;
