import Button from "./Button";

const PageHeader = ({
  title,
  subtitle,
  breadcrumbs,
  actions,
  stats,
  className = "",
  style = {},
  ...props
}) => {
  const baseStyle = {
    backgroundColor: "white",
    borderBottom: "1px solid #e2e8f0",
    padding: "24px 0",
    marginBottom: "24px",
    ...style,
  };

  const containerStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 24px",
  };

  const headerRowStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "24px",
    marginBottom: stats ? "24px" : "0",
  };

  const titleSectionStyle = {
    flex: 1,
    minWidth: 0,
  };

  const titleStyle = {
    fontSize: "32px",
    fontWeight: "800",
    color: "#1e293b",
    margin: "0 0 8px 0",
    lineHeight: "1.2",
  };

  const subtitleStyle = {
    fontSize: "16px",
    color: "#64748b",
    margin: "0",
    lineHeight: "1.5",
  };

  const breadcrumbsStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "16px",
    fontSize: "14px",
    color: "#64748b",
  };

  const actionsStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexShrink: 0,
  };

  const statsStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
  };

  const statCardStyle = {
    backgroundColor: "#f8fafc",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
  };

  const statValueStyle = {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1e293b",
    margin: "0 0 4px 0",
  };

  const statLabelStyle = {
    fontSize: "14px",
    color: "#64748b",
    margin: "0",
  };

  return (
    <div style={baseStyle} className={className} {...props}>
      <div style={containerStyle}>
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div style={breadcrumbsStyle}>
            {breadcrumbs.map((crumb, index) => (
              <span
                key={index}
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                {index > 0 && (
                  <span style={{ color: "#cbd5e1" }}>
                    <svg
                      width="4"
                      height="4"
                      viewBox="0 0 4 4"
                      fill="currentColor"
                    >
                      <circle cx="2" cy="2" r="1" />
                    </svg>
                  </span>
                )}
                {crumb.href ? (
                  <a
                    href={crumb.href}
                    style={{
                      color:
                        index === breadcrumbs.length - 1
                          ? "#1e293b"
                          : "#64748b",
                      textDecoration: "none",
                      fontWeight:
                        index === breadcrumbs.length - 1 ? "600" : "400",
                    }}
                  >
                    {crumb.label}
                  </a>
                ) : (
                  <span
                    style={{
                      color:
                        index === breadcrumbs.length - 1
                          ? "#1e293b"
                          : "#64748b",
                      fontWeight:
                        index === breadcrumbs.length - 1 ? "600" : "400",
                    }}
                  >
                    {crumb.label}
                  </span>
                )}
              </span>
            ))}
          </div>
        )}

        {/* Header Row */}
        <div style={headerRowStyle}>
          <div style={titleSectionStyle}>
            <h1 style={titleStyle}>{title}</h1>
            {subtitle && <p style={subtitleStyle}>{subtitle}</p>}
          </div>

          {actions && actions.length > 0 && (
            <div style={actionsStyle}>
              {actions.map((action, index) => {
                if (action.type === "button") {
                  return (
                    <Button
                      key={index}
                      variant={action.variant || "primary"}
                      onClick={action.onClick}
                      icon={action.icon}
                      disabled={action.disabled}
                    >
                      {action.label}
                    </Button>
                  );
                } else {
                  return action.component;
                }
              })}
            </div>
          )}
        </div>

        {/* Stats */}
        {stats && stats.length > 0 && (
          <div style={statsStyle}>
            {stats.map((stat, index) => (
              <div key={index} style={statCardStyle}>
                <div style={statValueStyle}>{stat.value}</div>
                <div style={statLabelStyle}>{stat.label}</div>
                {stat.change && (
                  <div
                    style={{
                      fontSize: "12px",
                      color: stat.change.startsWith("+")
                        ? "#10b981"
                        : "#ef4444",
                      marginTop: "4px",
                      fontWeight: "600",
                    }}
                  >
                    {stat.change}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
