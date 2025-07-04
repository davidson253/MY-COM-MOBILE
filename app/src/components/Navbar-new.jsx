import { Link, useNavigate } from "react-router-dom";
import { useNavbar } from "../contexts/NavbarContext";
import ThemeSelector from "./ThemeSelector";
import SidebarLeftIcon from "../assets/Sidebar-left.svg";
import {
  FiHome,
  FiPackage,
  FiShoppingCart,
  FiUsers,
  FiCreditCard,
  FiLogOut,
} from "react-icons/fi";
import "./Navbar.css";

export default function Navbar() {
  const { isCollapsed, toggleNavbar } = useNavbar();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!token) return null;

  const NavLink = ({ to, icon, text, title }) => (
    <Link
      to={to}
      className="navbar__link"
      data-tooltip={isCollapsed ? title : ""}
    >
      <span className="navbar__link-icon">{icon}</span>
      <span className="navbar__link-text">{text}</span>
    </Link>
  );

  return (
    <nav className={`navbar ${isCollapsed ? "navbar--collapsed" : ""}`}>
      <div className="navbar__logo" onClick={toggleNavbar}>
        <div className="navbar__logo-text">COM MOBILE</div>
        <img
          src={SidebarLeftIcon}
          alt="Toggle Sidebar"
          className="navbar__toggle-icon"
        />
      </div>

      <NavLink to="/" icon={<FiHome />} text="Accueil" title="Accueil" />
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
        to="/clients"
        icon={<FiUsers />}
        text="Clients"
        title="Clients"
      />
      <NavLink
        to="/reglements"
        icon={<FiCreditCard />}
        text="Règlements"
        title="Règlements"
      />

      <div className="navbar__bottom">
        {/* Sélecteur de thème */}
        <div className="navbar__theme-section">
          <span className="navbar__theme-label">Thème</span>
          <ThemeSelector navbar={true} />
        </div>

        <button
          onClick={handleLogout}
          className="navbar__logout"
          data-tooltip={isCollapsed ? "Déconnexion" : ""}
        >
          <span className="navbar__logout-icon">
            <FiLogOut />
          </span>
          <span className="navbar__logout-text">Déconnexion</span>
        </button>
      </div>
    </nav>
  );
}
