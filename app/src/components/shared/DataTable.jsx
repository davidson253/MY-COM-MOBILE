import React from "react";
import "./SharedComponents.css";

/**
 * Composant tableau de données réutilisable
 * @param {Object} props - Les propriétés du composant
 * @param {Array} props.columns - Définition des colonnes
 * @param {Array} props.data - Données du tableau
 * @param {Function} props.getRowClass - Fonction pour obtenir la classe CSS d'une ligne
 * @param {string} props.className - Classes CSS supplémentaires
 * @param {React.ReactNode} props.emptyState - Composant affiché quand aucune donnée
 */
const DataTable = ({
  columns = [],
  data = [],
  getRowClass,
  className = "",
  emptyState = null,
  ...props
}) => {
  const combinedClassName = ["shared-table", className]
    .filter(Boolean)
    .join(" ");

  if (data.length === 0 && emptyState) {
    return emptyState;
  }

  return (
    <table className={combinedClassName} {...props}>
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th
              key={column.key || index}
              className={column.headerClassName}
              style={column.headerStyle}
            >
              {column.icon &&
                React.cloneElement(column.icon, {
                  style: { marginRight: "8px", display: "inline" },
                })}
              {column.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => {
          const rowClass = getRowClass ? getRowClass(row, rowIndex) : "";

          return (
            <tr key={row.id || row.key || rowIndex} className={rowClass}>
              {columns.map((column, colIndex) => (
                <td
                  key={column.key || colIndex}
                  className={column.cellClassName}
                  style={column.cellStyle}
                >
                  {column.render
                    ? column.render(row[column.dataKey], row, rowIndex)
                    : row[column.dataKey]}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default DataTable;
