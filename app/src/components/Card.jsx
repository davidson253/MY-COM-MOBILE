import { useNavigate } from "react-router-dom";

const Card = ({
  icon,
  title,
  description,
  link,
  gradient = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
}) => {
  const navigate = useNavigate();

  const cardStyle = {
    padding: "28px",
    backgroundColor: "#fff",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "pointer",
    border: "1px solid #f0f0f0",
    position: "relative",
    overflow: "hidden",
  };

  const cardHoverStyle = {
    transform: "translateY(-8px)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
    borderColor: "transparent",
  };

  const iconContainerStyle = {
    width: "60px",
    height: "60px",
    borderRadius: "16px",
    background: gradient,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "20px",
    fontSize: "24px",
    color: "white",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
  };

  const titleStyle = {
    fontSize: "20px",
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: "12px",
    lineHeight: "1.2",
  };

  const descriptionStyle = {
    color: "#7f8c8d",
    fontSize: "15px",
    lineHeight: "1.5",
    marginBottom: "0",
  };

  const handleClick = () => {
    if (link) {
      navigate(link);
    }
  };

  return (
    <div
      style={cardStyle}
      onClick={handleClick}
      onMouseEnter={(e) => {
        Object.assign(e.target.style, cardHoverStyle);
      }}
      onMouseLeave={(e) => {
        Object.assign(e.target.style, cardStyle);
      }}
    >
      <div style={iconContainerStyle}>{icon}</div>
      <h3 style={titleStyle}>{title}</h3>
      <p style={descriptionStyle}>{description}</p>
    </div>
  );
};

export default Card;
