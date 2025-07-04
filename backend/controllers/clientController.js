import Client from "../models/clientModel.js";
import Log from "../models/logModel.js";
import db from "../models/db.js";

// Liste tous les clients du représentant connecté
export const getClients = async (req, res) => {
  try {
    if (!req.user?.code) {
      return res.status(401).json({
        error: "Utilisateur non authentifié ou code représentant manquant.",
      });
    }
    const clients = await Client.getAll(req.user.code);
    res.json(clients);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des clients." });
  }
};

// Détail d'un client du représentant connecté
export const getClientById = async (req, res) => {
  try {
    if (!req.user?.code) {
      return res.status(401).json({
        error: "Utilisateur non authentifié ou code représentant manquant.",
      });
    }
    const client = await Client.getById(req.params.code, req.user.code);
    if (!client)
      return res
        .status(404)
        .json({ error: "Client non trouvé ou non autorisé" });
    res.json(client);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Création d'un client par le représentant connecté
export const createClient = async (req, res) => {
  try {
    if (!req.user?.code) {
      return res.status(401).json({
        error: "Utilisateur non authentifié ou code représentant manquant.",
      });
    }
    const clientData = {
      code: req.body.code, // Le code client est obligatoire (clé primaire)
      rsoc: req.body.rsoc,
      adresse: req.body.adresse,
      ville: req.body.ville,
      tel: req.body.tel,
      email: req.body.email,
      mf: req.body.mf,
      coderep: req.user.code, // Code du représentant connecté
      librep: req.user.libelle, // Nom du représentant connecté
      CP: req.body.CP,
      fax: req.body.fax,
      banque: req.body.banque,
      RIB: req.body.RIB,
      RC: req.body.RC,
      scredit: req.body.scredit || 0,
      remise: req.body.remise || 0,
      tel2: req.body.tel2,
      adressefact: req.body.adressefact,
      message: req.body.message,
      // Contacts supplémentaires
      respercon1: req.body.respercon1,
      percon1: req.body.percon1,
      telpercon1: req.body.telpercon1,
      emailpercon1: req.body.emailpercon1,
      percon2: req.body.percon2,
      respercon2: req.body.respercon2,
      telpercon2: req.body.telpercon2,
      emailpercon2: req.body.emailpercon2,
      percon3: req.body.percon3,
      respercon3: req.body.respercon3,
      telpercon3: req.body.telpercon3,
      emailpercon3: req.body.emailpercon3,
      // Informations financières
      soldeinit: req.body.soldeinit || 0,
      prix: req.body.prix,
      mtreg: req.body.mtreg || 0,
      delaireg: req.body.delaireg || 0,
      srisque: req.body.srisque || 0,
      tauxret: req.body.tauxret || 0,
      // Informations géographiques
      cville: req.body.cville,
      // Informations bancaires supplémentaires
      adressebanque: req.body.adressebanque,
      numcompte: req.body.numcompte,
      // Tarification
      codetarif: req.body.codetarif,
      libtarif: req.body.libtarif,
      // Secteur et région
      codesect: req.body.codesect,
      libsect: req.body.libsect,
      codereg: req.body.codereg,
      libreg: req.body.libreg,
      // Activité et qualité
      codeact: req.body.codeact,
      libact: req.body.libact,
      codequal: req.body.codequal,
      libqual: req.body.libqual,
      // Groupement
      codegr: req.body.codegr,
      libgr: req.body.libgr,
      // Autres informations
      adressear: req.body.adressear,
      rsocar: req.body.rsocar,
      libpost: req.body.libpost,
      comptec: req.body.comptec,
      decision: req.body.decision,
      descl: req.body.descl,
      // Informations administratives
      timbre: req.body.timbre || "0",
      exo: req.body.exo || "0",
      regime: req.body.regime || "R",
      rap: req.body.rap || "N",
      export: req.body.export || "0",
      susp: req.body.susp || "0",
      blocage: req.body.blocage || "0",
      validation: req.body.validation || "0",
      prod: req.body.prod || "0",
      parunite: req.body.parunite || "0",
      // Dates
      datedebut: req.body.datedebut,
      datefin: req.body.datefin,
      datevalidation: req.body.datevalidation,
    };
    const result = await Client.create(clientData);
    await Log.create({
      user_id: req.user.code, // Utiliser le code représentant comme user_id
      representant_code: req.user.code, // Code du représentant connecté
      action: "CREATE",
      entity: "client",
      entity_id: result.insertId,
      details: { createdData: clientData },
    });
    res
      .status(201)
      .json({ message: "Client créé", id: result.insertId, result });
  } catch (err) {
    console.error("Erreur lors de la création du client:", err);
    res.status(500).json({ error: err.message });
  }
};

// Modification d'un client du représentant connecté
export const updateClient = async (req, res) => {
  try {
    if (!req.user?.code) {
      return res.status(401).json({
        error: "Utilisateur non authentifié ou code représentant manquant.",
      });
    }
    // Vérifier que le client appartient bien au représentant
    const existingClient = await Client.getById(req.params.code, req.user.code);
    if (!existingClient) {
      return res
        .status(404)
        .json({ error: "Client non trouvé ou non autorisé" });
    }
    const clientData = {
      rsoc: req.body.rsoc,
      adresse: req.body.adresse,
      ville: req.body.ville,
      tel: req.body.tel,
      email: req.body.email,
      mf: req.body.mf,
      CP: req.body.CP,
      fax: req.body.fax,
      coderep: req.user.code, // Code du représentant connecté
      librep: req.user.libelle, // Nom du représentant connecté
      banque: req.body.banque,
      RIB: req.body.RIB,
      RC: req.body.RC,
      scredit: req.body.scredit || 0,
      remise: req.body.remise || 0,
      tel2: req.body.tel2,
      adressefact: req.body.adressefact,
      message: req.body.message,
      // Contacts supplémentaires
      respercon1: req.body.respercon1,
      percon1: req.body.percon1,
      telpercon1: req.body.telpercon1,
      emailpercon1: req.body.emailpercon1,
      percon2: req.body.percon2,
      respercon2: req.body.respercon2,
      telpercon2: req.body.telpercon2,
      emailpercon2: req.body.emailpercon2,
      percon3: req.body.percon3,
      respercon3: req.body.respercon3,
      telpercon3: req.body.telpercon3,
      emailpercon3: req.body.emailpercon3,
      // Informations financières
      soldeinit: req.body.soldeinit || 0,
      prix: req.body.prix,
      mtreg: req.body.mtreg || 0,
      delaireg: req.body.delaireg || 0,
      srisque: req.body.srisque || 0,
      tauxret: req.body.tauxret || 0,
      // Informations géographiques
      cville: req.body.cville,
      // Informations bancaires supplémentaires
      adressebanque: req.body.adressebanque,
      numcompte: req.body.numcompte,
      // Tarification
      codetarif: req.body.codetarif,
      libtarif: req.body.libtarif,
      // Secteur et région
      codesect: req.body.codesect,
      libsect: req.body.libsect,
      codereg: req.body.codereg,
      libreg: req.body.libreg,
      // Activité et qualité
      codeact: req.body.codeact,
      libact: req.body.libact,
      codequal: req.body.codequal,
      libqual: req.body.libqual,
      // Groupement
      codegr: req.body.codegr,
      libgr: req.body.libgr,
      // Autres informations
      adressear: req.body.adressear,
      rsocar: req.body.rsocar,
      libpost: req.body.libpost,
      comptec: req.body.comptec,
      decision: req.body.decision,
      descl: req.body.descl,
      // Informations administratives
      timbre: req.body.timbre || "0",
      exo: req.body.exo || "0",
      regime: req.body.regime || "R",
      rap: req.body.rap || "N",
      export: req.body.export || "0",
      susp: req.body.susp || "0",
      blocage: req.body.blocage || "0",
      validation: req.body.validation || "0",
      prod: req.body.prod || "0",
      parunite: req.body.parunite || "0",
      // Dates
      datedebut: req.body.datedebut,
      datefin: req.body.datefin,
      datevalidation: req.body.datevalidation,
    };
    const result = await Client.update(
      req.params.code,
      clientData,
      req.user.code
    );
    // Logging des modifications
    const fieldsToLog = [
      "rsoc",
      "ville",
      "tel",
      "email",
      "mf",
      "CP",
      "scredit",
      "adresse",
      "banque",
      "RIB",
      "RC",
    ];
    const changes = {};
    fieldsToLog.forEach((key) => {
      const oldValue = existingClient[key];
      const newValue = clientData[key];
      const normalizeValue = (val) =>
        val === null || val === undefined || val === "" ? null : val;
      if (normalizeValue(oldValue) !== normalizeValue(newValue)) {
        changes[key] = { before: oldValue, after: newValue };
      }
    });
    if (Object.keys(changes).length > 0) {
      await Log.create({
        user_id: req.user.code, // Utiliser le code représentant comme user_id
        representant_code: req.user.code, // Code du représentant connecté
        action: "UPDATE",
        entity: "client",
        entity_id: req.params.code,
        details: { changes },
      });
    }
    res.json({ message: "Client modifié", result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Suppression physique d'un client (DELETE)
export const deleteClient = async (req, res) => {
  try {
    const representantCode = req.user?.code;
    if (!representantCode) {
      return res.status(401).json({ error: "Représentant non authentifié" });
    }

    const existingClient = await Client.getById(
      req.params.code,
      representantCode
    );
    if (!existingClient) {
      return res.status(404).json({ error: "Client non trouvé" });
    }

    // Log avant suppression physique
    await Log.create({
      user_id: req.user.code, // Utiliser le code représentant comme user_id
      representant_code: representantCode,
      action: "DELETE",
      entity: "client",
      entity_id: req.params.code,
      details: { deleted_data: existingClient },
    });

    // Suppression physique (DELETE)
    const result = await Client.remove(req.params.code, representantCode);

    if (result.affectedRows === 0) {
      return res
        .status(400)
        .json({ error: "Impossible de supprimer ce client" });
    }

    res.json({ message: "Client supprimé définitivement" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Récupération des logs d'un client (optionnel, pas de filtrage par représentant)
export const getClientLogs = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM logs WHERE entity = 'client' AND entity_id = ? ORDER BY created_at DESC",
      [req.params.code]
    );
    const logs = rows.map((log) => ({
      ...log,
      details: log.details ? JSON.parse(log.details) : null,
    }));
    res.json(logs);
  } catch (err) {
    console.error("Erreur lors de la récupération des logs:", err);
    res.status(500).json({ error: err.message });
  }
};
