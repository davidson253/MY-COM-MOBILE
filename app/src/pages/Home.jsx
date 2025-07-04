import { useNavigate } from "react-router-dom";
import {
  FiShoppingBag,
  FiUsers,
  FiPackage,
  FiCreditCard,
  FiBarChart2,
  FiPlus,
  FiEye,
  FiTrendingUp,
  FiClock,
  FiStar,
} from "react-icons/fi";
import "./styles/Home.css";

export default function Home() {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: "Nouvelle Commande",
      description: "Créer une nouvelle commande rapidement",
      icon: FiPlus,
      color: "blue",
      action: () => navigate("/commandes"),
      highlight: true,
    },
    {
      title: "Voir Clients",
      description: "Consulter la liste des clients",
      icon: FiUsers,
      color: "green",
      action: () => navigate("/clients"),
    },
    {
      title: "Gérer Articles",
      description: "Consulter et modifier les articles",
      icon: FiPackage,
      color: "purple",
      action: () => navigate("/articles"),
    },
    {
      title: "Règlements",
      description: "Suivre les paiements et règlements",
      icon: FiCreditCard,
      color: "orange",
      action: () => navigate("/reglements"),
    },
  ];

  const recentActivities = [
    {
      icon: FiShoppingBag,
      title: "Nouvelle commande",
      description: "Commande #1234 créée",
      time: "Il y a 2h",
      color: "blue",
    },
    {
      icon: FiUsers,
      title: "Client ajouté",
      description: "Nouveau client enregistré",
      time: "Il y a 4h",
      color: "green",
    },
    {
      icon: FiPackage,
      title: "Article modifié",
      description: "Prix article mis à jour",
      time: "Il y a 6h",
      color: "purple",
    },
  ];

  const stats = [
    {
      title: "Commandes du jour",
      value: "24",
      icon: FiShoppingBag,
      trend: "+12%",
      color: "blue",
    },
    {
      title: "Clients actifs",
      value: "156",
      icon: FiUsers,
      trend: "+5%",
      color: "green",
    },
    {
      title: "Articles en stock",
      value: "432",
      icon: FiPackage,
      trend: "+2%",
      color: "purple",
    },
    {
      title: "CA du mois",
      value: "48.5K DT",
      icon: FiTrendingUp,
      trend: "+18%",
      color: "orange",
    },
  ];

  return (
    <div className="home-container">
      {/* Header de bienvenue */}
      <div className="home-header">
        <div className="home-welcome">
          <h1 className="home-title">
            <FiStar className="home-title-icon" />
            Bienvenue dans votre espace de gestion
          </h1>
          <p className="home-subtitle">
            Gérez vos commandes, clients et articles en toute simplicité
          </p>
        </div>
        <div className="home-time">
          <FiClock className="home-time-icon" />
          <span>
            {new Date().toLocaleDateString("fr-FR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="home-stats">
        <h2 className="home-section-title">Aperçu rapide</h2>
        <div className="home-stats-grid">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`home-stat-card home-stat-card--${stat.color}`}
            >
              <div className="home-stat-header">
                <stat.icon className="home-stat-icon" />
                <span className="home-stat-trend">{stat.trend}</span>
              </div>
              <div className="home-stat-content">
                <div className="home-stat-value">{stat.value}</div>
                <div className="home-stat-title">{stat.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions rapides */}
      <div className="home-actions">
        <h2 className="home-section-title">Actions rapides</h2>
        <div className="home-actions-grid">
          {quickActions.map((action, index) => (
            <div
              key={index}
              className={`home-action-card ${
                action.highlight ? "home-action-card--highlight" : ""
              } home-action-card--${action.color}`}
              onClick={action.action}
            >
              <div className="home-action-icon-wrapper">
                <action.icon className="home-action-icon" />
              </div>
              <div className="home-action-content">
                <h3 className="home-action-title">{action.title}</h3>
                <p className="home-action-description">{action.description}</p>
              </div>
              <div className="home-action-arrow">
                <FiEye className="home-action-arrow-icon" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activités récentes */}
      <div className="home-recent">
        <h2 className="home-section-title">Activités récentes</h2>
        <div className="home-recent-list">
          {recentActivities.map((activity, index) => (
            <div key={index} className="home-recent-item">
              <div
                className={`home-recent-icon home-recent-icon--${activity.color}`}
              >
                <activity.icon />
              </div>
              <div className="home-recent-content">
                <div className="home-recent-title">{activity.title}</div>
                <div className="home-recent-description">
                  {activity.description}
                </div>
              </div>
              <div className="home-recent-time">{activity.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
