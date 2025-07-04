import React from "react";
import "./styles/SharedPageStyles.css";

const columns = [
  {
    key: "numticket",
    title: "N° Ticket",
    dataKey: "numticket",
    render: (value) => <span>{value}</span>,
  },
  {
    key: "dateticket",
    title: "Date Ticket",
    dataKey: "dateticket",
    render: (value) => <span>{new Date(value).toLocaleDateString()}</span>,
  },
  {
    key: "montant",
    title: "Montant",
    dataKey: "montant",
    render: (value) => <span>{value.toFixed(2)} €</span>,
  },
  {
    key: "caissier",
    title: "Caissier",
    dataKey: "caissier",
    render: (value) => <span>{value || "Non renseigné"}</span>,
  },
];

const TicketCaisse = () => {
  const data = [
    {
      numticket: "T001",
      dateticket: "2025-07-01",
      montant: 50.0,
      caissier: "Caissier A",
    },
    {
      numticket: "T002",
      dateticket: "2025-07-02",
      montant: 75.5,
      caissier: "Caissier B",
    },
  ];

  return (
    <div className="shared-page">
      <h1>Tickets de Caisse</h1>
      <p>Liste des tickets de caisse filtrée par représentant.</p>
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

export default TicketCaisse;
