const SearchBox = ({
  value,
  onChange,
  placeholder = "Rechercher...",
  onClear,
  size = "medium",
  disabled = false,
  loading = false,
  className = "",
  style = {},
  ...props
}) => {
  const sizes = {
    small: {
      padding: "8px 16px 8px 40px",
      fontSize: "13px",
      height: "36px",
    },
    medium: {
      padding: "12px 20px 12px 44px",
      fontSize: "14px",
      height: "44px",
    },
    large: {
      padding: "16px 24px 16px 52px",
      fontSize: "16px",
      height: "52px",
    },
  };

  const currentSize = sizes[size];

  const containerStyle = {
    position: "relative",
    display: "flex",
    alignItems: "center",
    width: "100%",
    ...style,
  };

  const inputStyle = {
    width: "100%",
    border: "2px solid #e2e8f0",
    borderRadius: "12px",
    backgroundColor: "#f8fafc",
    ...currentSize,
    color: "#374151",
    transition: "all 0.2s ease",
    outline: "none",
    fontFamily: "inherit",
    opacity: disabled ? 0.6 : 1,
    cursor: disabled ? "not-allowed" : "text",
    paddingRight: value || loading ? "48px" : currentSize.padding.split(" ")[1],
  };

  const searchIconStyle = {
    position: "absolute",
    left: size === "large" ? "16px" : size === "medium" ? "14px" : "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#64748b",
    fontSize: size === "large" ? "20px" : "16px",
    pointerEvents: "none",
  };

  const clearButtonStyle = {
    position: "absolute",
    right: size === "large" ? "16px" : size === "medium" ? "14px" : "12px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "4px",
    borderRadius: "4px",
    color: "#64748b",
    fontSize: size === "large" ? "18px" : "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
  };

  const loadingSpinnerStyle = {
    position: "absolute",
    right: size === "large" ? "16px" : size === "medium" ? "14px" : "12px",
    top: "50%",
    transform: "translateY(-50%)",
    width: size === "large" ? "20px" : "16px",
    height: size === "large" ? "20px" : "16px",
    border: "2px solid #e2e8f0",
    borderTop: "2px solid #3b82f6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  };

  const handleFocus = (e) => {
    if (!disabled) {
      e.target.style.borderColor = "#3b82f6";
      e.target.style.backgroundColor = "white";
      e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
    }
  };

  const handleBlur = (e) => {
    if (!disabled) {
      e.target.style.borderColor = "#e2e8f0";
      e.target.style.backgroundColor = "#f8fafc";
      e.target.style.boxShadow = "none";
    }
  };

  const handleClearClick = () => {
    if (onClear) {
      onClear();
    } else if (onChange) {
      onChange({ target: { value: "" } });
    }
  };

  const handleClearMouseEnter = (e) => {
    e.target.style.backgroundColor = "#f1f5f9";
    e.target.style.color = "#374151";
  };

  const handleClearMouseLeave = (e) => {
    e.target.style.backgroundColor = "transparent";
    e.target.style.color = "#64748b";
  };

  return (
    <div style={containerStyle} className={className}>
      {/* Search Icon */}
      <div style={searchIconStyle}>
        <svg
          width={size === "large" ? "20" : "16"}
          height={size === "large" ? "20" : "16"}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
      </div>

      {/* Input */}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        style={inputStyle}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />

      {/* Loading Spinner */}
      {loading && <div style={loadingSpinnerStyle} />}

      {/* Clear Button */}
      {!loading && value && (
        <button
          style={clearButtonStyle}
          onClick={handleClearClick}
          onMouseEnter={handleClearMouseEnter}
          onMouseLeave={handleClearMouseLeave}
          type="button"
          aria-label="Effacer"
        >
          <svg
            width={size === "large" ? "18" : "16"}
            height={size === "large" ? "18" : "16"}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      )}
    </div>
  );
};

export default SearchBox;
