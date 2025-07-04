import * as Yup from "yup";

// Schéma de validation pour les clients
export const clientValidationSchema = Yup.object()
  .shape({
    // Informations principales
    code: Yup.string()
      .required("Le code client est requis")
      .matches(
        /^[A-Z0-9]+$/,
        "Le code doit contenir uniquement des lettres majuscules et des chiffres"
      )
      .min(3, "Le code doit contenir au moins 3 caractères")
      .max(10, "Le code ne peut pas dépasser 10 caractères"),

    rsoc: Yup.string()
      .required("La raison sociale est requise")
      .min(2, "La raison sociale doit contenir au moins 2 caractères")
      .max(100, "La raison sociale ne peut pas dépasser 100 caractères"),

    mf: Yup.string().max(
      30,
      "Le matricule fiscal ne peut pas dépasser 30 caractères"
    ),

    RC: Yup.string().max(25, "Le RC ne peut pas dépasser 25 caractères"),

    // Adresse et coordonnées
    adresse: Yup.string().max(
      500,
      "L'adresse ne peut pas dépasser 500 caractères"
    ),

    ville: Yup.string().max(30, "La ville ne peut pas dépasser 30 caractères"),

    CP: Yup.string().max(5, "Le code postal ne peut pas dépasser 5 caractères"),

    cville: Yup.string().max(
      5,
      "Le code ville ne peut pas dépasser 5 caractères"
    ),

    tel: Yup.string().max(
      20,
      "Le téléphone ne peut pas dépasser 20 caractères"
    ),

    tel2: Yup.string().max(
      100,
      "Le téléphone secondaire ne peut pas dépasser 100 caractères"
    ),

    fax: Yup.string().max(20, "Le fax ne peut pas dépasser 20 caractères"),

    email: Yup.string()
      .email("Format d'email invalide")
      .max(60, "L'email ne peut pas dépasser 60 caractères"),

    // Contacts entreprise
    percon1: Yup.string().max(
      50,
      "Le contact 1 ne peut pas dépasser 50 caractères"
    ),

    respercon1: Yup.string().max(
      50,
      "Le responsable contact 1 ne peut pas dépasser 50 caractères"
    ),

    telpercon1: Yup.string().max(
      20,
      "Le téléphone contact 1 ne peut pas dépasser 20 caractères"
    ),

    emailpercon1: Yup.string()
      .email("Format d'email invalide")
      .max(60, "L'email contact 1 ne peut pas dépasser 60 caractères"),

    percon2: Yup.string().max(
      50,
      "Le contact 2 ne peut pas dépasser 50 caractères"
    ),

    respercon2: Yup.string().max(
      50,
      "Le responsable contact 2 ne peut pas dépasser 50 caractères"
    ),

    telpercon2: Yup.string().max(
      20,
      "Le téléphone contact 2 ne peut pas dépasser 20 caractères"
    ),

    emailpercon2: Yup.string()
      .email("Format d'email invalide")
      .max(60, "L'email contact 2 ne peut pas dépasser 60 caractères"),

    percon3: Yup.string().max(
      60,
      "Le contact 3 ne peut pas dépasser 60 caractères"
    ),

    respercon3: Yup.string().max(
      50,
      "Le responsable contact 3 ne peut pas dépasser 50 caractères"
    ),

    telpercon3: Yup.string().max(
      20,
      "Le téléphone contact 3 ne peut pas dépasser 20 caractères"
    ),

    emailpercon3: Yup.string()
      .email("Format d'email invalide")
      .max(50, "L'email contact 3 ne peut pas dépasser 50 caractères"),

    // Informations financières
    soldeinit: Yup.number()
      .typeError("Le solde initial doit être un nombre")
      .default(0),

    prix: Yup.string().max(10, "Le prix ne peut pas dépasser 10 caractères"),

    mtreg: Yup.number()
      .typeError("Le montant règlement doit être un nombre")
      .default(0),

    remise: Yup.number()
      .typeError("La remise doit être un nombre")
      .min(0, "La remise ne peut pas être négative")
      .max(100, "La remise ne peut pas dépasser 100%")
      .default(0),

    scredit: Yup.number()
      .typeError("Le solde crédit doit être un nombre")
      .min(0, "Le solde crédit ne peut pas être négatif")
      .default(0),

    srisque: Yup.number()
      .typeError("Le solde risque doit être un nombre")
      .min(0, "Le solde risque ne peut pas être négatif")
      .default(0),

    delaireg: Yup.number()
      .typeError("Le délai règlement doit être un nombre")
      .min(0, "Le délai règlement ne peut pas être négatif")
      .default(0),

    tauxret: Yup.number()
      .typeError("Le taux retenue doit être un nombre")
      .min(0, "Le taux retenue ne peut pas être négatif")
      .max(100, "Le taux retenue ne peut pas dépasser 100%")
      .default(0),

    // Informations bancaires
    banque: Yup.string().max(
      25,
      "La banque ne peut pas dépasser 25 caractères"
    ),

    RIB: Yup.string().max(30, "Le RIB ne peut pas dépasser 30 caractères"),

    codebanq: Yup.string().max(
      5,
      "Le code banque ne peut pas dépasser 5 caractères"
    ),

    adressebanque: Yup.string().max(
      200,
      "L'adresse banque ne peut pas dépasser 200 caractères"
    ),

    numcompte: Yup.string().max(
      10,
      "Le numéro compte ne peut pas dépasser 10 caractères"
    ),

    // Adresse de facturation
    adressefact: Yup.string().max(
      500,
      "L'adresse de facturation ne peut pas dépasser 500 caractères"
    ),

    adressear: Yup.string().max(
      500,
      "L'adresse AR ne peut pas dépasser 500 caractères"
    ),

    // Classifications
    codetarif: Yup.string().max(
      5,
      "Le code tarif ne peut pas dépasser 5 caractères"
    ),

    libtarif: Yup.string().max(
      50,
      "Le libellé tarif ne peut pas dépasser 50 caractères"
    ),

    codesect: Yup.string().max(
      5,
      "Le code secteur ne peut pas dépasser 5 caractères"
    ),

    libsect: Yup.string().max(
      50,
      "Le libellé secteur ne peut pas dépasser 50 caractères"
    ),

    codereg: Yup.string().max(
      5,
      "Le code région ne peut pas dépasser 5 caractères"
    ),

    libreg: Yup.string().max(
      50,
      "Le libellé région ne peut pas dépasser 50 caractères"
    ),

    codeact: Yup.string().max(
      5,
      "Le code activité ne peut pas dépasser 5 caractères"
    ),

    libact: Yup.string().max(
      50,
      "Le libellé activité ne peut pas dépasser 50 caractères"
    ),

    codetypreg: Yup.string().max(
      5,
      "Le code type règlement ne peut pas dépasser 5 caractères"
    ),

    libtypreg: Yup.string().max(
      50,
      "Le libellé type règlement ne peut pas dépasser 50 caractères"
    ),

    codegr: Yup.string().max(
      5,
      "Le code groupe ne peut pas dépasser 5 caractères"
    ),

    libgr: Yup.string().max(
      50,
      "Le libellé groupe ne peut pas dépasser 50 caractères"
    ),

    codequal: Yup.string().max(
      5,
      "Le code qualité ne peut pas dépasser 5 caractères"
    ),

    libqual: Yup.string().max(
      50,
      "Le libellé qualité ne peut pas dépasser 50 caractères"
    ),

    // Dates
    datedebut: Yup.date().typeError("Date de début invalide").nullable(),

    datefin: Yup.date().typeError("Date de fin invalide").nullable(),

    datecreation: Yup.date().typeError("Date de création invalide").nullable(),

    datevalidation: Yup.date()
      .typeError("Date de validation invalide")
      .nullable(),

    // Champs de texte longs
    decision: Yup.string().max(
      30,
      "La décision ne peut pas dépasser 30 caractères"
    ),

    message: Yup.string().max(
      1000,
      "Le message ne peut pas dépasser 1000 caractères"
    ),

    descl: Yup.string().max(
      1000,
      "La description ne peut pas dépasser 1000 caractères"
    ),

    libpost: Yup.string().max(
      50,
      "Le poste ne peut pas dépasser 50 caractères"
    ),

    // Champs booléens avec valeurs par défaut
    timbre: Yup.string().oneOf(["0", "1"], "Valeur invalide").default("0"),

    exo: Yup.string().oneOf(["0", "1"], "Valeur invalide").default("0"),

    susp: Yup.string().oneOf(["0", "1"], "Valeur invalide").default("0"),

    reel: Yup.string().oneOf(["0", "1"], "Valeur invalide").default("0"),

    export: Yup.string().oneOf(["0", "1"], "Valeur invalide").default("0"),

    validation: Yup.string()
      .oneOf(["0", "1", "2"], "Valeur invalide")
      .default("0"),

    blocage: Yup.string()
      .oneOf(["0", "1", "2"], "Valeur invalide")
      .default("0"),

    parunite: Yup.string()
      .oneOf(["0", "1", "2"], "Valeur invalide")
      .default("0"),

    prod: Yup.string().oneOf(["0", "1"], "Valeur invalide").default("0"),

    // Champs avec régime
    regime: Yup.string()
      .oneOf(["R", "N"], "Le régime doit être 'R' (Réel) ou 'N' (Normal)")
      .default("R"),

    rap: Yup.string()
      .oneOf(["N", "O"], "La valeur RAP doit être 'N' (Non) ou 'O' (Oui)")
      .default("N"),

    // Validation conditionnelle pour les dates
  })
  .test(
    "dates-coherentes",
    "Les dates doivent être cohérentes",
    function (values) {
      const { datedebut, datefin } = values;

      if (datedebut && datefin && new Date(datedebut) > new Date(datefin)) {
        return this.createError({
          path: "datefin",
          message: "La date de fin doit être postérieure à la date de début",
        });
      }

      return true;
    }
  );

// Valeurs par défaut pour un nouveau client
export const clientDefaultValues = {
  code: "",
  rsoc: "",
  adresse: "",
  mf: "",
  ville: "",
  tel: "",
  respercon1: "",
  coderep: "", // Sera rempli automatiquement avec le représentant connecté
  librep: "", // Sera rempli automatiquement avec le représentant connecté
  fax: "",
  percon1: "",
  telpercon1: "",
  emailpercon1: "",
  percon2: "",
  respercon2: "",
  telpercon2: "",
  emailpercon2: "",
  email: "",
  percon3: "",
  telpercon3: "",
  emailpercon3: "",
  respercon3: "",
  RC: "",
  CP: "",
  RIB: "",
  cville: "",
  banque: "",
  timbre: "0",
  exo: "0",
  susp: "0",
  reel: "0",
  datedebut: null,
  datefin: null,
  decision: "",
  export: "0",
  soldeinit: 0,
  prix: "",
  mtreg: 0,
  rap: "N",
  soldeinitbl: 0,
  mtregbl: 0,
  rapbl: 0,
  rapbc: "0",
  remise: 0,
  regime: "R",
  soldeinitbc: 0,
  mtrapbc: 0,
  soldeimp: 0,
  scredit: 0,
  srisque: 0,
  delaireg: 0,
  codetarif: "",
  libtarif: "",
  codesect: "",
  libsect: "",
  codereg: "",
  libreg: "",
  codeact: "",
  libact: "",
  libpost: "",
  codetypreg: "",
  libtypreg: "",
  codebanq: "",
  adressefact: "",
  comptec: "",
  rsocar: "",
  datecreation: new Date().toISOString().split("T")[0],
  datevalidation: null,
  validation: "0",
  blocage: "0",
  message: "",
  tel2: "",
  numcompte: "",
  codegr: "",
  libgr: "",
  parunite: "0",
  adressear: "",
  tauxret: 0,
  codequal: "",
  libqual: "",
  descl: "",
  prod: "0",
  adressebanque: "",
};
