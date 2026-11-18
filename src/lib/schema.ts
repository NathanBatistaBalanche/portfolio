/**
 * src/lib/schema.ts
 * Structure de la base SQLite du portfolio.
 * Les tables sont créées au premier lancement (CREATE TABLE IF NOT EXISTS) :
 * on peut donc relancer sans rien perdre.
 *
 * L'id d'un projet est son nom collé en minuscules : « ordaily », « lesrivesduterritoire »…
 * C'est lui qui sert d'adresse : /projets/ordaily  →  src/pages/projets/[id].astro
 *
 * Correspondance avec la page modèle d'un projet :
 *   - bandeau « Étude de cas · Projet de groupe · 2026 » ........ type + annee
 *   - titre du hero + paragraphe + bouton « Prototype » ......... titre_page, resume, lien_url, lien_libelle
 *   - grande image du hero ...................................... image, image_alt
 *   - bandeau Contexte / Rôle / Équipe / Durée / Outils ......... contexte, role, equipe, duree, outils
 *   - « Le point de départ » .................................... depart_titre, depart_texte, depart_objectif
 *   - « La démarche » (4 étapes 01 à 04) ........................ demarche_titre, demarche_intro + projet_etapes
 *   - « Avec le recul » (3 apprentissages avec icône) ........... recul_titre + projet_apprentissages
 *   - carte sur la page d'accueil ............................... titre, type, tags (projet_tags), image
 *   - filtre Développement / Communication / Design ............. categories + projet_categories
 */
export const SCHEMA: string[] = [
  // Catégories (Développement, Communication, Design)
  `CREATE TABLE IF NOT EXISTS categories (
    id     TEXT    PRIMARY KEY,                          -- developpement, communication, design
    nom    TEXT    NOT NULL,                             -- nom affiché
    ordre  INTEGER NOT NULL DEFAULT 0
  )`,

  `INSERT OR IGNORE INTO categories (id, nom, ordre) VALUES ('developpement', 'Développement', 1)`,
  `INSERT OR IGNORE INTO categories (id, nom, ordre) VALUES ('communication', 'Communication', 2)`,
  `INSERT OR IGNORE INTO categories (id, nom, ordre) VALUES ('design', 'Design', 3)`,

  `CREATE TABLE IF NOT EXISTS projets (
    id               TEXT    PRIMARY KEY,                -- nom collé : ordaily, lesrivesduterritoire…
    titre            TEXT    NOT NULL,                   -- nom court (cartes), ex : OrDaily
    type             TEXT    NOT NULL CHECK (type IN ('groupe', 'solo')),
    annee            INTEGER,
    ordre            INTEGER NOT NULL DEFAULT 0,         -- ordre d'affichage (petit = en premier)
    publie           INTEGER NOT NULL DEFAULT 1,         -- 0 = brouillon, invisible sur le site
    a_la_une         INTEGER NOT NULL DEFAULT 0,         -- 1 = affiché sur la page d'accueil

    titre_page       TEXT    NOT NULL,                   -- grand titre de la page projet
    resume           TEXT    NOT NULL,                   -- paragraphe à droite du titre
    image            TEXT,                               -- ex : /images/projets/ordaily/cover.webp
    image_alt        TEXT,
    lien_url         TEXT,                               -- site en ligne ou prototype
    lien_libelle     TEXT,                               -- texte du bouton (« Prototype », « Voir le site »…)

    contexte         TEXT,
    role             TEXT,
    equipe           TEXT,
    duree            TEXT,
    outils           TEXT,

    depart_titre     TEXT,
    depart_texte     TEXT,
    depart_objectif  TEXT,

    demarche_titre   TEXT,
    demarche_intro   TEXT,

    recul_titre      TEXT,

    created_at       TEXT    NOT NULL DEFAULT (datetime('now'))
  )`,

  `CREATE INDEX IF NOT EXISTS idx_projets_affichage ON projets (publie, ordre)`,

  // Un projet peut avoir plusieurs catégories (ex : Développement + Design)
  `CREATE TABLE IF NOT EXISTS projet_categories (
    projet_id    TEXT NOT NULL REFERENCES projets (id)    ON DELETE CASCADE,
    categorie_id TEXT NOT NULL REFERENCES categories (id) ON DELETE CASCADE,
    PRIMARY KEY (projet_id, categorie_id)
  )`,

  `CREATE INDEX IF NOT EXISTS idx_projet_categories_categorie ON projet_categories (categorie_id)`,

  `CREATE TABLE IF NOT EXISTS projet_tags (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    projet_id  TEXT    NOT NULL REFERENCES projets (id) ON DELETE CASCADE,
    ordre      INTEGER NOT NULL DEFAULT 0,
    tag        TEXT    NOT NULL
  )`,

  `CREATE INDEX IF NOT EXISTS idx_projet_tags_projet ON projet_tags (projet_id, ordre)`,

  `CREATE TABLE IF NOT EXISTS projet_etapes (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    projet_id    TEXT    NOT NULL REFERENCES projets (id) ON DELETE CASCADE,
    ordre        INTEGER NOT NULL DEFAULT 0,             -- 1 = « 01 », 2 = « 02 »…
    titre        TEXT    NOT NULL,
    description  TEXT    NOT NULL
  )`,

  `CREATE INDEX IF NOT EXISTS idx_projet_etapes_projet ON projet_etapes (projet_id, ordre)`,

  `CREATE TABLE IF NOT EXISTS projet_apprentissages (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    projet_id  TEXT    NOT NULL REFERENCES projets (id) ON DELETE CASCADE,
    ordre      INTEGER NOT NULL DEFAULT 0,
    icone      TEXT,                                     -- clé d'icône : valide, equipe, accessibilite, code…
    titre      TEXT    NOT NULL,
    texte      TEXT    NOT NULL
  )`,

  `CREATE INDEX IF NOT EXISTS idx_projet_appr_projet ON projet_apprentissages (projet_id, ordre)`,

  // Messages reçus depuis le formulaire de contact
  `CREATE TABLE IF NOT EXISTS messages (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    nom         TEXT    NOT NULL,
    email       TEXT    NOT NULL,
    sujet       TEXT,
    message     TEXT    NOT NULL,
    lu          INTEGER NOT NULL DEFAULT 0,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  )`,

  `CREATE INDEX IF NOT EXISTS idx_messages_date ON messages (created_at)`,
];
