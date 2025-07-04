import { useCallback } from "react";
import api from "../services/api";

const useTicketPrint = () => {
  const printTicket = useCallback(async (commandeData) => {
    try {
      // Récupérer les détails complets de la commande avec les lignes
      const commande = await api.getCommande(commandeData.numbc);

      // Créer le contenu HTML du ticket
      const ticketHTML = generateTicketHTML(commande);

      // Ouvrir une nouvelle fenêtre pour l'impression
      const printWindow = window.open(
        "",
        "_blank",
        "width=700,height=600,scrollbars=yes,resizable=yes"
      );
      printWindow.document.write(ticketHTML);
      printWindow.document.close();

      // Attendre que le contenu soit chargé puis imprimer
      printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
      };
    } catch (error) {
      console.error("Erreur lors de l'impression:", error);
      alert("Erreur lors de l'impression du ticket");
    }
  }, []);

  const generateTicketHTML = (commande) => {
    const { entete, lignes } = commande;
    const currentDate = new Date().toLocaleString("fr-FR");

    // Calculer les totaux
    let totalQuantite = 0;
    let totalHT = 0;

    lignes?.forEach((ligne) => {
      totalQuantite += parseInt(ligne.qte || 0);
      totalHT += parseFloat(ligne.puart || 0) * parseInt(ligne.qte || 0);
    });

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Ticket Commande ${entete.numbc}</title>
        <style>
          @page {
            size: 80mm auto;
            margin: 5mm;
          }
          @media print {
            body { 
              width: 70mm;
              margin: 0;
              padding: 0;
              font-family: 'Courier New', monospace;
            }
          }
          body {
            width: 80mm;
            margin: 0 auto;
            padding: 5mm;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            line-height: 1.2;
            color: #000;
            background: white;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 5px;
            margin-bottom: 8px;
          }
          .company-name {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 2px;
          }
          .company-info {
            font-size: 10px;
            margin-bottom: 1px;
          }
          .separator {
            text-align: center;
            margin: 5px 0;
            border-bottom: 1px dashed #000;
          }
          .section-title {
            font-weight: bold;
            font-size: 11px;
            margin-top: 8px;
            margin-bottom: 3px;
            text-decoration: underline;
          }
          .info-line {
            display: flex;
            justify-content: space-between;
            margin-bottom: 2px;
            font-size: 11px;
          }
          .info-label {
            font-weight: bold;
          }
          .items-table {
            width: 100%;
            margin: 8px 0;
            font-size: 10px;
          }
          .items-header {
            border-bottom: 1px solid #000;
            font-weight: bold;
            padding: 2px 0;
          }
          .item-line {
            padding: 2px 0;
            border-bottom: 1px dotted #ccc;
          }
          .item-code {
            font-weight: bold;
          }
          .item-desc {
            font-size: 9px;
            color: #666;
          }
          .totals {
            margin-top: 8px;
            border-top: 2px solid #000;
            padding-top: 5px;
          }
          .total-line {
            display: flex;
            justify-content: space-between;
            margin-bottom: 2px;
            font-size: 11px;
          }
          .total-final {
            font-weight: bold;
            font-size: 13px;
            border-top: 1px solid #000;
            padding-top: 3px;
            margin-top: 3px;
          }
          .footer {
            text-align: center;
            margin-top: 10px;
            font-size: 10px;
            border-top: 1px dashed #000;
            padding-top: 5px;
          }
          .qr-placeholder {
            text-align: center;
            margin: 5px 0;
            font-size: 8px;
            color: #888;
          }
        </style>
      </head>
      <body>
        <!-- En-tête entreprise -->
        <div class="header">
          <div class="company-name">NOTRE ENTREPRISE</div>
          <div class="company-info">Service de Livraison</div>
          <div class="company-info">Tél: +216 74 XXX XXX</div>
          ${
            entete.matricule
              ? `<div class="company-info">MF: ${entete.matricule}</div>`
              : ""
          }
        </div>

        <!-- Informations commande -->
        <div class="section-title">COMMANDE N° ${entete.numbc}</div>
        
        <div class="info-line">
          <span class="info-label">Date:</span>
          <span>${
            entete.datebc
              ? new Date(entete.datebc).toLocaleDateString("fr-FR")
              : ""
          }</span>
        </div>
        
        <div class="info-line">
          <span class="info-label">Heure:</span>
          <span>${currentDate.split(" ")[1]}</span>
        </div>

        ${
          entete.coderep
            ? `
        <div class="info-line">
          <span class="info-label">Représentant:</span>
          <span>${entete.librep || entete.coderep}</span>
        </div>
        `
            : ""
        }

        <!-- Informations client -->
        ${
          entete.rsocf
            ? `
        <div class="separator"></div>
        <div class="section-title">CLIENT</div>
        <div class="info-line">
          <span class="info-label">Nom:</span>
          <span>${entete.rsocf}</span>
        </div>
        ${
          entete.adresf
            ? `
        <div class="info-line">
          <span class="info-label">Adresse:</span>
          <span>${entete.adresf}</span>
        </div>
        `
            : ""
        }
        ${
          entete.tel
            ? `
        <div class="info-line">
          <span class="info-label">Tél:</span>
          <span>${entete.tel}</span>
        </div>
        `
            : ""
        }
        `
            : ""
        }

        <!-- Articles -->
        <div class="separator"></div>
        <div class="section-title">ARTICLES</div>
        
        <div class="items-table">
          <div class="items-header">
            <div style="display: flex; justify-content: space-between;">
              <span style="width: 40%;">ARTICLE</span>
              <span style="width: 15%; text-align: center;">QTE</span>
              <span style="width: 20%; text-align: right;">P.U.</span>
              <span style="width: 25%; text-align: right;">TOTAL</span>
            </div>
          </div>
          
          ${
            lignes
              ?.map((ligne) => {
                const sousTotal =
                  parseFloat(ligne.puart || 0) * parseInt(ligne.qte || 0);
                return `
            <div class="item-line">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <span style="width: 40%;">
                  <div class="item-code">${ligne.codeart || ""}</div>
                  <div class="item-desc">${ligne.libart || ""}</div>
                </span>
                <span style="width: 15%; text-align: center;">${
                  ligne.qte || 0
                }</span>
                <span style="width: 20%; text-align: right;">${parseFloat(
                  ligne.puart || 0
                ).toFixed(2)}</span>
                <span style="width: 25%; text-align: right;">${sousTotal.toFixed(
                  2
                )}</span>
              </div>
            </div>
            `;
              })
              .join("") || '<div class="item-line">Aucun article</div>'
          }
        </div>

        <!-- Totaux -->
        <div class="totals">
          <div class="total-line">
            <span>Nombre d'articles:</span>
            <span>${totalQuantite}</span>
          </div>
          
          ${
            entete.mht
              ? `
          <div class="total-line">
            <span>Sous-total HT:</span>
            <span>${parseFloat(entete.mht).toFixed(2)} DT</span>
          </div>
          `
              : ""
          }
          
          ${
            entete.remise && parseFloat(entete.remise) > 0
              ? `
          <div class="total-line">
            <span>Remise:</span>
            <span>-${parseFloat(entete.remise).toFixed(2)} DT</span>
          </div>
          `
              : ""
          }
          
          ${
            entete.mtva
              ? `
          <div class="total-line">
            <span>TVA:</span>
            <span>${parseFloat(entete.mtva).toFixed(2)} DT</span>
          </div>
          `
              : ""
          }
          
          ${
            entete.mfodec && parseFloat(entete.mfodec) > 0
              ? `
          <div class="total-line">
            <span>FODEC:</span>
            <span>${parseFloat(entete.mfodec).toFixed(2)} DT</span>
          </div>
          `
              : ""
          }
          
          <div class="total-line total-final">
            <span>TOTAL TTC:</span>
            <span>${parseFloat(entete.mttc || entete.mht || 0).toFixed(
              2
            )} DT</span>
          </div>
        </div>

        <!-- Pied de page -->
        <div class="footer">
          <div>Merci de votre commande!</div>
          <div style="margin-top: 3px; font-size: 8px;">
            Ticket imprimé le ${currentDate}
          </div>
          ${
            entete.commentaire
              ? `
          <div style="margin-top: 5px; font-size: 9px;">
            Note: ${entete.commentaire}
          </div>
          `
              : ""
          }
        </div>
      </body>
      </html>
    `;
  };

  return { printTicket };
};

export default useTicketPrint;
