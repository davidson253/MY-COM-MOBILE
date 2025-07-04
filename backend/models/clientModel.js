import db from "./db.js";

const Client = {
  getAll: async (representantCode) => {
    if (representantCode) {
      const [rows] = await db.query("SELECT * FROM client WHERE coderep = ?", [
        representantCode,
      ]);
      return rows;
    }
    const [rows] = await db.query("SELECT * FROM client");
    return rows;
  },
  getById: async (code, representantCode) => {
    if (representantCode) {
      const [rows] = await db.query(
        "SELECT * FROM client WHERE code = ? AND coderep = ?",
        [code, representantCode]
      );
      return rows[0];
    }
    const [rows] = await db.query("SELECT * FROM client WHERE code = ?", [
      code,
    ]);
    return rows[0];
  },
  create: async (data) => {
    const {
      code,
      rsoc,
      adresse,
      ville,
      tel,
      email,
      mf,
      coderep,
      librep,
      CP,
      fax,
      banque,
      RIB,
      RC,
      scredit,
      remise,
      tel2,
      adressefact,
      message,
      // Contacts supplémentaires
      respercon1,
      percon1,
      telpercon1,
      emailpercon1,
      percon2,
      respercon2,
      telpercon2,
      emailpercon2,
      percon3,
      respercon3,
      telpercon3,
      emailpercon3,
      // Informations financières
      soldeinit,
      prix,
      mtreg,
      delaireg,
      srisque,
      tauxret,
      // Informations géographiques
      cville,
      // Informations bancaires supplémentaires
      adressebanque,
      numcompte,
      // Tarification
      codetarif,
      libtarif,
      // Secteur et région
      codesect,
      libsect,
      codereg,
      libreg,
      // Activité et qualité
      codeact,
      libact,
      codequal,
      libqual,
      // Groupement
      codegr,
      libgr,
      // Autres informations
      adressear,
      rsocar,
      libpost,
      comptec,
      decision,
      descl,
      // Informations administratives
      timbre,
      exo,
      regime,
      rap,
      export: isExport,
      susp,
      blocage,
      validation,
      prod,
      parunite,
      // Dates
      datedebut,
      datefin,
      datevalidation,
    } = data;

    const [result] = await db.query(
      `INSERT INTO client (
        code, rsoc, adresse, ville, tel, email, mf, coderep, librep, 
        CP, fax, banque, RIB, RC, scredit, remise, tel2, adressefact, message,
        respercon1, percon1, telpercon1, emailpercon1,
        percon2, respercon2, telpercon2, emailpercon2,
        percon3, respercon3, telpercon3, emailpercon3,
        soldeinit, prix, mtreg, delaireg, srisque, tauxret,
        cville, adressebanque, numcompte,
        codetarif, libtarif, codesect, libsect, codereg, libreg,
        codeact, libact, codequal, libqual, codegr, libgr,
        adressear, rsocar, libpost, comptec, decision, descl,
        timbre, exo, regime, rap, export, susp, blocage, validation, prod, parunite,
        datedebut, datefin, datevalidation, datecreation
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        code,
        rsoc,
        adresse,
        ville,
        tel,
        email,
        mf,
        coderep,
        librep,
        CP,
        fax,
        banque,
        RIB,
        RC,
        scredit || 0,
        remise || 0,
        tel2,
        adressefact,
        message,
        respercon1,
        percon1,
        telpercon1,
        emailpercon1,
        percon2,
        respercon2,
        telpercon2,
        emailpercon2,
        percon3,
        respercon3,
        telpercon3,
        emailpercon3,
        soldeinit || 0,
        prix,
        mtreg || 0,
        delaireg || 0,
        srisque || 0,
        tauxret || 0,
        cville,
        adressebanque,
        numcompte,
        codetarif,
        libtarif,
        codesect,
        libsect,
        codereg,
        libreg,
        codeact,
        libact,
        codequal,
        libqual,
        codegr,
        libgr,
        adressear,
        rsocar,
        libpost,
        comptec,
        decision,
        descl,
        timbre || "0",
        exo || "0",
        regime || "R",
        rap || "N",
        isExport || "0",
        susp || "0",
        blocage || "0",
        validation || "0",
        prod || "0",
        parunite || "0",
        datedebut,
        datefin,
        datevalidation,
      ]
    );
    return result;
  },
  update: async (code, data, representantCode) => {
    const {
      rsoc,
      adresse,
      ville,
      tel,
      email,
      mf,
      CP,
      fax,
      coderep,
      librep,
      banque,
      RIB,
      RC,
      scredit,
      remise,
      tel2,
      adressefact,
      message,
      // Contacts supplémentaires
      respercon1,
      percon1,
      telpercon1,
      emailpercon1,
      percon2,
      respercon2,
      telpercon2,
      emailpercon2,
      percon3,
      respercon3,
      telpercon3,
      emailpercon3,
      // Informations financières
      soldeinit,
      prix,
      mtreg,
      delaireg,
      srisque,
      tauxret,
      // Informations géographiques
      cville,
      // Informations bancaires supplémentaires
      adressebanque,
      numcompte,
      // Tarification
      codetarif,
      libtarif,
      // Secteur et région
      codesect,
      libsect,
      codereg,
      libreg,
      // Activité et qualité
      codeact,
      libact,
      codequal,
      libqual,
      // Groupement
      codegr,
      libgr,
      // Autres informations
      adressear,
      rsocar,
      libpost,
      comptec,
      decision,
      descl,
      // Informations administratives
      timbre,
      exo,
      regime,
      rap,
      export: isExport,
      susp,
      blocage,
      validation,
      prod,
      parunite,
      // Dates
      datedebut,
      datefin,
      datevalidation,
    } = data;

    const updateQuery = `UPDATE client SET 
      rsoc=?, adresse=?, ville=?, tel=?, email=?, mf=?, CP=?, fax=?, coderep=?, librep=?,
      banque=?, RIB=?, RC=?, scredit=?, remise=?, tel2=?, adressefact=?, message=?,
      respercon1=?, percon1=?, telpercon1=?, emailpercon1=?,
      percon2=?, respercon2=?, telpercon2=?, emailpercon2=?,
      percon3=?, respercon3=?, telpercon3=?, emailpercon3=?,
      soldeinit=?, prix=?, mtreg=?, delaireg=?, srisque=?, tauxret=?,
      cville=?, adressebanque=?, numcompte=?,
      codetarif=?, libtarif=?, codesect=?, libsect=?, codereg=?, libreg=?,
      codeact=?, libact=?, codequal=?, libqual=?, codegr=?, libgr=?,
      adressear=?, rsocar=?, libpost=?, comptec=?, decision=?, descl=?,
      timbre=?, exo=?, regime=?, rap=?, export=?, susp=?, blocage=?, validation=?, prod=?, parunite=?,
      datedebut=?, datefin=?, datevalidation=?
      WHERE code=?${representantCode ? " AND coderep=?" : ""}`;

    const updateValues = [
      rsoc,
      adresse,
      ville,
      tel,
      email,
      mf,
      CP,
      fax,
      coderep,
      librep,
      banque,
      RIB,
      RC,
      scredit || 0,
      remise || 0,
      tel2,
      adressefact,
      message,
      respercon1,
      percon1,
      telpercon1,
      emailpercon1,
      percon2,
      respercon2,
      telpercon2,
      emailpercon2,
      percon3,
      respercon3,
      telpercon3,
      emailpercon3,
      soldeinit || 0,
      prix,
      mtreg || 0,
      delaireg || 0,
      srisque || 0,
      tauxret || 0,
      cville,
      adressebanque,
      numcompte,
      codetarif,
      libtarif,
      codesect,
      libsect,
      codereg,
      libreg,
      codeact,
      libact,
      codequal,
      libqual,
      codegr,
      libgr,
      adressear,
      rsocar,
      libpost,
      comptec,
      decision,
      descl,
      timbre || "0",
      exo || "0",
      regime || "R",
      rap || "N",
      isExport || "0",
      susp || "0",
      blocage || "0",
      validation || "0",
      prod || "0",
      parunite || "0",
      datedebut,
      datefin,
      datevalidation,
      code,
    ];

    if (representantCode) {
      updateValues.push(representantCode);
    }

    const [result] = await db.query(updateQuery, updateValues);
    return result;
  },
  // Soft delete - met à jour users/libusers/datem au lieu de supprimer
  softDelete: async (code, representantCode, userCode, userLibelle) => {
    const now = new Date();
    if (representantCode) {
      const [result] = await db.query(
        "UPDATE client SET users = ?, libusers = ?, datem = ? WHERE code = ? AND coderep = ? AND (users IS NULL OR users = '')",
        [userCode, userLibelle, now, code, representantCode]
      );
      return result;
    }
    const [result] = await db.query(
      "UPDATE client SET users = ?, libusers = ?, datem = ? WHERE code = ? AND (users IS NULL OR users = '')",
      [userCode, userLibelle, now, code]
    );
    return result;
  },

  // Restauration d'un client supprimé
  restore: async (code, representantCode, userCode, userLibelle) => {
    const now = new Date();
    if (representantCode) {
      const [result] = await db.query(
        "UPDATE client SET users = NULL, libusers = NULL, userm = ?, libuserm = ?, datem = ? WHERE code = ? AND coderep = ? AND users IS NOT NULL",
        [userCode, userLibelle, now, code, representantCode]
      );
      return result;
    }
    const [result] = await db.query(
      "UPDATE client SET users = NULL, libusers = NULL, userm = ?, libuserm = ?, datem = ? WHERE code = ? AND users IS NOT NULL",
      [userCode, userLibelle, now, code]
    );
    return result;
  },

  // Suppression réelle (à garder pour compatibilité)
  remove: async (code, representantCode) => {
    if (representantCode) {
      const [result] = await db.query(
        "DELETE FROM client WHERE code = ? AND coderep = ?",
        [code, representantCode]
      );
      return result;
    }
    const [result] = await db.query("DELETE FROM client WHERE code = ?", [
      code,
    ]);
    return result;
  },
};

export default Client;
