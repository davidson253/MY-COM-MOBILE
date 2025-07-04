import db from "./db.js";

const Commande = {
  getAll: async () => {
    // Récupère toutes les commandes avec le client
    const [rows] = await db.query(
      `SELECT ebcw.*, client.rsoc 
       FROM ebcw 
       LEFT JOIN client ON ebcw.ccl = client.code
       ORDER BY ebcw.numbc DESC`
    );
    return rows;
  },

  // Nouvelle méthode : Récupérer toutes les commandes d'un représentant
  getByRepresentant: async (representantCode) => {
    const [rows] = await db.query(
      `SELECT ebcw.*, client.rsoc, representant.code as coderep, representant.libelle as librep
       FROM ebcw 
       LEFT JOIN client ON ebcw.ccl = client.code
       LEFT JOIN representant ON client.coderep = representant.code
       WHERE client.coderep = ?
       ORDER BY ebcw.numbc DESC`,
      [representantCode]
    );
    return rows;
  },

  getById: async (numbc) => {
    // Récupère l'entête + lignes de commande
    const [[entete]] = await db.query(
      `SELECT ebcw.*, client.rsoc 
       FROM ebcw 
       LEFT JOIN client ON ebcw.ccl = client.code
       WHERE ebcw.numbc = ?`,
      [numbc]
    );
    const [lignes] = await db.query(`SELECT * FROM lbcw WHERE numbc = ?`, [
      numbc,
    ]);
    return { entete, lignes };
  },

  // Nouvelle méthode : Récupérer une commande spécifique d'un représentant
  getByIdAndRepresentant: async (numbc, representantCode) => {
    const [[entete]] = await db.query(
      `SELECT ebcw.*, client.rsoc, representant.code as coderep, representant.libelle as librep
       FROM ebcw 
       LEFT JOIN client ON ebcw.ccl = client.code
       LEFT JOIN representant ON client.coderep = representant.code
       WHERE ebcw.numbc = ? AND client.coderep = ?`,
      [numbc, representantCode]
    );
    const [lignes] = await db.query(`SELECT * FROM lbcw WHERE numbc = ?`, [
      numbc,
    ]);
    return { entete, lignes };
  },
  create: async (data) => {
    const {
      ccl,
      datebc,
      lignes,
      // Nouveaux champs métiers
      matricule, // Matricule fiscal
      mht, // Montant HT
      mttc, // Montant TTC
      mtva, // Montant TVA
      remise, // Remise
      commentaire, // Observations
      modepaiement, // Mode de paiement
      coderep, // Code représentant (automatique)
      librep, // Libellé représentant
    } = data;

    // Création entête avec tous les champs
    const [result] = await db.query(
      `INSERT INTO ebcw (
        ccl, datebc, matricule, mht, mttc, mtva, remise, 
        commentaire, modepaiement, coderep, librep
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        ccl,
        datebc,
        matricule,
        mht || 0,
        mttc || 0,
        mtva || 0,
        remise || 0,
        commentaire,
        modepaiement,
        coderep,
        librep,
      ]
    );
    const numbc = result.insertId;

    // Création lignes
    if (Array.isArray(lignes) && lignes.length > 0) {
      for (const ligne of lignes) {
        const { codeart, libart, famille, puart, qte } = ligne;
        await db.query(
          "INSERT INTO lbcw (numbc, datebc, codeart, libart, famille, puart, qte) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [
            numbc,
            datebc,
            codeart,
            libart,
            famille,
            parseFloat(puart),
            parseInt(qte),
          ]
        );
      }
    }
    return { numbc };
  },
  update: async (numbc, data) => {
    const {
      ccl,
      datebc,
      lignes,
      // Nouveaux champs métiers
      matricule, // Matricule fiscal
      mht, // Montant HT
      mttc, // Montant TTC
      mtva, // Montant TVA
      remise, // Remise
      commentaire, // Observations
      modepaiement, // Mode de paiement
    } = data;

    // Mise à jour entête avec tous les champs
    await db.query(
      `UPDATE ebcw SET 
        ccl=?, datebc=?, matricule=?, mht=?, mttc=?, mtva=?, 
        remise=?, commentaire=?, modepaiement=? 
       WHERE numbc=?`,
      [
        ccl,
        datebc,
        matricule,
        mht || 0,
        mttc || 0,
        mtva || 0,
        remise || 0,
        commentaire,
        modepaiement,
        numbc,
      ]
    );

    // Suppression et recréation des lignes
    await db.query("DELETE FROM lbcw WHERE numbc = ?", [numbc]);
    if (Array.isArray(lignes) && lignes.length > 0) {
      for (const ligne of lignes) {
        const { codeart, libart, famille, puart, qte } = ligne;
        await db.query(
          "INSERT INTO lbcw (numbc, datebc, codeart, libart, famille, puart, qte) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [
            numbc,
            datebc,
            codeart,
            libart,
            famille,
            parseFloat(puart),
            parseInt(qte),
          ]
        );
      }
    }
    return { numbc };
  },
  delete: async (numbc) => {
    await db.query("DELETE FROM lbcw WHERE numbc = ?", [numbc]);
    const [result] = await db.query("DELETE FROM ebcw WHERE numbc = ?", [
      numbc,
    ]);
    return result;
  },

  // Soft delete - met à jour users/libusers/datem au lieu de supprimer
  softDelete: async (numbc, representantCode, userCode, userLibelle) => {
    const now = new Date();
    if (representantCode) {
      // Vérifier que la commande appartient au représentant avant suppression
      const [result] = await db.query(
        `UPDATE ebcw 
         SET users = ?, libusers = ?, datem = ? 
         WHERE numbc = ? 
         AND EXISTS (SELECT 1 FROM client WHERE client.code = ebcw.ccl AND client.coderep = ?)
         AND (users IS NULL OR users = '')`,
        [userCode, userLibelle, now, numbc, representantCode]
      );
      return result;
    }
    const [result] = await db.query(
      "UPDATE ebcw SET users = ?, libusers = ?, datem = ? WHERE numbc = ? AND (users IS NULL OR users = '')",
      [userCode, userLibelle, now, numbc]
    );
    return result;
  },

  // Restauration d'une commande supprimée
  restore: async (numbc, representantCode, userCode, userLibelle) => {
    const now = new Date();
    if (representantCode) {
      const [result] = await db.query(
        `UPDATE ebcw 
         SET users = NULL, libusers = NULL, userm = ?, libuserm = ?, datem = ? 
         WHERE numbc = ? 
         AND EXISTS (SELECT 1 FROM client WHERE client.code = ebcw.ccl AND client.coderep = ?)
         AND users IS NOT NULL`,
        [userCode, userLibelle, now, numbc, representantCode]
      );
      return result;
    }
    const [result] = await db.query(
      "UPDATE ebcw SET users = NULL, libusers = NULL, userm = ?, libuserm = ?, datem = ? WHERE numbc = ? AND users IS NOT NULL",
      [userCode, userLibelle, now, numbc]
    );
    return result;
  },
};

export default Commande;
