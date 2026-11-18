/**
 * src/lib/projets.ts
 * Lecture des projets et des catégories pour le site.
 *
 *   listerProjets()                              → tous les projets publiés (page /projets)
 *   listerProjets({ aLaUne: true })              → ceux de la page d'accueil
 *   listerProjets({ categorie: "design" })       → filtrer par catégorie
 *   trouverProjet("ordaily")                     → toute la page d'un projet (ou null)  → [id].astro
 *   listerCategories()                           → Développement / Communication / Design + nombre de projets
 *
 * Les pages qui appellent ces fonctions doivent être rendues côté serveur
 * (export const prerender = false) pour voir les modifications sans reconstruire le site.
 */
import { db } from "./db";

export type TypeProjet = "groupe" | "solo";

export const LIBELLES_TYPE: Record<TypeProjet, string> = {
  groupe: "Projet de groupe",
  solo: "Projet solo",
};

export interface Categorie {
  id: string; // developpement, communication, design
  nom: string; // Développement, Communication, Design
}

export interface CategorieAvecTotal extends Categorie {
  total: number; // nombre de projets publiés dans cette catégorie
}

export interface ProjetCarte {
  id: string; // nom collé : sert d'adresse /projets/<id>
  titre: string;
  type: TypeProjet;
  typeLibelle: string;
  annee: number | null;
  image: string | null;
  imageAlt: string | null;
  categories: Categorie[];
  tags: string[];
}

export interface Etape {
  numero: string; // "01", "02"…
  titre: string;
  description: string;
}

export interface Apprentissage {
  icone: string | null;
  titre: string;
  texte: string;
}

export interface ProjetDetail extends ProjetCarte {
  /** « Étude de cas · Projet de groupe · 2026 » */
  surtitre: string;
  titrePage: string;
  resume: string;
  lienUrl: string | null;
  lienLibelle: string | null;
  infos: { libelle: string; valeur: string }[]; // bandeau Contexte / Rôle / Équipe / Durée / Outils
  departTitre: string | null;
  departTexte: string | null;
  departObjectif: string | null;
  demarcheTitre: string | null;
  demarcheIntro: string | null;
  etapes: Etape[];
  reculTitre: string | null;
  apprentissages: Apprentissage[];
}

type Ligne = Record<string, any>;

function versCarte(l: Ligne, categories: Categorie[], tags: string[]): ProjetCarte {
  return {
    id: l.id,
    titre: l.titre,
    type: l.type,
    typeLibelle: LIBELLES_TYPE[l.type as TypeProjet] ?? l.type,
    annee: l.annee,
    image: l.image,
    imageAlt: l.image_alt,
    categories,
    tags,
  };
}

export function listerCategories(): CategorieAvecTotal[] {
  return db
    .prepare(
      `SELECT c.id, c.nom,
              (SELECT COUNT(*) FROM projet_categories pc
                 JOIN projets p ON p.id = pc.projet_id
                WHERE pc.categorie_id = c.id AND p.publie = 1) AS total
         FROM categories c
        ORDER BY c.ordre`,
    )
    .all() as CategorieAvecTotal[];
}

export function listerProjets(options: { aLaUne?: boolean; categorie?: string; limite?: number } = {}): ProjetCarte[] {
  const conditions = ["publie = 1"];
  const parametres: (string | number)[] = [];

  if (options.aLaUne) conditions.push("a_la_une = 1");
  if (options.categorie) {
    conditions.push("id IN (SELECT projet_id FROM projet_categories WHERE categorie_id = ?)");
    parametres.push(options.categorie);
  }

  let limite = "";
  if (options.limite) {
    limite = "LIMIT ?";
    parametres.push(options.limite);
  }

  const lignes = db
    .prepare(`SELECT * FROM projets WHERE ${conditions.join(" AND ")} ORDER BY ordre, id ${limite}`)
    .all(...parametres) as Ligne[];

  if (lignes.length === 0) return [];

  // Catégories et tags de tous les projets, en une requête chacun
  const ids = lignes.map((l) => l.id);
  const marqueurs = ids.map(() => "?").join(", ");

  const lignesCategories = db
    .prepare(
      `SELECT pc.projet_id, c.id, c.nom
         FROM projet_categories pc JOIN categories c ON c.id = pc.categorie_id
        WHERE pc.projet_id IN (${marqueurs})
        ORDER BY c.ordre`,
    )
    .all(...ids) as { projet_id: string; id: string; nom: string }[];

  const lignesTags = db
    .prepare(`SELECT projet_id, tag FROM projet_tags WHERE projet_id IN (${marqueurs}) ORDER BY projet_id, ordre`)
    .all(...ids) as { projet_id: string; tag: string }[];

  const categoriesParProjet = new Map<string, Categorie[]>();
  for (const { projet_id, id, nom } of lignesCategories) {
    categoriesParProjet.set(projet_id, [...(categoriesParProjet.get(projet_id) ?? []), { id, nom }]);
  }

  const tagsParProjet = new Map<string, string[]>();
  for (const { projet_id, tag } of lignesTags) {
    tagsParProjet.set(projet_id, [...(tagsParProjet.get(projet_id) ?? []), tag]);
  }

  return lignes.map((l) => versCarte(l, categoriesParProjet.get(l.id) ?? [], tagsParProjet.get(l.id) ?? []));
}

export function trouverProjet(id: string): ProjetDetail | null {
  const l = db.prepare("SELECT * FROM projets WHERE id = ? AND publie = 1").get(id) as Ligne | null | undefined;
  if (!l) return null;

  const categories = db
    .prepare(
      `SELECT c.id, c.nom FROM projet_categories pc JOIN categories c ON c.id = pc.categorie_id
        WHERE pc.projet_id = ? ORDER BY c.ordre`,
    )
    .all(l.id) as Categorie[];

  const tags = (
    db.prepare("SELECT tag FROM projet_tags WHERE projet_id = ? ORDER BY ordre").all(l.id) as { tag: string }[]
  ).map((t) => t.tag);

  const etapes = (
    db
      .prepare("SELECT titre, description FROM projet_etapes WHERE projet_id = ? ORDER BY ordre")
      .all(l.id) as { titre: string; description: string }[]
  ).map((e, i) => ({ numero: String(i + 1).padStart(2, "0"), ...e }));

  const apprentissages = db
    .prepare("SELECT icone, titre, texte FROM projet_apprentissages WHERE projet_id = ? ORDER BY ordre")
    .all(l.id) as Apprentissage[];

  const carte = versCarte(l, categories, tags);

  const infos = [
    { libelle: "Contexte", valeur: l.contexte },
    { libelle: "Rôle", valeur: l.role },
    { libelle: "Équipe", valeur: l.equipe },
    { libelle: "Durée", valeur: l.duree },
    { libelle: "Outils", valeur: l.outils },
  ].filter((info): info is { libelle: string; valeur: string } => Boolean(info.valeur));

  return {
    ...carte,
    surtitre: ["Étude de cas", carte.typeLibelle, l.annee].filter(Boolean).join(" · "),
    titrePage: l.titre_page,
    resume: l.resume,
    lienUrl: l.lien_url,
    lienLibelle: l.lien_libelle,
    infos,
    departTitre: l.depart_titre,
    departTexte: l.depart_texte,
    departObjectif: l.depart_objectif,
    demarcheTitre: l.demarche_titre,
    demarcheIntro: l.demarche_intro,
    etapes,
    reculTitre: l.recul_titre,
    apprentissages,
  };
}

/** Tous les ids publiés (utile pour getStaticPaths ou un sitemap). */
export function listerIds(): string[] {
  return (db.prepare("SELECT id FROM projets WHERE publie = 1 ORDER BY ordre, id").all() as { id: string }[]).map(
    (l) => l.id,
  );
}
