// Configuration des champs pour le formulaire article
export const ARTICLE_FORM_CONFIG = {
  groups: [
    {
      title: "📦 Informations principales",
      fields: [
      {
        name: "code",
        label: "Code article",
        type: "text",
        required: true,
        placeholder: "Ex: ART001",
        description: "Code unique de l'article",
      },
      {
        name: "libelle",
        label: "Libellé",
        type: "text",
        required: true,
        placeholder: "Nom de l'article",
        description: "Nom complet de l'article",
      },
      {
        name: "famille",
        label: "Famille",
        type: "text",
        placeholder: "Code famille",
        description: "Code de la famille de l'article",
      },
      {
        name: "libellefam",
        label: "Libellé famille",
        type: "text",
        placeholder: "Nom de la famille",
        description: "Nom de la famille ou sous-famille",
      },
    ],
  },
  {
    title: "📏 Unités et mesures",
    fields: [
      {
        name: "unite",
        label: "Unité",
        type: "text",
        placeholder: "Ex: PC, KG, L",
        description: "Unité de mesure (pièce, kilogramme, litre...)",
      },
      {
        name: "nbunite",
        label: "Nombre d'unités",
        type: "number",
        placeholder: "1",
        description: "Nombre d'unités par conditionnement",
      },
      {
        name: "poids",
        label: "Poids",
        type: "number",
        step: "0.01",
        placeholder: "0.00",
        description: "Poids en kilogrammes",
      },
      {
        name: "volume",
        label: "Volume",
        type: "number",
        step: "0.01",
        placeholder: "0.00",
        description: "Volume en litres ou m³",
      },
    ],
  },
  {
    title: "💰 Prix et TVA",
    fields: [
      {
        name: "prixbrut",
        label: "Prix brut",
        type: "number",
        step: "0.001",
        placeholder: "0.000",
        description: "Prix brut avant remise",
      },
      {
        name: "remise",
        label: "Remise (%)",
        type: "number",
        step: "0.01",
        placeholder: "0.00",
        description: "Pourcentage de remise",
      },
      {
        name: "tva",
        label: "TVA (%)",
        type: "number",
        step: "0.01",
        placeholder: "19.00",
        description: "Taux de TVA en pourcentage",
      },
      {
        name: "type",
        label: "Type article",
        type: "select",
        options: [
          { value: "", label: "Sélectionner un type" },
          { value: "P", label: "Produit" },
          { value: "S", label: "Service" },
          { value: "M", label: "Matière première" },
          { value: "A", label: "Accessoire" },
        ],
        description: "Type de l'article",
      },
    ],
  },
  {
    title: "🏪 Stock et gestion",
    fields: [
      {
        name: "stockmin",
        label: "Stock minimum",
        type: "number",
        placeholder: "0",
        description: "Stock minimum d'alerte",
      },
      {
        name: "stockmax",
        label: "Stock maximum",
        type: "number",
        placeholder: "0",
        description: "Stock maximum recommandé",
      },
      {
        name: "stockactuel",
        label: "Stock actuel",
        type: "number",
        placeholder: "0",
        description: "Quantité en stock actuellement",
      },
      {
        name: "emplacement",
        label: "Emplacement",
        type: "text",
        placeholder: "Ex: A1-B2",
        description: "Emplacement dans l'entrepôt",
      },
    ],
  },
  {
    title: "🔧 Options avancées",
    fields: [
      {
        name: "codebarre",
        label: "Code-barres",
        type: "text",
        placeholder: "Code-barres EAN/UPC",
        description: "Code-barres de l'article",
      },
      {
        name: "reference",
        label: "Référence",
        type: "text",
        placeholder: "Référence fournisseur",
        description: "Référence fournisseur",
      },
      {
        name: "marque",
        label: "Marque",
        type: "text",
        placeholder: "Nom de la marque",
        description: "Marque du produit",
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        rows: 3,
        placeholder: "Description détaillée de l'article...",
        description: "Description complète de l'article",
      },
    ],
  },
  {
    title: "✅ Statut",
    fields: [
      {
        name: "actif",
        label: "Article actif",
        type: "checkbox",
        description: "Cocher si l'article est disponible à la vente",
      },
      {
        name: "enpromotion",
        label: "En promotion",
        type: "checkbox",
        description: "Cocher si l'article est actuellement en promotion",
      },
    ],
  },
  ]
};
