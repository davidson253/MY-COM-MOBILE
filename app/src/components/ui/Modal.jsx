import { useEffect } from "react";
import Button from "./Button";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "medium",
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  className = "",
  style = {},
  ...props
}) => {
  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
    backdropFilter: "blur(4px)",
  };

  const sizes = {
    small: {
      maxWidth: "400px",
      width: "100%",
    },
    medium: {
      maxWidth: "600px",
      width: "100%",
    },
    large: {
      maxWidth: "800px",
      width: "100%",
    },
    xlarge: {
      maxWidth: "1000px",
      width: "100%",
    },
    full: {
      maxWidth: "95vw",
      width: "100%",
      height: "90vh",
    },
  };

  const modalStyle = {
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.25)",
    display: "flex",
    flexDirection: "column",
    maxHeight: "90vh",
    position: "relative",
    ...sizes[size],
    ...style,
  };

  const headerStyle = {
    padding: "24px 24px 0 24px",
    borderBottom: title ? "1px solid #e2e8f0" : "none",
    paddingBottom: title ? "16px" : "0",
    marginBottom: title ? "0" : "0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const titleStyle = {
    fontSize: "20px",
    fontWeight: "700",
    color: "#1e293b",
    margin: 0,
    flex: 1,
  };

  const closeButtonStyle = {
    position: "absolute",
    top: "16px",
    right: "16px",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "8px",
    borderRadius: "6px",
    color: "#64748b",
    fontSize: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "32px",
    height: "32px",
    transition: "all 0.2s ease",
  };

  const contentStyle = {
    padding: title ? "16px 24px" : "24px",
    flex: 1,
    overflowY: "auto",
  };

  const footerStyle = {
    padding: "16px 24px 24px 24px",
    borderTop: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
  };

  // Gestion de la fermeture avec Escape
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Prévention du scroll du body quand le modal est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCloseButtonMouseEnter = (e) => {
    e.target.style.backgroundColor = "#f1f5f9";
    e.target.style.color = "#374151";
  };

  const handleCloseButtonMouseLeave = (e) => {
    e.target.style.backgroundColor = "transparent";
    e.target.style.color = "#64748b";
  };

  return (
    <div style={overlayStyle} onClick={handleOverlayClick}>
      <div style={modalStyle} className={className} {...props}>
        {/* Header */}
        {(title || showCloseButton) && (
          <div style={headerStyle}>
            {title && <h2 style={titleStyle}>{title}</h2>}
            {showCloseButton && (
              <button
                style={closeButtonStyle}
                onClick={onClose}
                onMouseEnter={handleCloseButtonMouseEnter}
                onMouseLeave={handleCloseButtonMouseLeave}
                aria-label="Fermer"
              >
                <svg
                  width="16"
                  height="16"
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
        )}

        {/* Content */}
        <div style={contentStyle}>{children}</div>

        {/* Footer */}
        {footer && (
          <div style={footerStyle}>
            {Array.isArray(footer)
              ? footer.map((action, index) => (
                  <Button
                    key={index}
                    variant={action.variant || "secondary"}
                    onClick={action.onClick}
                    disabled={action.disabled}
                  >
                    {action.label}
                  </Button>
                ))
              : footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
