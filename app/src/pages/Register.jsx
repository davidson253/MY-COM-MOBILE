import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import {
  formStyle,
  inputStyle,
  buttonStyle,
  errorStyle,
  successStyle,
} from "../styles/commonStyles";
import { FiUser, FiMail, FiLock, FiUserPlus } from "react-icons/fi";

export default function Register() {
  const [libelle, setLibelle] = useState(""); // Nom du représentant
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [typerep, setTyperep] = useState("Commercial"); // Type de représentant
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setOk("");

    try {
      const res = await api.register(libelle, email, password, typerep);
      if (res.message) {
        setOk(`Inscription réussie ! Code représentant: ${res.code}`);
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setErr(res.error || "Erreur d'inscription");
      }
    } catch (error) {
      setErr(error.message || "Erreur d'inscription");
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
          <FiUserPlus
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
            Inscription
          </h2>
          <p
            style={{
              color: "#7f8c8d",
              margin: "8px 0 0 0",
              fontSize: "15px",
            }}
          >
            Créez votre compte pour commencer
          </p>
        </div>

        <div style={inputWrapperStyle}>
          <FiUser style={iconStyle} />
          <input
            type="text"
            placeholder="Nom du représentant"
            value={libelle}
            required
            onChange={(e) => setLibelle(e.target.value)}
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

        <div style={inputWrapperStyle}>
          <FiUser style={iconStyle} />
          <select
            value={typerep}
            onChange={(e) => setTyperep(e.target.value)}
            style={inputWithIconStyle}
            onFocus={(e) => {
              e.target.style.borderColor = "#667eea";
              e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e1e5e9";
              e.target.style.boxShadow = "none";
            }}
          >
            <option value="Commercial">Commercial</option>
            <option value="Manager">Manager</option>
            <option value="Superviseur">Superviseur</option>
            <option value="Admin">Administrateur</option>
          </select>
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
          Créer mon compte
        </button>

        {ok && <div style={successStyle}>{ok}</div>}
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
            to="/login"
            style={{
              color: "#667eea",
              textDecoration: "none",
              fontWeight: "500",
              fontSize: "15px",
            }}
          >
            Déjà un compte ? Se connecter
          </Link>
        </div>
      </form>
    </div>
  );
}
