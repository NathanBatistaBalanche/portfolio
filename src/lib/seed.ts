/**
 * src/lib/seed.ts
 * Remplit (ou met à jour) la table des projets à partir de src/data/projets-seed.ts.
 *
 *   bun run db:seed
 *
 * Relançable à volonté : chaque projet est remplacé d'après son id.
 * Les messages du formulaire de contact ne sont jamais touchés.
 */
import { db } from "./db";
import { projets, type ProjetSeed } from "../data/projets-seed";

const COLONNES = [
  "id", "titre", "type", "annee", "ordre", "publie", "a_la_une",
  "titre_page", "resume", "image", "image_alt", "lien_url", "lien_libelle",
  "contexte", "role", "equipe", "duree", "outils",
  "depart_titre", "depart_texte", "depart_objectif",
  "demarche_titre", "demarche_intro", "recul_titre",
] as const;

const supprimer = db.prepare("DELETE FROM projets WHERE id = ?");
const inserer = db.prepare(
  `INSERT INTO projets (${COLONNES.join(", ")}) VALUES (${COLONNES.map(() => "?").join(", ")})`,
);
const insererCategorie = db.prepare("INSERT INTO projet_categories (projet_id, categorie_id) VALUES (?, ?)");
const insererTag = db.prepare("INSERT INTO projet_tags (projet_id, ordre, tag) VALUES (?, ?, ?)");
const insererEtape = db.prepare(
  "INSERT INTO projet_etapes (projet_id, ordre, titre, description) VALUES (?, ?, ?, ?)",
);
const insererApprentissage = db.prepare(
  "INSERT INTO projet_apprentissages (projet_id, ordre, icone, titre, texte) VALUES (?, ?, ?, ?, ?)",
);

const categoriesExistantes = new Set(
  (db.prepare("SELECT id FROM categories").all() as { id: string }[]).map((c) => c.id),
);

function enregistrer(p: ProjetSeed) {
  if (!/^[a-z0-9]+$/.test(p.id)) {
    throw new Error(`Id invalide « ${p.id} » : lettres minuscules et chiffres uniquement, sans espace ni tiret.`);
  }
  for (const categorie of p.categories) {
    if (!categoriesExistantes.has(categorie)) {
      throw new Error(`Catégorie inconnue « ${categorie} » pour le projet ${p.id}.`);
    }
  }

  supprimer.run(p.id); // catégories, tags, étapes et apprentissages partent avec (ON DELETE CASCADE)
  inserer.run(...COLONNES.map((colonne) => p[colonne] ?? null));

  p.categories.forEach((categorie) => insererCategorie.run(p.id, categorie));
  p.tags.forEach((tag, i) => insererTag.run(p.id, i + 1, tag));
  p.etapes.forEach((e, i) => insererEtape.run(p.id, i + 1, e.titre, e.description));
  p.apprentissages.forEach((a, i) => insererApprentissage.run(p.id, i + 1, a.icone, a.titre, a.texte));
}

db.exec("BEGIN");
try {
  projets.forEach(enregistrer);
  db.exec("COMMIT");
} catch (erreur) {
  db.exec("ROLLBACK");
  throw erreur;
}

const total = db.prepare("SELECT COUNT(*) AS n FROM projets").get() as { n: number };
console.log(`✔ ${projets.length} projets enregistrés (${total.n} en base).`);
