const Badge = ({
  children,
  variant = "default",
  size = "medium",
  icon,
  dot = false,
  className = "",
  style = {},
  ...props
}) => {
  const baseStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    borderRadius: "6px",
    fontWeight: "600",
    textAlign: "center",
    whiteSpace: "nowrap",
    border: "1px solid transparent",
    ...style,
  };

  const variants = {
    default: {
      backgroundColor: "#f1f5f9",
      color: "#475569",
      border: "1px solid #e2e8f0",
    },
    primary: {
      backgroundColor: "#dbeafe",
      color: "#1d4ed8",
      border: "1px solid #93c5fd",
    },
    secondary: {
      backgroundColor: "#f1f5f9",
      color: "#475569",
      border: "1px solid #cbd5e1",
    },
    success: {
      backgroundColor: "#d1fae5",
      color: "#065f46",
      border: "1px solid #86efac",
    },
    warning: {
      backgroundColor: "#fef3c7",
      color: "#92400e",
      border: "1px solid #fcd34d",
    },
    danger: {
      backgroundColor: "#fee2e2",
      color: "#dc2626",
      border: "1px solid #fca5a5",
    },
    info: {
      backgroundColor: "#e0f2fe",
      color: "#0369a1",
      border: "1px solid #7dd3fc",
    },
    dark: {
      backgroundColor: "#374151",
      color: "white",
      border: "1px solid #374151",
    },
    light: {
      backgroundColor: "white",
      color: "#374151",
      border: "1px solid #d1d5db",
    },
  };

  const sizes = {
    small: {
      fontSize: "11px",
      padding: "2px 6px",
      minHeight: "18px",
    },
    medium: {
      fontSize: "12px",
      padding: "4px 8px",
      minHeight: "22px",
    },
    large: {
      fontSize: "13px",
      padding: "6px 12px",
      minHeight: "26px",
    },
  };

  const dotStyle = {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: "currentColor",
  };

  const finalStyle = {
    ...baseStyle,
    ...variants[variant],
    ...sizes[size],
  };

  return (
    <span style={finalStyle} className={className} {...props}>
      {dot && <span style={dotStyle} />}
      {icon && (
        <span style={{ display: "flex", alignItems: "center" }}>{icon}</span>
      )}
      {children}
    </span>
  );
};

export default Badge;
