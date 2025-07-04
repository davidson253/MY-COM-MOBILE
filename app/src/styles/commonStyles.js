// Styles communs pour éviter la duplication
export const formStyle = {
  maxWidth: 400,
  margin: "40px auto",
  padding: 32,
  borderRadius: 12,
  background: "#fff",
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  display: "flex",
  flexDirection: "column",
  gap: 16,
};

export const inputStyle = {
  padding: "12px 16px",
  borderRadius: 8,
  border: "2px solid #e1e5e9",
  fontSize: 16,
  transition: "all 0.2s ease",
  outline: "none",
};

export const buttonStyle = {
  padding: "12px 24px",
  borderRadius: 8,
  border: "none",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "#fff",
  fontWeight: "600",
  fontSize: 16,
  cursor: "pointer",
  marginTop: 12,
  transition: "all 0.3s ease",
  transform: "translateY(0)",
};

export const cardStyle = {
  padding: "24px",
  backgroundColor: "#fff",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  transition: "all 0.3s ease",
  cursor: "pointer",
  border: "1px solid transparent",
};

export const errorStyle = {
  color: "#e74c3c",
  backgroundColor: "#ffeaea",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #f5c6cb",
  marginTop: 8,
  fontSize: "14px",
};

export const successStyle = {
  color: "#27ae60",
  backgroundColor: "#eafaf1",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #c3e6cb",
  marginTop: 8,
  fontSize: "14px",
};
