import { cloneElement } from "react";

const Button = ({
  children,
  variant = "primary",
  size = "medium",
  icon,
  disabled = false,
  loading = false,
  onClick,
  type = "button",
  className = "",
  ...props
}) => {
  const baseStyle = {
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: disabled || loading ? "not-allowed" : "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.2s ease",
    opacity: disabled || loading ? 0.7 : 1,
    ...props.style,
  };

  const variants = {
    primary: {
      backgroundColor: "#3b82f6",
      color: "white",
    },
    secondary: {
      backgroundColor: "#64748b",
      color: "white",
    },
    success: {
      backgroundColor: "#10b981",
      color: "white",
    },
    warning: {
      backgroundColor: "#f59e0b",
      color: "white",
    },
    danger: {
      backgroundColor: "#ef4444",
      color: "white",
    },
    outline: {
      backgroundColor: "transparent",
      color: "#3b82f6",
      border: "2px solid #3b82f6",
    },
  };

  const sizes = {
    small: {
      padding: "8px 12px",
      fontSize: "13px",
    },
    medium: {
      padding: "14px 28px",
      fontSize: "15px",
    },
    large: {
      padding: "16px 32px",
      fontSize: "16px",
    },
    icon: {
      padding: "8px 12px",
      fontSize: "14px",
    },
  };

  const hoverColors = {
    primary: "#2563eb",
    secondary: "#475569",
    success: "#059669",
    warning: "#d97706",
    danger: "#dc2626",
    outline: "#f8fafc",
  };

  const finalStyle = {
    ...baseStyle,
    ...variants[variant],
    ...sizes[size],
  };

  const handleMouseEnter = (e) => {
    if (!disabled && !loading) {
      e.target.style.backgroundColor = hoverColors[variant];
      e.target.style.transform = "translateY(-1px)";
      if (variant === "outline") {
        e.target.style.color = "#2563eb";
      }
    }
  };

  const handleMouseLeave = (e) => {
    if (!disabled && !loading) {
      e.target.style.backgroundColor = variants[variant].backgroundColor;
      e.target.style.transform = "translateY(0)";
      if (variant === "outline") {
        e.target.style.color = "#3b82f6";
      }
    }
  };

  return (
    <button
      type={type}
      onClick={disabled || loading ? undefined : onClick}
      style={finalStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={className}
      {...props}
    >
      {loading && (
        <div
          style={{
            width: "16px",
            height: "16px",
            border: "2px solid transparent",
            borderTop: "2px solid currentColor",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
      )}
      {!loading &&
        icon &&
        cloneElement(icon, { size: size === "small" ? 14 : 16 })}
      {children}
    </button>
  );
};

export default Button;
