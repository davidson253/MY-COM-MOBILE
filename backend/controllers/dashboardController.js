import db from "../models/db.js";

export const getDashboardStats = async (req, res) => {
  try {
    // Filtrage automatique par représentant connecté
    const representantCode = req.user?.code;
    if (!representantCode) {
      return res.status(401).json({ error: "Représentant non authentifié" });
    }

    // Stats clients
    const [[clientStats]] = await db.query(
      `SELECT 
        COUNT(*) as total_clients,
        COUNT(CASE WHEN scredit > 0 THEN 1 END) as clients_avec_credit
       FROM client 
       WHERE coderep = ?`,
      [representantCode]
    );

    // Stats commandes avec factures
    const [[commandeStats]] = await db.query(
      `SELECT 
        COUNT(*) as total_commandes,
        COALESCE(SUM(mht), 0) as ca_ht,
        COALESCE(SUM(mttc), 0) as ca_ttc,
        COUNT(CASE WHEN facture IS NOT NULL OR numfactf IS NOT NULL THEN 1 END) as commandes_facturees,
        COUNT(CASE WHEN facture IS NULL AND numfactf IS NULL THEN 1 END) as commandes_non_facturees
       FROM ebcw 
       LEFT JOIN client ON ebcw.ccl = client.code
       WHERE client.coderep = ?`,
      [representantCode]
    );

    // Stats règlements
    const [[reglementStats]] = await db.query(
      `SELECT 
        COUNT(*) as total_reglements,
        COALESCE(SUM(mtreg), 0) as total_encaisse
       FROM reglementw 
       WHERE codecli IN (SELECT code FROM client WHERE coderep = ?)`,
      [representantCode]
    );

    // Stats articles
    const [[articleStats]] = await db.query(
      `SELECT COUNT(*) as total_articles FROM article`
    );

    // Top 5 clients par CA
    const [topClients] = await db.query(
      `SELECT 
        client.code,
        client.rsoc,
        COALESCE(SUM(ebcw.mttc), 0) as ca_total
       FROM client 
       LEFT JOIN ebcw ON client.code = ebcw.ccl
       WHERE client.coderep = ?
       GROUP BY client.code, client.rsoc
       ORDER BY ca_total DESC
       LIMIT 5`,
      [representantCode]
    );

    // Activités récentes (commandes)
    const [activitesRecentes] = await db.query(
      `SELECT 
        ebcw.numbc,
        ebcw.datebc,
        ebcw.mttc,
        client.rsoc,
        CASE 
          WHEN ebcw.facture IS NOT NULL OR ebcw.numfactf IS NOT NULL THEN 'Facturée'
          ELSE 'En cours'
        END as statut
       FROM ebcw 
       LEFT JOIN client ON ebcw.ccl = client.code
       WHERE client.coderep = ?
       ORDER BY ebcw.datebc DESC
       LIMIT 10`,
      [representantCode]
    );

    // Calcul du taux de facturation
    const tauxFacturation =
      commandeStats.total_commandes > 0
        ? (commandeStats.commandes_facturees / commandeStats.total_commandes) *
          100
        : 0;

    res.json({
      stats: {
        clients: clientStats,
        commandes: {
          ...commandeStats,
          taux_facturation: tauxFacturation,
        },
        reglements: reglementStats,
        articles: articleStats,
      },
      topClients,
      activitesRecentes,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
