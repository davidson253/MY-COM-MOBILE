const Input = ({
  type = "text",
  label,
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  size = "medium",
  icon,
  iconPosition = "left",
  variant = "default",
  className = "",
  style = {},
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

  const inputWrapperStyle = {
    position: "relative",
    display: "flex",
    alignItems: "center",
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

  const variants = {
    default: {
      border: "2px solid #e2e8f0",
      backgroundColor: "white",
      focusBorderColor: "#3b82f6",
    },
    filled: {
      border: "2px solid transparent",
      backgroundColor: "#f8fafc",
      focusBorderColor: "#3b82f6",
    },
    underlined: {
      border: "none",
      borderBottom: "2px solid #e2e8f0",
      backgroundColor: "transparent",
      borderRadius: "0",
      focusBorderColor: "#3b82f6",
    },
  };

  const currentSize = sizes[size];
  const currentVariant = variants[variant];

  const baseInputStyle = {
    width: "100%",
    border: currentVariant.border,
    borderRadius: variant === "underlined" ? "0" : "8px",
    backgroundColor: currentVariant.backgroundColor,
    ...currentSize,
    color: "#374151",
    transition: "all 0.2s ease",
    outline: "none",
    fontFamily: "inherit",
    opacity: disabled ? 0.6 : 1,
    cursor: disabled ? "not-allowed" : "text",
    paddingLeft:
      icon && iconPosition === "left"
        ? "48px"
        : currentSize.padding.split(" ")[1],
    paddingRight:
      icon && iconPosition === "right"
        ? "48px"
        : currentSize.padding.split(" ")[1],
    ...style,
  };

  if (error) {
    baseInputStyle.borderColor = "#dc2626";
    if (variant === "filled") {
      baseInputStyle.backgroundColor = "#fef2f2";
    }
  }

  const iconStyle = {
    position: "absolute",
    [iconPosition]: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: error ? "#dc2626" : "#64748b",
    fontSize: "16px",
    pointerEvents: "none",
  };

  const errorStyle = {
    fontSize: "12px",
    color: "#dc2626",
    marginTop: "4px",
  };

  const handleFocus = (e) => {
    if (!disabled) {
      if (variant === "underlined") {
        e.target.style.borderBottomColor = currentVariant.focusBorderColor;
      } else {
        e.target.style.borderColor = currentVariant.focusBorderColor;
      }
      e.target.style.boxShadow = `0 0 0 3px ${currentVariant.focusBorderColor}20`;
    }
  };

  const handleBlur = (e) => {
    if (!disabled) {
      if (error) {
        e.target.style.borderColor = "#dc2626";
      } else {
        if (variant === "underlined") {
          e.target.style.borderBottomColor = "#e2e8f0";
        } else {
          e.target.style.borderColor = currentVariant.border.includes(
            "transparent"
          )
            ? "transparent"
            : "#e2e8f0";
        }
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

      <div style={inputWrapperStyle}>
        {icon && iconPosition === "left" && (
          <span style={iconStyle}>{icon}</span>
        )}

        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          style={baseInputStyle}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />

        {icon && iconPosition === "right" && (
          <span style={iconStyle}>{icon}</span>
        )}
      </div>

      {error && <div style={errorStyle}>{error}</div>}
    </div>
  );
};

export default Input;
