import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import {
  formStyle,
  inputStyle,
  buttonStyle,
  errorStyle,
} from "../styles/commonStyles";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";

export default function Login() {
  const [email, setEmail] = useState("bot2@gmail.com"); // Vide pour la production
  const [password, setPassword] = useState(""); // Vide pour la production
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!email || !password) {
      setErr("Veuillez remplir tous les champs");
      return;
    }

    try {
      const res = await api.login(email, password);

      if (res.token && res.user) {
        setEmail("");
        setPassword("");

        // Redirection après connexion réussie
        navigate("/", { replace: true });
      } else {
        setErr("Réponse invalide du serveur");
      }
    } catch (error) {
      setErr(error.message || "Erreur de connexion");
    }
  };

  const containerStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  };

  const inputWrapperStyle = {
    position: "relative",
    display: "flex",
    alignItems: "center",
  };

  const iconStyle = {
    position: "absolute",
    left: "16px",
    color: "#7f8c8d",
    zIndex: 1,
  };

  const inputWithIconStyle = {
    ...inputStyle,
    paddingLeft: "48px",
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <FiLogIn
            size={48}
            style={{ color: "#667eea", marginBottom: "16px" }}
          />
          <h2
            style={{
              margin: "0",
              fontSize: "28px",
              fontWeight: "700",
              color: "#2c3e50",
            }}
          >
            Connexion
          </h2>
          <p
            style={{
              color: "#7f8c8d",
              margin: "8px 0 0 0",
              fontSize: "15px",
            }}
          >
            Accédez à votre espace de gestion
          </p>
        </div>

        <div style={inputWrapperStyle}>
          <FiMail style={iconStyle} />
          <input
            type="email"
            placeholder="Adresse email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            style={inputWithIconStyle}
            onFocus={(e) => {
              e.target.style.borderColor = "#667eea";
              e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e1e5e9";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>

        <div style={inputWrapperStyle}>
          <FiLock style={iconStyle} />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            style={inputWithIconStyle}
            onFocus={(e) => {
              e.target.style.borderColor = "#667eea";
              e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e1e5e9";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>

        <button
          type="submit"
          style={buttonStyle}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 8px 25px rgba(102, 126, 234, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "none";
          }}
        >
          Se connecter
        </button>

        {err && <div style={errorStyle}>{err}</div>}

        <div
          style={{
            marginTop: "24px",
            textAlign: "center",
            padding: "16px 0",
            borderTop: "1px solid #f0f0f0",
          }}
        >
          <Link
            to="/register"
            style={{
              color: "#667eea",
              textDecoration: "none",
              fontWeight: "500",
              fontSize: "15px",
            }}
          >
            Pas de compte ? Créer un compte
          </Link>
        </div>
      </form>
    </div>
  );
}
