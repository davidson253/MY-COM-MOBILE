import db from "./db.js";

const Facture = {
  /**
   * Récupérer toutes les factures (commandes facturées)
   */
  getAll: async () => {
    const [rows] = await db.query(
      `SELECT ebcw.numbc as numfact, ebcw.datebc as datefact, ebcw.ccl, 
              ebcw.matricule, ebcw.mht, ebcw.mttc, ebcw.mtva, 
              ebcw.commentaire, ebcw.modepaiement, 
              ebcw.coderep, ebcw.librep,
              client.rsoc, client.mf as mf_client, client.adresse
       FROM ebcw 
       LEFT JOIN client ON ebcw.ccl = client.code
       WHERE ebcw.facture IS NOT NULL OR ebcw.numfactf IS NOT NULL
       ORDER BY ebcw.numbc DESC`
    );
    return rows;
  },

  /**
   * Récupérer toutes les factures d'un représentant
   */
  getByRepresentant: async (representantCode) => {
    const [rows] = await db.query(
      `SELECT ebcw.numbc as numfact, ebcw.datebc as datefact, ebcw.ccl, 
              ebcw.matricule, ebcw.mht, ebcw.mttc, ebcw.mtva, 
              ebcw.commentaire, ebcw.modepaiement, 
              ebcw.coderep, ebcw.librep,
              client.rsoc, client.mf as mf_client, client.adresse
       FROM ebcw 
       LEFT JOIN client ON ebcw.ccl = client.code
       WHERE client.coderep = ? 
         AND (ebcw.facture IS NOT NULL OR ebcw.numfactf IS NOT NULL)
       ORDER BY ebcw.numbc DESC`,
      [representantCode]
    );
    return rows;
  },

  /**
   * Récupérer une facture par son numéro
   */
  getById: async (numfact) => {
    // Récupère l'entête de facture + lignes
    const [[entete]] = await db.query(
      `SELECT ebcw.numbc as numfact, ebcw.datebc as datefact, ebcw.ccl, 
              ebcw.matricule, ebcw.mht, ebcw.mttc, ebcw.mtva, 
              ebcw.commentaire, ebcw.modepaiement, 
              ebcw.coderep, ebcw.librep, ebcw.numfactf,
              client.rsoc, client.mf as mf_client, client.adresse, 
              client.ville, client.tel, client.email
       FROM ebcw 
       LEFT JOIN client ON ebcw.ccl = client.code
       WHERE ebcw.numbc = ?`,
      [numfact]
    );

    // Récupère les lignes de la facture
    const [lignes] = await db.query(
      `SELECT lbcw.codeart, lbcw.libart, lbcw.famille, 
              lbcw.puart, lbcw.qte, lbcw.tva, lbcw.remise,
              (lbcw.puart * lbcw.qte) as montant_ligne
       FROM lbcw 
       WHERE lbcw.numbc = ?
       ORDER BY lbcw.nligne`,
      [numfact]
    );

    return { entete, lignes };
  },

  /**
   * Récupérer une facture spécifique d'un représentant
   */
  getByIdAndRepresentant: async (numfact, representantCode) => {
    const [[entete]] = await db.query(
      `SELECT ebcw.numbc as numfact, ebcw.datebc as datefact, ebcw.ccl, 
              ebcw.matricule, ebcw.mht, ebcw.mttc, ebcw.mtva, 
              ebcw.commentaire, ebcw.modepaiement, 
              ebcw.coderep, ebcw.librep, ebcw.numfactf,
              client.rsoc, client.mf as mf_client, client.adresse, 
              client.ville, client.tel, client.email
       FROM ebcw 
       LEFT JOIN client ON ebcw.ccl = client.code
       WHERE ebcw.numbc = ? AND client.coderep = ?`,
      [numfact, representantCode]
    );

    if (!entete) return null;

    const [lignes] = await db.query(
      `SELECT lbcw.codeart, lbcw.libart, lbcw.famille, 
              lbcw.puart, lbcw.qte, lbcw.tva, lbcw.remise,
              (lbcw.puart * lbcw.qte) as montant_ligne
       FROM lbcw 
       WHERE lbcw.numbc = ?
       ORDER BY lbcw.nligne`,
      [numfact]
    );

    return { entete, lignes };
  },

  /**
   * Transformer une commande en facture
   */
  createFromCommande: async (numbc, factureData) => {
    const { numfactf, datefact, typeFacture = "NORMALE" } = factureData;

    // Mettre à jour la commande pour indiquer qu'elle est facturée
    const [result] = await db.query(
      `UPDATE ebcw SET 
        numfactf = ?, 
        facture = ?, 
        typef = ?
       WHERE numbc = ?`,
      [numfactf || `FACT-${numbc}`, datefact || new Date(), typeFacture, numbc]
    );

    return { numfact: numbc, numfactf: numfactf || `FACT-${numbc}` };
  },

  /**
   * Récupérer les commandes non encore facturées pour un représentant
   */
  getCommandesNonFacturees: async (representantCode) => {
    const [rows] = await db.query(
      `SELECT ebcw.numbc, ebcw.datebc, ebcw.ccl, ebcw.mht, ebcw.mttc,
              client.rsoc
       FROM ebcw 
       LEFT JOIN client ON ebcw.ccl = client.code
       WHERE client.coderep = ? 
         AND (ebcw.facture IS NULL OR ebcw.facture = '')
         AND (ebcw.numfactf IS NULL OR ebcw.numfactf = '')
       ORDER BY ebcw.datebc DESC`,
      [representantCode]
    );
    return rows;
  },

  /**
   * Statistiques des factures pour un représentant
   */
  getStatsFactures: async (representantCode) => {
    const [[stats]] = await db.query(
      `SELECT 
        COUNT(*) as total_factures,
        COALESCE(SUM(ebcw.mht), 0) as total_ht,
        COALESCE(SUM(ebcw.mttc), 0) as total_ttc,
        COALESCE(AVG(ebcw.mttc), 0) as moyenne_facture
       FROM ebcw 
       LEFT JOIN client ON ebcw.ccl = client.code
       WHERE client.coderep = ? 
         AND (ebcw.facture IS NOT NULL OR ebcw.numfactf IS NOT NULL)`,
      [representantCode]
    );

    return stats;
  },

  /**
   * Marquer une facture comme payée (intégration avec règlements)
   */
  marquerPayee: async (numfact, montantPaye) => {
    const [result] = await db.query(
      `UPDATE ebcw SET mpayer = ? WHERE numbc = ?`,
      [montantPaye, numfact]
    );
    return result;
  },
};

export default Facture;
