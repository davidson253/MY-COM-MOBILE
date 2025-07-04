import * as Yup from "yup";

// Schéma de validation pour les articles
export const articleValidationSchema = Yup.object().shape({
  code: Yup.string()
    .required("Le code est obligatoire")
    .max(20, "Le code ne peut dépasser 20 caractères")
    .matches(
      /^[A-Za-z0-9_-]+$/,
      "Le code ne peut contenir que des lettres, chiffres, tirets et underscores"
    ),

  libelle: Yup.string()
    .required("Le libellé est obligatoire")
    .max(255, "Le libellé ne peut dépasser 255 caractères"),

  famille: Yup.string()
    .required("La famille est obligatoire")
    .max(50, "La famille ne peut dépasser 50 caractères"),

  libellefam: Yup.string().max(
    255,
    "Le libellé famille ne peut dépasser 255 caractères"
  ),

  unite: Yup.string().max(20, "L'unité ne peut dépasser 20 caractères"),

  nbunite: Yup.number()
    .min(0, "Le nombre d'unités doit être positif")
    .default(1),

  tva: Yup.number()
    .min(0, "La TVA doit être positive")
    .max(100, "La TVA ne peut dépasser 100%")
    .default(0),

  type: Yup.string().max(50, "Le type ne peut dépasser 50 caractères"),

  prixbrut: Yup.number()
    .required("Le prix brut est obligatoire")
    .min(0, "Le prix brut doit être positif"),

  remise: Yup.number()
    .min(0, "La remise doit être positive")
    .max(100, "La remise ne peut dépasser 100%")
    .default(0),

  prixnet: Yup.number().min(0, "Le prix net doit être positif").default(0),

  marge: Yup.number().min(0, "La marge doit être positive").default(0),

  prixht: Yup.number().min(0, "Le prix HT doit être positif").default(0),

  prixttc: Yup.number().min(0, "Le prix TTC doit être positif").default(0),

  qtemin: Yup.number()
    .min(0, "La quantité minimum doit être positive")
    .default(0),

  qtemax: Yup.number()
    .min(0, "La quantité maximum doit être positive")
    .default(0),

  codebarre: Yup.string().max(
    50,
    "Le code barre ne peut dépasser 50 caractères"
  ),

  longueur: Yup.number().min(0, "La longueur doit être positive"),

  largeur: Yup.number().min(0, "La largeur doit être positive"),

  hauteur: Yup.number().min(0, "La hauteur doit être positive"),

  poids: Yup.number().min(0, "Le poids doit être positif"),

  codemar: Yup.string().max(
    20,
    "Le code marque ne peut dépasser 20 caractères"
  ),

  libmar: Yup.string().max(
    255,
    "Le libellé marque ne peut dépasser 255 caractères"
  ),

  codecat: Yup.string().max(
    20,
    "Le code catégorie ne peut dépasser 20 caractères"
  ),

  libcat: Yup.string().max(
    255,
    "Le libellé catégorie ne peut dépasser 255 caractères"
  ),

  codefourn: Yup.string().max(
    20,
    "Le code fournisseur ne peut dépasser 20 caractères"
  ),

  libfourn: Yup.string().max(
    255,
    "Le nom fournisseur ne peut dépasser 255 caractères"
  ),

  nature: Yup.string().max(50, "La nature ne peut dépasser 50 caractères"),

  prixmin: Yup.number().min(0, "Le prix minimum doit être positif"),

  prixmax: Yup.number().min(0, "Le prix maximum doit être positif"),

  // Champs booléens
  serie: Yup.boolean().default(false),
  balance: Yup.boolean().default(false),
  affcaisse: Yup.boolean().default(true),
  defalcation: Yup.boolean().default(false),
  enstock: Yup.boolean().default(true),
  inactif: Yup.boolean().default(false),

  // Champs optionnels
  libellear: Yup.string().max(255),
  cheminimg: Yup.string().max(500),
  libdet: Yup.string().max(500),
});

// Valeurs par défaut pour le formulaire
export const articleDefaultValues = {
  code: "",
  libelle: "",
  famille: "",
  libellefam: "",
  unite: "U",
  nbunite: 1,
  tva: 19,
  type: "",
  prixbrut: 0,
  remise: 0,
  prixnet: 0,
  marge: 0,
  prixht: 0,
  prixttc: 0,
  prixht1: 0,
  prixttc1: 0,
  defalcation: false,
  gconf: "",
  dc: "",
  fodec: 0,
  affcaisse: true,
  serie: false,
  libellear: "",
  codecat: "",
  libcat: "",
  codefourn: "",
  libfourn: "",
  nature: "",
  prixmin: 0,
  prixmax: 0,
  usera: "",
  libusera: "",
  userm: "",
  libuserm: "",
  users: "",
  libusers: "",
  datem: "",
  timem: "",
  prixachinit: 0,
  tvaach: 0,
  artdim: "",
  cemp: "",
  libemp: "",
  balance: false,
  inactif: false,
  datecreation: "",
  prixbrut1: 0,
  remise1: 0,
  enstock: true,
  codebarre: "",
  longueur: 0,
  largeur: 0,
  hauteur: 0,
  qtemin: 0,
  qtemax: 0,
  nbuniteim: 0,
  ttcach: 0,
  basetva: 0,
  mttva: 0,
  autretaxe: 0,
  smtva: 0,
  remisev: 0,
  tva2: 0,
  fodeca: 0,
  cheminimg: "",
  mvtart: "",
  codenuance: "",
  libnuance: "",
  nbjour: 0,
  codemar: "",
  libmar: "",
  codech: "",
  libch: "",
  codecli: "",
  libcli: "",
  coderef: "",
  libref: "",
  poids: 0,
  dechet: 0,
  codedomaine: "",
  libdomaine: "",
  movre: "",
  formeart: "",
  codefinit: "",
  libfinit: "",
  libdet: "",
};

// Export des valeurs par défaut
