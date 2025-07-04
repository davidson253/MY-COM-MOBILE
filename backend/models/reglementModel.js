import db from "./db.js";

const Reglement = {
  getAll: async () => {
    const [rows] = await db.query(
      `SELECT reglementw.*, client.rsoc 
       FROM reglementw 
       LEFT JOIN client ON reglementw.codecli = client.code
       ORDER BY reglementw.datereg DESC, reglementw.numreg DESC`
    );
    return rows;
  },

  // Nouvelle méthode : Récupérer tous les règlements d'un représentant
  getByRepresentant: async (representantCode) => {
    const [rows] = await db.query(
      `SELECT reglementw.*, client.rsoc, representant.code as coderep, representant.libelle as librep
       FROM reglementw 
       LEFT JOIN client ON reglementw.codecli = client.code
       LEFT JOIN representant ON client.coderep = representant.code
       WHERE client.coderep = ?
       ORDER BY reglementw.datereg DESC, reglementw.numreg DESC`,
      [representantCode]
    );
    return rows;
  },

  getById: async (numreg) => {
    const [[reglement]] = await db.query(
      `SELECT reglementw.*, client.rsoc, client.adresse, client.tel
       FROM reglementw 
       LEFT JOIN client ON reglementw.codecli = client.code
       WHERE reglementw.numreg = ?`,
      [numreg]
    );
    return reglement;
  },

  // Nouvelle méthode : Récupérer un règlement spécifique d'un représentant
  getByIdAndRepresentant: async (numreg, representantCode) => {
    const [[reglement]] = await db.query(
      `SELECT reglementw.*, client.rsoc, client.adresse, client.tel, representant.code as coderep, representant.libelle as librep
       FROM reglementw 
       LEFT JOIN client ON reglementw.codecli = client.code
       LEFT JOIN representant ON client.coderep = representant.code
       WHERE reglementw.numreg = ? AND client.coderep = ?`,
      [numreg, representantCode]
    );
    return reglement;
  },

  getByClient: async (codecli) => {
    const [rows] = await db.query(
      `SELECT * FROM reglementw WHERE codecli = ? ORDER BY datereg DESC`,
      [codecli]
    );
    return rows;
  },

  // Nouvelle méthode : Récupérer les règlements d'un client d'un représentant
  getByClientAndRepresentant: async (codecli, representantCode) => {
    const [rows] = await db.query(
      `SELECT reglementw.* 
       FROM reglementw 
       LEFT JOIN client ON reglementw.codecli = client.code
       WHERE reglementw.codecli = ? AND client.coderep = ?
       ORDER BY reglementw.datereg DESC`,
      [codecli, representantCode]
    );
    return rows;
  },

  create: async (data) => {
    const {
      typereg,
      datereg,
      description,
      numfact,
      mtfact,
      codecli,
      rscli,
      mtreg,
      numcheff,
      dateech,
      signataire,
      banque,
      ville,
      codebanq,
      numbord,
      numpaiement,
      devise,
      taux,
      fraisb,
      typepiece,
      recu,
      // Champs de traçabilité
      usera,
      libusera,
    } = data;

    const [result] = await db.query(
      `INSERT INTO reglementw 
       (typereg, datereg, description, numfact, mtfact, codecli, rscli, mtreg,
        numcheff, dateech, signataire, banque, ville, codebanq, numbord, 
        numpaiement, devise, taux, fraisb, typepiece, recu, rap, imp, vers, enc,
        usera, libusera)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '0', '0', '0', '0', ?, ?)`,
      [
        typereg,
        datereg,
        description,
        numfact || null,
        mtfact || 0,
        codecli,
        rscli,
        mtreg,
        numcheff || null,
        dateech || null,
        signataire || null,
        banque || null,
        ville || null,
        codebanq || null,
        numbord || null,
        numpaiement || null,
        devise || "TND",
        taux || 1,
        fraisb || 0,
        typepiece || null,
        recu || null,
        usera || null,
        libusera || null,
      ]
    );
    return { numreg: result.insertId };
  },

  update: async (numreg, data) => {
    const {
      typereg,
      datereg,
      description,
      numfact,
      mtfact,
      codecli,
      rscli,
      mtreg,
      numcheff,
      dateech,
      signataire,
      banque,
      ville,
      codebanq,
      numbord,
      numpaiement,
      devise,
      taux,
      // Champs de traçabilité
      userm,
      libuserm,
      datem,
      users,
      libusers,
    } = data;

    // Construire la requête dynamiquement selon les champs fournis
    const fields = [];
    const values = [];

    // Champs de base
    if (typereg !== undefined) {
      fields.push("typereg=?");
      values.push(typereg);
    }
    if (datereg !== undefined) {
      fields.push("datereg=?");
      values.push(datereg);
    }
    if (description !== undefined) {
      fields.push("description=?");
      values.push(description);
    }
    if (numfact !== undefined) {
      fields.push("numfact=?");
      values.push(numfact);
    }
    if (mtfact !== undefined) {
      fields.push("mtfact=?");
      values.push(mtfact);
    }
    if (codecli !== undefined) {
      fields.push("codecli=?");
      values.push(codecli);
    }
    if (rscli !== undefined) {
      fields.push("rscli=?");
      values.push(rscli);
    }
    if (mtreg !== undefined) {
      fields.push("mtreg=?");
      values.push(mtreg);
    }
    if (numcheff !== undefined) {
      fields.push("numcheff=?");
      values.push(numcheff);
    }
    if (dateech !== undefined) {
      fields.push("dateech=?");
      values.push(dateech);
    }
    if (signataire !== undefined) {
      fields.push("signataire=?");
      values.push(signataire);
    }
    if (banque !== undefined) {
      fields.push("banque=?");
      values.push(banque);
    }
    if (ville !== undefined) {
      fields.push("ville=?");
      values.push(ville);
    }
    if (codebanq !== undefined) {
      fields.push("codebanq=?");
      values.push(codebanq);
    }
    if (numbord !== undefined) {
      fields.push("numbord=?");
      values.push(numbord);
    }
    if (numpaiement !== undefined) {
      fields.push("numpaiement=?");
      values.push(numpaiement);
    }
    if (devise !== undefined) {
      fields.push("devise=?");
      values.push(devise);
    }
    if (taux !== undefined) {
      fields.push("taux=?");
      values.push(taux);
    }

    // Champs de statuts
    if (data.enc !== undefined) {
      fields.push("enc=?");
      values.push(data.enc);
    }
    if (data.rap !== undefined) {
      fields.push("rap=?");
      values.push(data.rap);
    }
    if (data.vers !== undefined) {
      fields.push("vers=?");
      values.push(data.vers);
    }
    if (data.integ !== undefined) {
      fields.push("integ=?");
      values.push(data.integ);
    }
    if (data.imp !== undefined) {
      fields.push("imp=?");
      values.push(data.imp);
    }
    if (data.fraisb !== undefined) {
      fields.push("fraisb=?");
      values.push(data.fraisb);
    }

    // Champs de traçabilité
    if (userm !== undefined) {
      fields.push("userm=?");
      values.push(userm);
    }
    if (libuserm !== undefined) {
      fields.push("libuserm=?");
      values.push(libuserm);
    }
    if (datem !== undefined) {
      fields.push("datem=?");
      values.push(datem);
    }
    if (users !== undefined) {
      fields.push("users=?");
      values.push(users);
    }
    if (libusers !== undefined) {
      fields.push("libusers=?");
      values.push(libusers);
    }

    // Ajouter l'ID à la fin
    values.push(numreg);

    const query = `UPDATE reglementw SET ${fields.join(", ")} WHERE numreg=?`;

    await db.query(query, values);
    return { numreg };
  },

  delete: async (numreg) => {
    const [result] = await db.query("DELETE FROM reglementw WHERE numreg = ?", [
      numreg,
    ]);
    return result;
  },

  // Statistiques et rapports
  getStatsByPeriod: async (dateDebut, dateFin) => {
    const [rows] = await db.query(
      `SELECT typereg, COUNT(*) as nombre, SUM(mtreg) as total
       FROM reglementw 
       WHERE datereg BETWEEN ? AND ?
       GROUP BY typereg`,
      [dateDebut, dateFin]
    );
    return rows;
  },
};

export default Reglement;
