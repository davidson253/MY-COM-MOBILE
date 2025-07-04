import { Link, useNavigate } from "react-router-dom";
import { useNavbar } from "../contexts/NavbarContext";
import ThemeSelector from "./ThemeSelector";
import api from "../services/api";
import {
  FiHome,
  FiPackage,
  FiShoppingCart,
  FiUsers,
  FiCreditCard,
  FiFileText,
  FiLogOut,
  FiSettings,
} from "react-icons/fi";

export default function Navbar() {
  const { isCollapsed, toggleNavbar } = useNavbar();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleLogout = async () => {
    try {
      // Appeler l'API de déconnexion pour logger l'événement
      await api.logout();
      console.log("✅ Déconnexion loggée avec succès");
    } catch (error) {
      console.warn("⚠️ Erreur lors du log de déconnexion:", error.message);
      // Continuer la déconnexion même en cas d'erreur de log
    } finally {
      // Nettoyer le localStorage et rediriger
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      navigate("/login");
    }
  };

  const navStyle = {
    width: isCollapsed ? "70px" : "220px",
    height: "100vh",
    background: "linear-gradient(180deg, #2c3e50 0%, #34495e 100%)",
    color: "white",
    position: "fixed",
    left: 0,
    top: 0,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    display: "flex",
    flexDirection: "column",
    paddingTop: "0",
    zIndex: 1000,
    boxShadow: "4px 0 20px rgba(0,0,0,0.1)",
  };

  const linkStyle = {
    color: "white",
    textDecoration: "none",
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: isCollapsed ? "center" : "flex-start",
    gap: isCollapsed ? "0" : "12px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    transition: "all 0.2s ease",
    position: "relative",
  };

  const iconStyle = {
    fontSize: "20px",
    minWidth: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const textStyle = {
    display: isCollapsed ? "none" : "block",
    whiteSpace: "nowrap",
    fontSize: "15px",
    fontWeight: "500",
  };

  const logoStyle = {
    padding: "20px",
    borderBottom: "2px solid rgba(255,255,255,0.2)",
    marginBottom: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: isCollapsed ? "center" : "space-between",
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

  const logoTextStyle = {
    fontSize: isCollapsed ? "0" : "18px",
    fontWeight: "bold",
    color: "#ecf0f1",
    opacity: isCollapsed ? 0 : 1,
    transition: "all 0.3s ease",
    whiteSpace: "nowrap",
  };

  const toggleIconStyle = {
    width: "22px",
    height: "22px",
    fill: "#ecf0f1",
    transition: "all 0.3s ease",
    cursor: "pointer",
    flexShrink: 0,
  };

  if (!token) return null;

  const NavLink = ({ to, icon, text, title }) => (
    <Link
      to={to}
      style={linkStyle}
      onMouseEnter={(e) => {
        e.target.closest("a").style.backgroundColor = "rgba(255,255,255,0.1)";
        e.target.closest("a").style.transform = "translateX(4px)";
      }}
      onMouseLeave={(e) => {
        e.target.closest("a").style.backgroundColor = "transparent";
        e.target.closest("a").style.transform = "translateX(0)";
      }}
      title={isCollapsed ? title : ""}
    >
      <span style={iconStyle}>{icon}</span>
      <span style={textStyle}>{text}</span>
    </Link>
  );

  return (
    <nav style={navStyle}>
      <div
        style={logoStyle}
        onClick={toggleNavbar}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "rgba(255,255,255,0.1)";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "transparent";
        }}
      >
        <div style={logoTextStyle}>COM MOBILE</div>
        <svg style={toggleIconStyle} viewBox="0 0 56 56">
          <path d="M 7.7148 49.5742 L 48.2852 49.5742 C 53.1836 49.5742 55.6446 47.1367 55.6446 42.3086 L 55.6446 13.6914 C 55.6446 8.8633 53.1836 6.4258 48.2852 6.4258 L 7.7148 6.4258 C 2.8398 6.4258 .3554 8.8398 .3554 13.6914 L .3554 42.3086 C .3554 47.1602 2.8398 49.5742 7.7148 49.5742 Z M 7.7851 45.8008 C 5.4413 45.8008 4.1288 44.5586 4.1288 42.1211 L 4.1288 13.8789 C 4.1288 11.4414 5.4413 10.1992 7.7851 10.1992 L 18.2148 10.1992 L 18.2148 45.8008 Z M 48.2147 10.1992 C 50.5350 10.1992 51.8708 11.4414 51.8708 13.8789 L 51.8708 42.1211 C 51.8708 44.5586 50.5350 45.8008 48.2147 45.8008 L 21.8944 45.8008 L 21.8944 10.1992 Z M 13.7148 18.8945 C 14.4179 18.8945 15.0507 18.2617 15.0507 17.5820 C 15.0507 16.8789 14.4179 16.2696 13.7148 16.2696 L 8.6757 16.2696 C 7.9726 16.2696 7.3632 16.8789 7.3632 17.5820 C 7.3632 18.2617 7.9726 18.8945 8.6757 18.8945 Z M 13.7148 24.9649 C 14.4179 24.9649 15.0507 24.3320 15.0507 23.6289 C 15.0507 22.9258 14.4179 22.3398 13.7148 22.3398 L 8.6757 22.3398 C 7.9726 22.3398 7.3632 22.9258 7.3632 23.6289 C 7.3632 24.3320 7.9726 24.9649 8.6757 24.9649 Z M 13.7148 31.0118 C 14.4179 31.0118 15.0507 30.4258 15.0507 29.7227 C 15.0507 29.0196 14.4179 28.4102 13.7148 28.4102 L 8.6757 28.4102 C 7.9726 28.4102 7.3632 29.0196 7.3632 29.7227 C 7.3632 30.4258 7.9726 31.0118 8.6757 31.0118 Z" />
        </svg>
      </div>

      <NavLink to="/" icon={<FiHome />} text="Accueil" title="Accueil" />
      <NavLink
        to="/clients"
        icon={<FiUsers />}
        text="Clients"
        title="Clients"
      />
      <NavLink
        to="/articles"
        icon={<FiPackage />}
        text="Articles"
        title="Articles"
      />
      <NavLink
        to="/commandes"
        icon={<FiShoppingCart />}
        text="Commandes"
        title="Commandes"
      />
      <NavLink
        to="/reglements"
        icon={<FiCreditCard />}
        text="Règlements"
        title="Règlements"
      />
      <NavLink
        to="/factures"
        icon={<FiFileText />}
        text="Factures"
        title="Factures"
      />
      <NavLink
        to="/test-forms"
        icon={<FiSettings />}
        text="Test UI"
        title="Test des interfaces de formulaire"
      />

      <div style={{ marginTop: "auto" }}>
        {/* Sélecteur de thème - adaptatif selon l'état de la navbar */}
        <div
          style={{
            padding: isCollapsed ? "12px" : "16px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            flexDirection: isCollapsed ? "column" : "row",
            justifyContent: isCollapsed ? "center" : "flex-start",
            alignItems: "center",
            gap: isCollapsed ? "4px" : "0",
          }}
        >
          {!isCollapsed && (
            <span
              style={{
                fontSize: "13px",
                color: "rgba(255,255,255,0.7)",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Thème
            </span>
          )}
          <div style={{ width: isCollapsed ? "100%" : "auto" }}>
            <ThemeSelector navbar={true} collapsed={isCollapsed} />
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            ...linkStyle,
            background: "none",
            border: "none",
            width: "100%",
            textAlign: "left",
            color: "#e74c3c",
            fontSize: "15px",
            fontWeight: "500",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "rgba(231, 76, 60, 0.1)";
            e.target.style.transform = "translateX(4px)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "transparent";
            e.target.style.transform = "translateX(0)";
          }}
          title={isCollapsed ? "Déconnexion" : ""}
        >
          <span style={iconStyle}>
            <FiLogOut />
          </span>
          <span style={textStyle}>Déconnexion</span>
        </button>
      </div>
    </nav>
  );
}
