/**
 * src/data/projets.ts
 * Projets affichés sur la page d'accueil (données statiques pour l'instant).
 *
 * Plus tard : remplacer ce tableau par une requête vers la base SQLite.
 * Tant que chaque projet garde cette forme d'objet, le reste du site n'aura rien à changer.
 */
export interface Projet {
  slug: string;
  titre: string;
  type: "Projet de groupe" | "Projet solo";
  tags: string[];
  /**
   * URL de l'image d'aperçu, ex : "/images/projets/ordaily.webp" (fichier dans public/).
   * Laisser vide pour afficher un visuel provisoire.
   */
  image?: string;
}

export const projets: Projet[] = [
  {
    slug: "ordaily",
    titre: "OrDaily",
    type: "Projet de groupe",
    tags: ["UX/UI Design", "Développement web", "Accessibilité", "Base de données"],
  },
  {
    slug: "les-rives-du-territoire",
    titre: "Les Rives du Territoire",
    type: "Projet solo",
    tags: ["Direction artistique", "UI Design", "Développement web", "Intégration"],
  },
  {
    slug: "emminent",
    titre: "Emminent",
    type: "Projet de groupe",
    tags: ["UX/UI Design", "Intelligence artificielle", "Conception produit", "Prototypage"],
  },
];