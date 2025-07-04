const Table = ({
  columns,
  data,
  loading = false,
  emptyMessage = "Aucune donnée disponible",
  striped = true,
  hover = true,
  responsive = true,
  size = "medium",
  className = "",
  style = {},
  onRowClick,
  editingRowId,
  ...props
}) => {
  const baseStyle = {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "white",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    ...style,
  };

  const sizes = {
    small: {
      fontSize: "13px",
      cellPadding: "8px 12px",
    },
    medium: {
      fontSize: "14px",
      cellPadding: "12px 16px",
    },
    large: {
      fontSize: "15px",
      cellPadding: "16px 20px",
    },
  };

  const currentSize = sizes[size];

  const tableWrapperStyle = {
    overflowX: responsive ? "auto" : "visible",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
  };

  const headerStyle = {
    backgroundColor: "#f8fafc",
    borderBottom: "2px solid #e2e8f0",
  };

  const headerCellStyle = {
    padding: currentSize.cellPadding,
    textAlign: "left",
    fontWeight: "600",
    color: "#374151",
    fontSize: currentSize.fontSize,
    borderBottom: "2px solid #e2e8f0",
  };

  const getCellStyle = (index, isEditing = false) => ({
    padding: currentSize.cellPadding,
    fontSize: currentSize.fontSize,
    color: "#374151",
    borderBottom: "1px solid #f1f5f9",
    backgroundColor: isEditing ? "#fef3c7" : "transparent",
    transition: "background-color 0.2s ease",
  });

  const getRowStyle = (index, isEditing = false) => {
    let backgroundColor = "white";

    if (isEditing) {
      backgroundColor = "#fffbeb";
    } else if (striped && index % 2 === 1) {
      backgroundColor = "#f8fafc";
    }

    return {
      backgroundColor,
      cursor: onRowClick ? "pointer" : "default",
      transition: "background-color 0.2s ease",
    };
  };

  const handleRowMouseEnter = (e, index, isEditing) => {
    if (hover && !isEditing) {
      e.currentTarget.style.backgroundColor = "#f1f5f9";
    }
  };

  const handleRowMouseLeave = (e, index, isEditing) => {
    if (hover) {
      const originalColor = isEditing
        ? "#fffbeb"
        : striped && index % 2 === 1
        ? "#f8fafc"
        : "white";
      e.currentTarget.style.backgroundColor = originalColor;
    }
  };

  if (loading) {
    return (
      <div style={tableWrapperStyle}>
        <div
          style={{
            padding: "40px",
            textAlign: "center",
            color: "#64748b",
            fontSize: currentSize.fontSize,
          }}
        >
          <div
            style={{
              display: "inline-block",
              width: "32px",
              height: "32px",
              border: "3px solid #e2e8f0",
              borderTop: "3px solid #3b82f6",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              marginBottom: "16px",
            }}
          />
          <div>Chargement...</div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div style={tableWrapperStyle}>
        <div
          style={{
            padding: "40px",
            textAlign: "center",
            color: "#64748b",
            fontSize: currentSize.fontSize,
          }}
        >
          {emptyMessage}
        </div>
      </div>
    );
  }

  return (
    <div style={tableWrapperStyle} className={className}>
      <table style={baseStyle} {...props}>
        <thead style={headerStyle}>
          <tr>
            {columns.map((column, index) => (
              <th
                key={column.key || index}
                style={{
                  ...headerCellStyle,
                  textAlign: column.align || "left",
                  width: column.width || "auto",
                  minWidth: column.minWidth || "auto",
                }}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => {
            const isEditing = editingRowId && row.id === editingRowId;
            return (
              <tr
                key={row.id || rowIndex}
                style={getRowStyle(rowIndex, isEditing)}
                onMouseEnter={(e) =>
                  handleRowMouseEnter(e, rowIndex, isEditing)
                }
                onMouseLeave={(e) =>
                  handleRowMouseLeave(e, rowIndex, isEditing)
                }
                onClick={
                  onRowClick ? () => onRowClick(row, rowIndex) : undefined
                }
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={`${row.id || rowIndex}-${column.key || colIndex}`}
                    style={{
                      ...getCellStyle(rowIndex, isEditing),
                      textAlign: column.align || "left",
                    }}
                  >
                    {column.render
                      ? column.render(row[column.dataIndex], row, rowIndex)
                      : row[column.dataIndex]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
