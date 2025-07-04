import React from "react";
import "./styles/SharedPageStyles.css";

const Dashboard = () => {
  const stats = [
    { label: "Total Clients", value: 120 },
    { label: "Total Commandes", value: 85 },
    { label: "Total Règlements", value: 95 },
  ];

  return (
    <div className="shared-page">
      <h1>Tableaux de Bord</h1>
      <div className="stats-container">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <h2>{stat.value}</h2>
            <p>{stat.label}</p>
          </div>
        ))}
      </div>
      <div className="charts-container">
        <p>Graphiques à venir...</p>
        {/* Ajout de graphiques interactifs ici */}
      </div>
    </div>
  );
};

export default Dashboard;
