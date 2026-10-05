/**
 * Photos stock génériques de la démo (Unsplash ou Pexels : licence gratuite, usage commercial autorisé).
 * Elles illustrent le MÉTIER, jamais un chantier réel de l'artisan : ses vraies photos les remplacent
 * après la vente.
 *
 * Ajouter une photo : déposer le fichier (WebP ou JPEG, ~1600 px de large, 400 Ko max) dans
 * public/images/stock/, puis déclarer ici `src`, un `alt` fidèle à l'image et `credit` (auteur + URL de
 * la page source, pour traçabilité interne : jamais affiché). Jamais de lien direct vers Unsplash/Pexels.
 */
export type StockPhoto = {
  /** Chemin depuis public/, toujours sous /images/stock/. */
  src: string;
  alt: string;
  credit: string;
};

const PROVISOIRE = "Illustration provisoire du template (aucune photo)";

// Illustrations SVG du template, acceptées pour la démo (aucune photo stock).
export const STOCK_PHOTOS = {
  hero: { src: "/images/stock/illustration-hero.svg", alt: "Illustration d’un tableau électrique", credit: PROVISOIRE },
  irve: { src: "/images/stock/illustration-irve.svg", alt: "Illustration d’une borne de recharge murale", credit: PROVISOIRE },
  depannage: {
    src: "/images/stock/illustration-depannage.svg",
    alt: "Illustration d’un disjoncteur déclenché",
    credit: PROVISOIRE,
  },
  renovation: {
    src: "/images/stock/illustration-renovation.svg",
    alt: "Illustration d’un tableau électrique neuf et d’outils",
    credit: PROVISOIRE,
  },
  climatisation: {
    src: "/images/stock/illustration-climatisation.svg",
    alt: "Illustration d’une climatisation murale",
    credit: PROVISOIRE,
  },
  chauffage: { src: "/images/stock/illustration-chauffage.svg", alt: "Illustration d’un radiateur électrique", credit: PROVISOIRE },
  solaire: {
    src: "/images/stock/illustration-solaire.svg",
    alt: "Illustration d’une maison équipée de panneaux solaires",
    credit: PROVISOIRE,
  },
  domotique: {
    src: "/images/stock/illustration-domotique.svg",
    alt: "Illustration d’une maison connectée pilotée depuis un téléphone",
    credit: PROVISOIRE,
  },
  securite: {
    src: "/images/stock/illustration-securite.svg",
    alt: "Illustration d’une caméra de surveillance et d’un bouclier",
    credit: PROVISOIRE,
  },
  avant: { src: "/images/stock/illustration-avant.svg", alt: "Tableau électrique vétuste avant les travaux", credit: PROVISOIRE },
  apres: { src: "/images/stock/illustration-apres.svg", alt: "Tableau électrique neuf après les travaux", credit: PROVISOIRE },
  // Avant/après propres à chaque service (même scène, seul l'équipement change).
  irveAvant: {
    src: "/images/stock/illustration-irve-avant.svg",
    alt: "Voiture électrique rechargée sur une prise ordinaire avec une rallonge",
    credit: PROVISOIRE,
  },
  irveApres: {
    src: "/images/stock/illustration-irve-apres.svg",
    alt: "Voiture électrique rechargée sur une borne murale neuve",
    credit: PROVISOIRE,
  },
  depannageAvant: {
    src: "/images/stock/illustration-depannage-avant.svg",
    alt: "Pièce privée de courant : disjoncteur déclenché et prise noircie",
    credit: PROVISOIRE,
  },
  depannageApres: {
    src: "/images/stock/illustration-depannage-apres.svg",
    alt: "Pièce de nouveau éclairée, prise remplacée et disjoncteurs réarmés",
    credit: PROVISOIRE,
  },
  climatisationAvant: {
    src: "/images/stock/illustration-climatisation-avant.svg",
    alt: "Pièce surchauffée, mur encore sans climatisation",
    credit: PROVISOIRE,
  },
  climatisationApres: {
    src: "/images/stock/illustration-climatisation-apres.svg",
    alt: "Climatisation murale posée, air frais dans la pièce",
    credit: PROVISOIRE,
  },
  chauffageAvant: {
    src: "/images/stock/illustration-chauffage-avant.svg",
    alt: "Vieux convecteur sous une fenêtre en hiver, pièce froide",
    credit: PROVISOIRE,
  },
  chauffageApres: {
    src: "/images/stock/illustration-chauffage-apres.svg",
    alt: "Radiateur électrique neuf, pièce chauffée",
    credit: PROVISOIRE,
  },
  solaireAvant: {
    src: "/images/stock/illustration-solaire-avant.svg",
    alt: "Maison au toit encore sans panneaux solaires",
    credit: PROVISOIRE,
  },
  solaireApres: {
    src: "/images/stock/illustration-solaire-apres.svg",
    alt: "Maison équipée de panneaux solaires sur le toit",
    credit: PROVISOIRE,
  },
  domotiqueAvant: {
    src: "/images/stock/illustration-domotique-avant.svg",
    alt: "Interrupteurs classiques, volet et éclairage commandés à la main",
    credit: PROVISOIRE,
  },
  domotiqueApres: {
    src: "/images/stock/illustration-domotique-apres.svg",
    alt: "Éclairage et volet pilotés depuis un écran mural et un téléphone",
    credit: PROVISOIRE,
  },
  securiteAvant: {
    src: "/images/stock/illustration-securite-avant.svg",
    alt: "Façade de maison sans protection",
    credit: PROVISOIRE,
  },
  securiteApres: {
    src: "/images/stock/illustration-securite-apres.svg",
    alt: "Façade équipée d’une caméra, d’une sirène d’alarme et d’un éclairage",
    credit: PROVISOIRE,
  },
} satisfies Record<string, StockPhoto>;

export type StockPhotoId = keyof typeof STOCK_PHOTOS;
