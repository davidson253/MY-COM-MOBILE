import { useCallback } from "react";
import api from "../services/api";

const useBandeCommande = () => {
  const printBandeCommande = useCallback(async (commandeData) => {
    try {
      // Récupérer les détails complets de la commande avec les lignes
      const commande = await api.getCommande(commandeData.numbc);

      // Créer le contenu HTML de la bande de commande
      const bandeHTML = generateBandeHTML(commande);

      // Ouvrir une nouvelle fenêtre pour l'impression
      const printWindow = window.open(
        "",
        "_blank",
        "width=1000,height=400,scrollbars=yes,resizable=yes"
      );
      printWindow.document.write(bandeHTML);
      printWindow.document.close();

      // Attendre que le contenu soit chargé puis imprimer
      printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
      };
    } catch (error) {
      console.error("Erreur lors de l'impression de la bande:", error);
      alert("Erreur lors de l'impression de la bande de commande");
    }
  }, []);

  const generateBandeHTML = (commande) => {
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
        <title>Bande Commande ${entete.numbc}</title>
        <style>
          @page {
            size: A4 landscape;
            margin: 8mm;
          }
          @media print {
            body { 
              width: 100%;
              margin: 0;
              padding: 0;
              font-family: 'Arial', sans-serif;
              max-width: 277mm;
            }
            .totals-section, .totals-box {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            .footer-section {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
          }
          body {
            width: 100%;
            max-width: 277mm;
            margin: 0;
            padding: 8mm;
            font-family: 'Arial', sans-serif;
            font-size: 10px;
            line-height: 1.2;
            color: #000;
            background: white;
            box-sizing: border-box;
          }
          .bande-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 3px solid #000;
            padding-bottom: 10px;
            margin-bottom: 15px;
          }
          .company-section {
            flex: 1;
          }
          .company-name {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 3px;
          }
          .company-info {
            font-size: 10px;
            color: #666;
          }
          .commande-section {
            flex: 1;
            text-align: center;
          }
          .commande-title {
            font-size: 24px;
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
          }
          .commande-number {
            font-size: 20px;
            font-weight: bold;
            color: #0066cc;
          }
          .date-section {
            flex: 1;
            text-align: right;
          }
          .date-info {
            font-size: 11px;
            margin-bottom: 2px;
          }
          .main-content {
            display: flex;
            gap: 15px;
            margin-bottom: 15px;
          }
          .left-column {
            flex: 1;
            max-width: 48%;
          }
          .right-column {
            flex: 1;
            max-width: 48%;
          }
          .info-section {
            background: #f8f9fa;
            border: 1px solid #ddd;
            border-radius: 3px;
            padding: 8px;
            margin-bottom: 10px;
          }
          .section-title {
            font-weight: bold;
            font-size: 11px;
            color: #333;
            margin-bottom: 6px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 2px;
          }
          .info-row {
            display: flex;
            margin-bottom: 3px;
            font-size: 9px;
          }
          .info-label {
            font-weight: bold;
            width: 110px;
            color: #555;
            flex-shrink: 0;
          }
          .info-value {
            flex: 1;
            color: #000;
            word-break: break-word;
          }
          .articles-section {
            width: 100%;
            margin: 15px 0;
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .articles-table {
            width: 100%;
            border-collapse: collapse;
            border: 2px solid #333;
            page-break-inside: auto;
            font-size: 9px;
          }
          .articles-table th {
            background: #333;
            color: white;
            padding: 6px 4px;
            text-align: left;
            font-weight: bold;
            font-size: 9px;
          }
          .articles-table td {
            padding: 4px;
            border-bottom: 1px solid #ddd;
            vertical-align: top;
            font-size: 9px;
          }
          .articles-table tr:nth-child(even) {
            background: #f9f9f9;
          }
          .article-code {
            font-weight: bold;
            color: #0066cc;
          }
          .article-desc {
            font-size: 10px;
            color: #666;
            margin-top: 2px;
          }
          .totals-section {
            display: flex;
            justify-content: flex-end;
            margin-top: 15px;
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .totals-box {
            background: #f0f8ff;
            border: 2px solid #0066cc;
            border-radius: 5px;
            padding: 10px;
            min-width: 250px;
            max-width: 300px;
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            padding: 2px 0;
          }
          .total-label {
            font-weight: bold;
            color: #333;
          }
          .total-value {
            font-weight: bold;
            color: #0066cc;
          }
          .total-final {
            border-top: 2px solid #0066cc;
            margin-top: 10px;
            padding-top: 8px;
            font-size: 14px;
          }
          .footer-section {
            margin-top: 20px;
            border-top: 2px solid #333;
            padding-top: 10px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            page-break-inside: avoid;
            break-inside: avoid;
            font-size: 9px;
          }
          .footer-left {
            flex: 1;
            max-width: 60%;
          }
          .footer-right {
            flex: 1;
            max-width: 35%;
            text-align: right;
          }
          .signature-box {
            border: 1px solid #ccc;
            padding: 15px;
            text-align: center;
            background: #fafafa;
            margin-top: 8px;
            font-size: 8px;
          }
          .urgent-badge {
            background: #ff4444;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: bold;
          }
          .status-badge {
            background: #28a745;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <!-- En-tête de la bande -->
        <div class="bande-header">
          <div class="company-section">
            <div class="company-name">NOTRE ENTREPRISE</div>
            <div class="company-info">Service Commercial & Livraison</div>
            <div class="company-info">Tél: +216 74 XXX XXX</div>
            ${
              entete.matricule
                ? `<div class="company-info">MF: ${entete.matricule}</div>`
                : ""
            }
          </div>
          
          <div class="commande-section">
            <div class="commande-title">BANDE DE COMMANDE</div>
            <div class="commande-number">N° ${entete.numbc}</div>
            ${
              entete.commentaire &&
              entete.commentaire.toLowerCase().includes("urgent")
                ? '<div style="margin-top: 5px;"><span class="urgent-badge">URGENT</span></div>'
                : '<div style="margin-top: 5px;"><span class="status-badge">NORMAL</span></div>'
            }
          </div>
          
          <div class="date-section">
            <div class="date-info"><strong>Date commande:</strong> ${
              entete.datebc
                ? new Date(entete.datebc).toLocaleDateString("fr-FR")
                : ""
            }</div>
            <div class="date-info"><strong>Heure impression:</strong> ${
              currentDate.split(" ")[1]
            }</div>
            <div class="date-info"><strong>Imprimé le:</strong> ${
              currentDate.split(" ")[0]
            }</div>
            ${
              entete.perdliv
                ? `<div class="date-info"><strong>Livraison:</strong> ${entete.perdliv}</div>`
                : ""
            }
          </div>
        </div>

        <!-- Contenu principal -->
        <div class="main-content">
          <!-- Colonne gauche - Client et représentant -->
          <div class="left-column">
            <!-- Informations client -->
            <div class="info-section">
              <div class="section-title">INFORMATIONS CLIENT</div>
              ${
                entete.rsocf
                  ? `
                <div class="info-row">
                  <span class="info-label">Raison sociale:</span>
                  <span class="info-value">${entete.rsocf}</span>
                </div>
              `
                  : ""
              }
              ${
                entete.ccl
                  ? `
                <div class="info-row">
                  <span class="info-label">Code client:</span>
                  <span class="info-value">${entete.ccl}</span>
                </div>
              `
                  : ""
              }
              ${
                entete.adresf
                  ? `
                <div class="info-row">
                  <span class="info-label">Adresse:</span>
                  <span class="info-value">${entete.adresf}</span>
                </div>
              `
                  : ""
              }
              ${
                entete.tel
                  ? `
                <div class="info-row">
                  <span class="info-label">Téléphone:</span>
                  <span class="info-value">${entete.tel}</span>
                </div>
              `
                  : ""
              }
              ${
                entete.fax
                  ? `
                <div class="info-row">
                  <span class="info-label">Fax:</span>
                  <span class="info-value">${entete.fax}</span>
                </div>
              `
                  : ""
              }
            </div>

            <!-- Informations représentant -->
            <div class="info-section">
              <div class="section-title">REPRÉSENTANT & LIVRAISON</div>
              ${
                entete.coderep
                  ? `
                <div class="info-row">
                  <span class="info-label">Code représentant:</span>
                  <span class="info-value">${entete.coderep}</span>
                </div>
              `
                  : ""
              }
              ${
                entete.librep
                  ? `
                <div class="info-row">
                  <span class="info-label">Nom représentant:</span>
                  <span class="info-value">${entete.librep}</span>
                </div>
              `
                  : ""
              }
              ${
                entete.codechauf
                  ? `
                <div class="info-row">
                  <span class="info-label">Chauffeur:</span>
                  <span class="info-value">${
                    entete.libchauf || entete.codechauf
                  }</span>
                </div>
              `
                  : ""
              }
              ${
                entete.codeveh
                  ? `
                <div class="info-row">
                  <span class="info-label">Véhicule:</span>
                  <span class="info-value">${
                    entete.libveh || entete.codeveh
                  }</span>
                </div>
              `
                  : ""
              }
              ${
                entete.elaborer
                  ? `
                <div class="info-row">
                  <span class="info-label">Élaboré par:</span>
                  <span class="info-value">${entete.elaborer}</span>
                </div>
              `
                  : ""
              }
            </div>
          </div>

          <!-- Colonne droite - Facturation et paiement -->
          <div class="right-column">
            <!-- Informations facture -->
            <div class="info-section">
              <div class="section-title">FACTURATION</div>
              ${
                entete.numfactf
                  ? `
                <div class="info-row">
                  <span class="info-label">N° Facture:</span>
                  <span class="info-value">${entete.numfactf}</span>
                </div>
              `
                  : ""
              }
              ${
                entete.facture
                  ? `
                <div class="info-row">
                  <span class="info-label">Facture:</span>
                  <span class="info-value">${entete.facture}</span>
                </div>
              `
                  : ""
              }
              ${
                entete.devise
                  ? `
                <div class="info-row">
                  <span class="info-label">Devise:</span>
                  <span class="info-value">${entete.devise}</span>
                </div>
              `
                  : ""
              }
              ${
                entete.regime
                  ? `
                <div class="info-row">
                  <span class="info-label">Régime:</span>
                  <span class="info-value">${entete.regime}</span>
                </div>
              `
                  : ""
              }
            </div>

            <!-- Informations paiement -->
            <div class="info-section">
              <div class="section-title">PAIEMENT</div>
              ${
                entete.modepaiement
                  ? `
                <div class="info-row">
                  <span class="info-label">Mode paiement:</span>
                  <span class="info-value">${entete.modepaiement}</span>
                </div>
              `
                  : ""
              }
              ${
                entete.accompte
                  ? `
                <div class="info-row">
                  <span class="info-label">Accompte:</span>
                  <span class="info-value">${entete.accompte}</span>
                </div>
              `
                  : ""
              }
              ${
                entete.mpayer
                  ? `
                <div class="info-row">
                  <span class="info-label">Montant à payer:</span>
                  <span class="info-value">${parseFloat(entete.mpayer).toFixed(
                    2
                  )} DT</span>
                </div>
              `
                  : ""
              }
              ${
                entete.dateblp
                  ? `
                <div class="info-row">
                  <span class="info-label">Date BLP:</span>
                  <span class="info-value">${new Date(
                    entete.dateblp
                  ).toLocaleDateString("fr-FR")}</span>
                </div>
              `
                  : ""
              }
            </div>
          </div>
        </div>

        <!-- Section articles -->
        <div class="articles-section">
          <div class="section-title" style="margin-bottom: 10px;">ARTICLES COMMANDÉS</div>
          <table class="articles-table">
            <thead>
              <tr>
                <th style="width: 12%;">CODE</th>
                <th style="width: 30%;">DÉSIGNATION</th>
                <th style="width: 8%; text-align: center;">QTÉ</th>
                <th style="width: 8%; text-align: center;">UNITÉ</th>
                <th style="width: 12%; text-align: right;">P.U. HT</th>
                <th style="width: 8%; text-align: center;">TVA %</th>
                <th style="width: 12%; text-align: right;">TOTAL HT</th>
                <th style="width: 10%; text-align: center;">STATUT</th>
              </tr>
            </thead>
            <tbody>
              ${
                lignes
                  ?.map((ligne, index) => {
                    const sousTotal =
                      parseFloat(ligne.puart || 0) * parseInt(ligne.qte || 0);
                    return `
                  <tr>
                    <td style="font-weight: bold; color: #0066cc;">
                      ${ligne.codeart || ""}
                    </td>
                    <td>
                      <div style="font-weight: bold; font-size: 9px;">${
                        ligne.libart || ""
                      }</div>
                      ${
                        ligne.famille
                          ? `<div style="font-size: 8px; color: #666;">Fam: ${ligne.famille}</div>`
                          : ""
                      }
                    </td>
                    <td style="text-align: center; font-weight: bold;">
                      ${ligne.qte || 0}
                    </td>
                    <td style="text-align: center;">
                      ${ligne.unite || ""}
                    </td>
                    <td style="text-align: right;">
                      ${parseFloat(ligne.puart || 0).toFixed(2)}
                    </td>
                    <td style="text-align: center;">
                      ${ligne.tva || 0}%
                    </td>
                    <td style="text-align: right; font-weight: bold;">
                      ${sousTotal.toFixed(2)}
                    </td>
                    <td style="text-align: center; font-size: 8px;">
                      <span style="background: #28a745; color: white; padding: 1px 3px; border-radius: 2px;">OK</span>
                    </td>
                  </tr>
                `;
                  })
                  .join("") ||
                '<tr><td colspan="8" style="text-align: center; font-style: italic;">Aucun article dans cette commande</td></tr>'
              }
            </tbody>
          </table>
        </div>

        <!-- Section totaux -->
        <div class="totals-section">
          <div class="totals-box">
            <div class="total-row">
              <span class="total-label">Nombre total d'articles:</span>
              <span class="total-value">${totalQuantite}</span>
            </div>
            
            ${
              entete.mht
                ? `
              <div class="total-row">
                <span class="total-label">Sous-total HT:</span>
                <span class="total-value">${parseFloat(entete.mht).toFixed(
                  2
                )} DT</span>
              </div>
            `
                : ""
            }
            
            ${
              entete.remise && parseFloat(entete.remise) > 0
                ? `
              <div class="total-row">
                <span class="total-label">Remise accordée:</span>
                <span class="total-value" style="color: #dc3545;">-${parseFloat(
                  entete.remise
                ).toFixed(2)} DT</span>
              </div>
            `
                : ""
            }
            
            ${
              entete.mtva
                ? `
              <div class="total-row">
                <span class="total-label">Montant TVA:</span>
                <span class="total-value">${parseFloat(entete.mtva).toFixed(
                  2
                )} DT</span>
              </div>
            `
                : ""
            }
            
            ${
              entete.mfodec && parseFloat(entete.mfodec) > 0
                ? `
              <div class="total-row">
                <span class="total-label">FODEC:</span>
                <span class="total-value">${parseFloat(entete.mfodec).toFixed(
                  2
                )} DT</span>
              </div>
            `
                : ""
            }
            
            <div class="total-row total-final">
              <span class="total-label">TOTAL TTC:</span>
              <span class="total-value" style="font-size: 16px;">${parseFloat(
                entete.mttc || entete.mht || 0
              ).toFixed(2)} DT</span>
            </div>

            ${
              entete.mt_lettre
                ? `
              <div style="margin-top: 10px; font-style: italic; font-size: 10px; text-align: center; color: #666;">
                ${entete.mt_lettre}
              </div>
            `
                : ""
            }
          </div>
        </div>

        <!-- Pied de page -->
        <div class="footer-section">
          <div class="footer-left">
            ${
              entete.commentaire
                ? `
              <div style="margin-bottom: 8px;">
                <strong>Commentaire:</strong> ${entete.commentaire}
              </div>
            `
                : ""
            }
            ${
              entete.description
                ? `
              <div style="margin-bottom: 8px;">
                <strong>Description:</strong> ${entete.description}
              </div>
            `
                : ""
            }
            ${
              entete.commentaire3
                ? `
              <div style="margin-bottom: 8px;">
                <strong>Note:</strong> ${entete.commentaire3}
              </div>
            `
                : ""
            }
            <div style="font-size: 10px; color: #666;">
              Bande de commande générée le ${currentDate}
            </div>
          </div>
          
          <div class="footer-right">
            <div class="signature-box">
              <div style="margin-bottom: 40px; font-weight: bold;">SIGNATURE DU RESPONSABLE</div>
              <div style="border-top: 1px solid #666; padding-top: 5px; font-size: 10px;">
                Date: ____/____/______
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  return { printBandeCommande };
};

export default useBandeCommande;
