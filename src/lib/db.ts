/**
 * src/lib/db.ts
 * Connexion unique à la base SQLite (fichier data/db.sqlite à la racine du projet).
 * Le dossier et les tables sont créés automatiquement s'ils n'existent pas.
 *
 * Fonctionne avec bun (bun:sqlite). Si tu passes à Node plus tard, seule la
 * ligne d'import change :  import Database from "better-sqlite3";
 * (le reste du code utilise uniquement prepare / run / get / all / exec).
 */
import { Database } from "bun:sqlite";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { SCHEMA } from "./schema";

const CHEMIN = process.env.DB_PATH ?? resolve(process.cwd(), "data", "db.sqlite");

mkdirSync(dirname(CHEMIN), { recursive: true });

export const db = new Database(CHEMIN);

db.exec("PRAGMA journal_mode = WAL");
db.exec("PRAGMA foreign_keys = ON");

// Migration : la première version de la table `projets` utilisait un « slug » en plus d'un id numérique.
// Les projets viennent uniquement de src/data/projets-seed.ts, on peut donc les recréer sans risque
// (relancer `bun run db:seed` ensuite). La table `messages` n'est jamais touchée.
const colonnes = db.prepare("PRAGMA table_info(projets)").all() as { name: string }[];
if (colonnes.some((colonne) => colonne.name === "slug")) {
  for (const table of ["projet_tags", "projet_etapes", "projet_apprentissages", "projets"]) {
    db.exec(`DROP TABLE IF EXISTS ${table}`);
  }
}

for (const instruction of SCHEMA) {
  db.exec(instruction);
}
