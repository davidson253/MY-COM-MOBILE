import React from "react";
import { FiPrinter, FiX } from "react-icons/fi";
import DTIcon from "./DTIcon";
import "./TicketCaisse.css";

const TicketCaisse = ({ commande, client, lignes, onClose, onPrint }) => {
  if (!commande || !client) {
    return null;
  }

  // Informations entreprise (à adapter selon vos données)
  const entreprise = {
    nom: "Mon Entreprise",
    matricule: "1234567ABC", // Matricule fiscal entreprise
    adresse: "123 Rue de l'Entreprise, Tunis",
    tel: "71 123 456",
  };

  // Calculs
  const totalHT = lignes?.reduce((sum, ligne) => sum + (ligne.qte * ligne.prix), 0) || 0;
  const tva = totalHT * 0.2; // 20% TVA
  const totalTTC = totalHT + tva;

  const handlePrint = () => {
    window.print();
    if (onPrint) onPrint();
  };

  return (
    <div className="ticket-overlay">
      <div className="ticket-container">
        {/* Header avec boutons */}
        <div className="ticket-header">
          <h3>Ticket de Caisse</h3>
          <div className="ticket-actions">
            <button onClick={handlePrint} className="ticket-btn print">
              <FiPrinter size={16} />
              Imprimer
            </button>
            <button onClick={onClose} className="ticket-btn close">
              <FiX size={16} />
              Fermer
            </button>
          </div>
        </div>

        {/* Ticket à imprimer */}
        <div className="ticket-paper" id="ticket-print">
          {/* En-tête entreprise */}
          <div className="ticket-entreprise">
            <h2>{entreprise.nom}</h2>
            <p>Matricule Fiscal: {entreprise.matricule}</p>
            <p>{entreprise.adresse}</p>
            <p>Tél: {entreprise.tel}</p>
          </div>

          <div className="ticket-separator"></div>

          {/* Informations commande */}
          <div className="ticket-commande">
            <p><strong>Commande N°:</strong> {commande.numero}</p>
            <p><strong>Date:</strong> {commande.datebc}</p>
          </div>

          {/* Informations client */}
          <div className="ticket-client">
            <p><strong>Client:</strong> {client.rsoc}</p>
            <p><strong>Matricule Fiscal:</strong> {client.mf || "Non renseigné"}</p>
            {client.adresse && <p><strong>Adresse:</strong> {client.adresse}</p>}
          </div>

          <div className="ticket-separator"></div>

          {/* Détail des articles */}
          <div className="ticket-articles">
            <h4>Détail des Articles</h4>
            <table className="ticket-table">
              <thead>
                <tr>
                  <th>Article</th>
                  <th>Qté</th>
                  <th>Prix Unit.</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {lignes?.map((ligne, index) => (
                  <tr key={index}>
                    <td className="article-libelle">{ligne.libelle || ligne.codeart}</td>
                    <td className="qte">{ligne.qte}</td>
                    <td className="prix-unit">
                      <DTIcon name="tunisian-dinar" size={12} />
                      {parseFloat(ligne.prix).toFixed(3)}
                    </td>
                    <td className="total-ligne">
                      <DTIcon name="tunisian-dinar" size={12} />
                      {(ligne.qte * ligne.prix).toFixed(3)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="ticket-separator"></div>

          {/* Totaux */}
          <div className="ticket-totaux">
            <div className="total-ligne">
              <span>Total HT:</span>
              <span>
                <DTIcon name="tunisian-dinar" size={14} />
                {totalHT.toFixed(3)}
              </span>
            </div>
            <div className="total-ligne">
              <span>TVA (20%):</span>
              <span>
                <DTIcon name="tunisian-dinar" size={14} />
                {tva.toFixed(3)}
              </span>
            </div>
            <div className="total-ligne total-ttc">
              <span><strong>Total TTC:</strong></span>
              <span>
                <strong>
                  <DTIcon name="tunisian-dinar" size={16} />
                  {totalTTC.toFixed(3)}
                </strong>
              </span>
            </div>
          </div>

          <div className="ticket-separator"></div>

          {/* Footer */}
          <div className="ticket-footer">
            <p>Merci pour votre confiance !</p>
            <p>Bon pour accord</p>
            <div className="ticket-date">
              <p>Imprimé le: {new Date().toLocaleString('fr-FR')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketCaisse;
