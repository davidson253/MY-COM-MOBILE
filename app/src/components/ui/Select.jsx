const Select = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Sélectionner...",
  error,
  disabled = false,
  required = false,
  size = "medium",
  className = "",
  style = {},
  children,
  ...props
}) => {
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    width: "100%",
  };

  const labelStyle = {
    fontSize: "14px",
    fontWeight: "600",
    color: error ? "#dc2626" : "#374151",
    marginBottom: "4px",
  };

  const sizes = {
    small: {
      padding: "8px 12px",
      fontSize: "13px",
      height: "36px",
    },
    medium: {
      padding: "12px 16px",
      fontSize: "14px",
      height: "44px",
    },
    large: {
      padding: "16px 20px",
      fontSize: "16px",
      height: "52px",
    },
  };

  const currentSize = sizes[size];

  const selectStyle = {
    width: "100%",
    border: "2px solid #e2e8f0",
    borderRadius: "8px",
    backgroundColor: "white",
    ...currentSize,
    color: "#374151",
    transition: "all 0.2s ease",
    outline: "none",
    fontFamily: "inherit",
    opacity: disabled ? 0.6 : 1,
    cursor: disabled ? "not-allowed" : "pointer",
    ...style,
  };

  if (error) {
    selectStyle.borderColor = "#dc2626";
  }

  const errorStyle = {
    fontSize: "12px",
    color: "#dc2626",
    marginTop: "4px",
  };

  const handleFocus = (e) => {
    if (!disabled) {
      e.target.style.borderColor = "#3b82f6";
      e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
    }
  };

  const handleBlur = (e) => {
    if (!disabled) {
      if (error) {
        e.target.style.borderColor = "#dc2626";
      } else {
        e.target.style.borderColor = "#e2e8f0";
      }
      e.target.style.boxShadow = "none";
    }
  };

  return (
    <div style={containerStyle} className={className}>
      {label && (
        <label style={labelStyle}>
          {label}
          {required && (
            <span style={{ color: "#dc2626", marginLeft: "4px" }}>*</span>
          )}
        </label>
      )}

      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        style={selectStyle}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option, index) => (
          <option key={index} value={option.value || option}>
            {option.label || option}
          </option>
        ))}
        {children}
      </select>

      {error && <div style={errorStyle}>{error}</div>}
    </div>
  );
};

export default Select;
