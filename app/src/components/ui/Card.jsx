const Card = ({
  children,
  title,
  subtitle,
  header,
  footer,
  variant = "default",
  padding = "medium",
  shadow = true,
  hover = false,
  className = "",
  style = {},
  ...props
}) => {
  const baseStyle = {
    backgroundColor: "white",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    overflow: "hidden",
    transition: "all 0.2s ease",
    ...style,
  };

  const variants = {
    default: {
      backgroundColor: "white",
    },
    bordered: {
      border: "2px solid #e2e8f0",
    },
    elevated: {
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    },
    highlighted: {
      border: "2px solid #3b82f6",
      backgroundColor: "#f8fafc",
    },
  };

  const paddings = {
    none: "0",
    small: "16px",
    medium: "24px",
    large: "32px",
  };

  const shadows = {
    none: "none",
    small: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
    medium: "0 4px 6px rgba(0, 0, 0, 0.1)",
    large: "0 10px 25px rgba(0, 0, 0, 0.15)",
  };

  const finalStyle = {
    ...baseStyle,
    ...variants[variant],
    padding: header || footer ? "0" : paddings[padding],
    boxShadow: shadow ? shadows.medium : shadows.none,
  };

  const handleMouseEnter = (e) => {
    if (hover) {
      e.target.style.transform = "translateY(-2px)";
      e.target.style.boxShadow = shadows.large;
    }
  };

  const handleMouseLeave = (e) => {
    if (hover) {
      e.target.style.transform = "translateY(0)";
      e.target.style.boxShadow = shadow ? shadows.medium : shadows.none;
    }
  };

  return (
    <div
      style={finalStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={className}
      {...props}
    >
      {header && (
        <div
          style={{
            padding: paddings[padding],
            borderBottom: "1px solid #e2e8f0",
            backgroundColor: "#f8fafc",
          }}
        >
          {header}
        </div>
      )}

      {(title || subtitle) && !header && (
        <div
          style={{
            padding: paddings[padding],
            borderBottom: "1px solid #e2e8f0",
            backgroundColor: "#f8fafc",
          }}
        >
          {title && (
            <h3
              style={{
                margin: "0 0 8px 0",
                fontSize: "20px",
                fontWeight: "700",
                color: "#1e293b",
              }}
            >
              {title}
            </h3>
          )}
          {subtitle && (
            <p
              style={{
                margin: "0",
                fontSize: "14px",
                color: "#64748b",
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div
        style={{
          padding:
            header || footer || title || subtitle ? paddings[padding] : "0",
        }}
      >
        {children}
      </div>

      {footer && (
        <div
          style={{
            padding: paddings[padding],
            borderTop: "1px solid #e2e8f0",
            backgroundColor: "#f8fafc",
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
