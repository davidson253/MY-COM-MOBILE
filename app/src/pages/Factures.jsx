import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles/SharedPageStyles.css";

const columns = [
  {
    key: "numfacture",
    title: "N° Facture",
    dataKey: "numfacture",
    render: (value) => <span>{value}</span>,
  },
  {
    key: "datefacture",
    title: "Date Facture",
    dataKey: "datefacture",
    render: (value) => <span>{new Date(value).toLocaleDateString()}</span>,
  },
  {
    key: "montant",
    title: "Montant",
    dataKey: "montant",
    render: (value) => <span>{value.toFixed(2)} €</span>,
  },
  {
    key: "client",
    title: "Client",
    dataKey: "client",
    render: (value) => <span>{value || "Non renseigné"}</span>,
  },
];

const Factures = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFactures = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/factures", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setData(response.data);
      } catch (err) {
        setError("Une erreur s'est produite lors du chargement des factures.");
      } finally {
        setLoading(false);
      }
    };

    fetchFactures();
  }, []);

  if (loading) {
    return <p>Chargement des factures...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="shared-page">
      <h1>Factures</h1>
      <p>Liste des factures filtrée par représentant.</p>
      <table className="shared-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {columns.map((col) => (
                <td key={col.key}>{col.render(row[col.dataKey])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Factures;
