/**
 * src/data/projets-seed.ts
 * Contenu des projets du portfolio. C'est CE FICHIER que tu modifies pour changer un texte,
 * puis tu relances :  bun run db:seed
 *
 * ✅ OrDaily : textes repris tels quels de ta page modèle.
 * ✏️ Les 5 autres : BROUILLONS écrits à partir de ce que tu m'as dit (type, sujet, lien).
 *    Relis-les et réécris-les avec tes mots. Les champs à `null` sont ceux que je ne connais pas :
 *    ils ne s'affichent pas tant que tu ne les remplis pas (année, durée, rôle, outils…).
 *
 * Catégories : "developpement", "communication", "design" (un projet peut en avoir plusieurs).
 * Icônes possibles pour les apprentissages : valide · equipe · accessibilite · code · design · donnees · mobile
 * Images : à déposer dans public/images/projets/<id>/cover.webp (voir `image` ci-dessous).
 */

export interface ProjetSeed {
  /** Nom collé en minuscules : sert d'adresse (/projets/<id>) */
  id: string;
  titre: string;
  type: "groupe" | "solo";
  annee: number | null;
  ordre: number;
  publie: 0 | 1;
  a_la_une: 0 | 1;

  titre_page: string;
  resume: string;
  image: string | null;
  image_alt: string | null;
  lien_url: string | null;
  lien_libelle: string | null;

  contexte: string | null;
  role: string | null;
  equipe: string | null;
  duree: string | null;
  outils: string | null;

  depart_titre: string | null;
  depart_texte: string | null;
  depart_objectif: string | null;

  demarche_titre: string | null;
  demarche_intro: string | null;

  recul_titre: string | null;

  /** developpement · communication · design (plusieurs possibles) */
  categories: string[];
  tags: string[];
  etapes: { titre: string; description: string }[];
  apprentissages: { icone: string; titre: string; texte: string }[];
}

const RECUL = "Ce que j’ai appris — et ce que je retiendrai pour le développement web.";

export const projets: ProjetSeed[] = [
  // ─────────────────────────────────────────────── 1. OrDaily  ✅ (textes de ta page modèle)
  {
    id: "ordaily",
    titre: "OrDaily",
    type: "groupe",
    annee: 2026,
    ordre: 1,
    publie: 1,
    a_la_une: 1,

    titre_page: "OrDaily — concevoir un site d’aide pour les jeunes adultes",
    resume:
      "Un prototype web pensé pour la navigation, la responsivité, l’accessibilité et la facilité de déclinaison, avec une identité visuelle cohérente.",
    image: "/images/projets/ordaily/cover.webp",
    image_alt: "Maquettes du site OrDaily sur ordinateur et sur téléphone",
    lien_url: "https://ordaily.nathan-batista-balanche.fr",
    lien_libelle: "Prototype",

    contexte: "Projet collectif de semestre 2 — BUT MMI 1",
    role: "UX/UI, intégration front-end, accessibilité et tests",
    equipe: "Travail en groupe",
    duree: "4 mois · 4 personnes",
    outils: "Figma, Astro, Tailwind, JavaScript, Pocketbase.",

    depart_titre: "Comment concevoir un site d’aide simple, accessible et utile pour les jeunes adultes ?",
    depart_texte:
      "Le projet consiste à concevoir une architecture web simple, lisible et accessible pour un site d’aide destiné aux jeunes adultes. L’objectif est de structurer les contenus, de prioriser les informations utiles et de préparer un système facile à décliner.",
    depart_objectif:
      "L’objectif est de proposer une navigation claire, des parcours simples, une mise en page responsive et une base technique solide pour une future évolution.",

    demarche_titre: "Structurer le projet par maquettes, intégration, tests et itérations techniques.",
    demarche_intro:
      "Cette démarche met en avant les choix techniques, la structuration du code, les tests et les apprentissages concrets issus du projet.",

    recul_titre: RECUL,

    categories: ["developpement"],
    tags: ["UX/UI Design", "Développement web", "Accessibilité", "Base de données"],
    etapes: [
      {
        titre: "Définir l’architecture",
        description:
          "Définition des pages clés, des parcours, des priorités de contenu et des contraintes techniques pour le prototype.",
      },
      {
        titre: "Concevoir l’interface",
        description:
          "Création d’une charte visuelle, d’un système de composants et d’une maquette de référence pour le prototype.",
      },
      {
        titre: "Intégrer et tester",
        description:
          "Intégration front-end, validation responsive, tests d’accessibilité et itérations sur les parcours principaux.",
      },
      {
        titre: "Livrer et documenter",
        description:
          "Finalisation du prototype, documentation technique, préparation des sources et présentation des choix techniques.",
      },
    ],
    apprentissages: [
      {
        icone: "valide",
        titre: "Documenter la structure et les composants dès le début",
        texte:
          "Une documentation claire des composants, des états et des règles d’usage permet de gagner du temps lors de l’intégration et des tests.",
      },
      {
        icone: "equipe",
        titre: "Tester avec des profils et des contextes d’usage variés",
        texte:
          "Les tests doivent couvrir différents parcours, appareils, navigateurs et profils d’utilisateurs pour valider la robustesse du prototype.",
      },
      {
        icone: "accessibilite",
        titre: "Intégrer l’accessibilité dès la conception et l’intégration",
        texte:
          "Les contrôles, les états, les contrastes et la navigation clavier doivent être pensés dès les maquettes et validés tout au long de l’intégration.",
      },
    ],
  },

  // ─────────────────────────────────────────────── 2. Les Rives du Territoire  ✏️ brouillon
  {
    id: "lesrivesduterritoire",
    titre: "Les Rives du Territoire",
    type: "solo",
    annee: null,
    ordre: 2,
    publie: 1,
    a_la_une: 1,

    titre_page: "Les Rives du Territoire — un site pour un festival fictif",
    resume:
      "Un site événementiel imaginé pour un festival fictif, de la direction artistique à l’intégration.",
    image: "/images/projets/lesrivesduterritoire/cover.webp",
    image_alt: "Aperçu du site Les Rives du Territoire sur ordinateur portable",
    lien_url: "https://lesrivesduterritoire.nathan-batista-balanche.fr/",
    lien_libelle: "Voir le site",

    contexte: "SAÉ de BUT MMI — projet individuel",
    role: "Direction artistique, UI design et intégration",
    equipe: "Projet individuel",
    duree: null,
    outils: null,

    depart_titre: "Comment donner vie à un festival qui n’existe pas, avec un site qui donne envie d’y aller ?",
    depart_texte:
      "Dans le cadre d’une SAÉ, il fallait imaginer un festival fictif et réaliser son site seul, de l’univers visuel jusqu’à la mise en ligne.",
    depart_objectif:
      "L’objectif est de proposer une identité forte et cohérente, un site clair pour présenter l’événement, et une intégration soignée.",

    demarche_titre: "Construire un univers, puis le traduire en un site complet.",
    demarche_intro:
      "Du choix de l’ambiance à l’intégration, chaque étape sert une direction artistique unique.",

    recul_titre: RECUL,

    categories: ["developpement"],
    tags: ["Direction artistique", "UI Design", "Développement web", "Intégration"],
    etapes: [
      {
        titre: "Imaginer le festival",
        description: "Définition du nom, de l’ambiance, du public visé et des informations à présenter.",
      },
      {
        titre: "Créer l’identité visuelle",
        description: "Choix des couleurs, des typographies et des illustrations qui portent l’univers du festival.",
      },
      {
        titre: "Concevoir les maquettes",
        description: "Construction des pages et de la navigation pour présenter clairement l’événement.",
      },
      {
        titre: "Intégrer et publier",
        description: "Intégration du site, vérifications sur différents écrans puis mise en ligne.",
      },
    ],
    apprentissages: [
      {
        icone: "design",
        titre: "Une direction artistique cohérente guide tout le projet",
        texte: "Fixer l’univers visuel dès le départ facilite chaque choix de design et d’intégration ensuite.",
      },
      {
        icone: "valide",
        titre: "Penser les contenus d’un événement",
        texte: "Programme, lieux et informations pratiques doivent être faciles à trouver pour un visiteur pressé.",
      },
      {
        icone: "code",
        titre: "Soigner l’intégration pour servir l’ambiance",
        texte: "Les animations et les détails d’interface renforcent l’univers lorsqu’ils restent maîtrisés.",
      },
    ],
  },

  // ─────────────────────────────────────────────── 3. TiK•TaK  ✏️ brouillon (d'après notre travail commun)
  {
    id: "tiktak",
    titre: "TiK•TaK",
    type: "solo",
    annee: 2026,
    ordre: 3,
    publie: 1,
    a_la_une: 1,

    titre_page: "TiK•TaK — un configurateur de montres personnalisées",
    resume:
      "Un site de montres personnalisables : on compose sa montre, on l’ajoute au panier, puis on retrouve ses créations et ses commandes.",
    image: "/images/projets/tiktak/cover.webp",
    image_alt: "Aperçu du configurateur de montres TiK•TaK",
    lien_url: "https://tiktak.nathan-batista-balanche.fr",
    lien_libelle: "Voir le site",

    contexte: "SAÉ de BUT MMI — projet individuel",
    role: "Maquette, intégration et développement",
    equipe: "Projet individuel",
    duree: null,
    outils: "Astro, Tailwind CSS, SQLite, connexion Google",

    depart_titre: "Comment permettre à chacun de créer sa montre, simplement et avec élégance ?",
    depart_texte:
      "Le projet est un site de montres personnalisées destiné à un public de 25 à 40 ans : des modèles à prix fixe, mais aussi un atelier où l’on choisit couleurs, matériaux et libellés.",
    depart_objectif:
      "L’objectif est de proposer un parcours complet : créer sa montre, la retrouver dans son compte, commander et consulter son historique d’achats.",

    demarche_titre: "Du parcours utilisateur à un site fonctionnel, avec comptes, base de données et commandes.",
    demarche_intro:
      "Le projet avance de la maquette jusqu’au développement, avec une base de données qui garde en mémoire les créations et les commandes.",

    recul_titre: RECUL,

    categories: ["developpement"],
    tags: ["Configurateur", "Direction artistique", "Base de données SQLite", "Connexion Google"],
    etapes: [
      {
        titre: "Définir le parcours",
        description:
          "Cadrage du public, des modèles à prix fixe et du parcours de création, d’achat et de suivi des commandes.",
      },
      {
        titre: "Concevoir l’identité et la maquette",
        description:
          "Direction artistique sombre et sobre, mise en page sur une grille de 12 colonnes et maquette de toutes les pages.",
      },
      {
        titre: "Développer le configurateur",
        description:
          "Un atelier où chaque choix de couleur ou de matériau modifie la montre en direct, avec enregistrement des créations en base SQLite.",
      },
      {
        titre: "Gérer comptes, panier et commandes",
        description:
          "Connexion avec Google, panier, commandes multiples et historique des achats rattachés au compte de l’utilisateur.",
      },
    ],
    apprentissages: [
      {
        icone: "donnees",
        titre: "Penser la base de données avant de coder",
        texte:
          "Définir les tables (utilisateurs, montres, commandes) dès le départ évite de tout refaire quand le projet grandit.",
      },
      {
        icone: "code",
        titre: "Relier l’interface et les données en direct",
        texte:
          "Un configurateur impose que chaque choix soit visible immédiatement, puis sauvegardé de manière fiable.",
      },
      {
        icone: "valide",
        titre: "Authentifier sans compliquer le parcours",
        texte:
          "Une connexion Google simplifie l’inscription tout en permettant de relier créations et commandes à un compte.",
      },
    ],
  },

  // ─────────────────────────────────────────────── 4. Olyvia  ✏️ brouillon
  {
    id: "olyvia",
    titre: "Olyvia",
    type: "groupe",
    annee: null,
    ordre: 4,
    publie: 1,
    a_la_une: 0,

    titre_page: "Olyvia — un site WordPress sur la ménopause",
    resume: "Un site WordPress réalisé en équipe sur le thème de la ménopause.",
    image: "/images/projets/olyvia/cover.webp",
    image_alt: "Aperçu du site Olyvia",
    lien_url: "https://olyvia.lucie-garcia.fr/",
    lien_libelle: "Voir le site",

    contexte: "SAÉ de BUT MMI — projet collectif",
    role: null,
    equipe: "Travail en groupe",
    duree: null,
    outils: "WordPress",

    depart_titre: "Comment parler de la ménopause avec un site clair, accessible et facile à faire vivre ?",
    depart_texte:
      "Dans le cadre d’une SAÉ, l’équipe devait réaliser un site WordPress sur le thème de la ménopause, en travaillant le contenu, la navigation et l’identité visuelle.",
    depart_objectif:
      "L’objectif est de proposer un site lisible, avec des contenus faciles à retrouver et à mettre à jour depuis WordPress.",

    demarche_titre: "Construire ensemble un site WordPress, du contenu à la mise en ligne.",
    demarche_intro:
      "Le travail en équipe a demandé de partager les tâches et de garder une cohérence entre les contenus, le design et la technique.",

    recul_titre: RECUL,

    categories: ["developpement"],
    tags: ["WordPress", "Gestion de contenu", "Travail en équipe"],
    etapes: [
      {
        titre: "Cadrer le sujet",
        description: "Définition du public, des contenus à traiter et de l’organisation du site.",
      },
      {
        titre: "Concevoir le design",
        description: "Création de l’identité visuelle et des maquettes des pages principales.",
      },
      {
        titre: "Mettre en place WordPress",
        description: "Configuration du site, intégration du design et création des pages et des contenus.",
      },
      {
        titre: "Relire et publier",
        description: "Vérification des contenus et du rendu, puis mise en ligne du site.",
      },
    ],
    apprentissages: [
      {
        icone: "equipe",
        titre: "Se répartir clairement les rôles",
        texte: "Dans un projet collectif, savoir qui fait quoi évite les doublons et garde un résultat cohérent.",
      },
      {
        icone: "code",
        titre: "Utiliser un CMS pour gagner en autonomie",
        texte: "WordPress permet de mettre à jour le contenu sans toucher au code, à condition de bien structurer le site.",
      },
      {
        icone: "valide",
        titre: "Soigner la lisibilité des contenus",
        texte: "Sur un sujet de santé, la clarté des textes et de la navigation compte autant que le design.",
      },
    ],
  },

  // ─────────────────────────────────────────────── 5. Trajectory  ✏️ brouillon
  {
    id: "trajectory",
    titre: "Trajectory",
    type: "solo",
    annee: null,
    ordre: 5,
    publie: 1,
    a_la_une: 0,

    titre_page: "Trajectory — raconter l’effet Matilda sur mobile",
    resume:
      "Un site pensé d’abord pour le mobile, consacré à une femme dont le travail a été sous-reconnu : l’effet Matilda.",
    image: "/images/projets/trajectory/cover.webp",
    image_alt: "Aperçu du site Trajectory sur téléphone",
    lien_url: "https://trajectory.nathan-batista-balanche.fr/fr/",
    lien_libelle: "Voir le site",

    contexte: "SAÉ de BUT MMI — projet individuel",
    role: "Conception, design et intégration",
    equipe: "Projet individuel",
    duree: null,
    outils: null,

    depart_titre: "Comment raconter l’effet Matilda avec un site pensé d’abord pour le mobile ?",
    depart_texte:
      "Pour ce projet individuel, il fallait réaliser un site sur une femme victime de l’effet Matilda, c’est-à-dire dont les travaux ont été sous-reconnus. Le site est conçu en mobile first : on part de l’écran du téléphone pour construire les versions plus larges.",
    depart_objectif:
      "L’objectif est de proposer une lecture fluide sur mobile, une mise en page claire et une expérience cohérente sur tous les écrans.",

    demarche_titre: "Partir du téléphone pour construire une histoire lisible sur tous les écrans.",
    demarche_intro:
      "Le choix du mobile first a guidé la conception des maquettes, l’intégration et les tests.",

    recul_titre: RECUL,

    categories: ["developpement"],
    tags: ["Mobile first", "UI Design", "Développement web", "Narration"],
    etapes: [
      {
        titre: "Comprendre le sujet",
        description: "Recherche sur l’effet Matilda et sur le parcours choisi, pour sélectionner les contenus clés.",
      },
      {
        titre: "Concevoir l’interface mobile",
        description: "Maquettes pensées d’abord pour le téléphone, puis adaptées aux tablettes et aux ordinateurs.",
      },
      {
        titre: "Intégrer en mobile first",
        description: "Intégration en partant des petits écrans, avec des styles qui s’enrichissent sur les grandes largeurs.",
      },
      {
        titre: "Tester et publier",
        description: "Vérification sur plusieurs écrans, corrections, puis mise en ligne du site.",
      },
    ],
    apprentissages: [
      {
        icone: "mobile",
        titre: "Partir du mobile simplifie les choix",
        texte: "Commencer par le plus petit écran oblige à prioriser les contenus essentiels.",
      },
      {
        icone: "design",
        titre: "Une narration claire guide la lecture",
        texte: "Le rythme des sections et la hiérarchie des titres aident à raconter une histoire sur un petit écran.",
      },
      {
        icone: "valide",
        titre: "Tester sur de vrais appareils",
        texte: "Les écrans réels révèlent des problèmes de lisibilité et de zones tactiles que l’émulation ne montre pas toujours.",
      },
    ],
  },

  // ─────────────────────────────────────────────── 6. Étude de données sur l'IA  ✏️ brouillon
  {
    id: "coutdeliagenerative",
    titre: "Le vrai coût de l’IA générative",
    type: "groupe",
    annee: null,
    ordre: 6,
    publie: 1,
    a_la_une: 0,

    titre_page: "Le vrai coût de l’IA générative — une étude de données",
    resume:
      "Un projet collectif d’étude de données autour du coût de l’IA générative, présenté sous la forme d’un site.",
    image: "/images/projets/coutdeliagenerative/cover.webp",
    image_alt: "Aperçu du site Le vrai coût de l’IA générative",
    lien_url: "https://batistabalanche-gosmat-sae303-gr17.netlify.app/",
    lien_libelle: "Voir le site",

    contexte: "SAÉ 303 de BUT MMI — projet collectif",
    role: null,
    equipe: "Travail en groupe",
    duree: null,
    outils: null,

    depart_titre: "Comment rendre visible le coût de l’IA générative à partir de données ?",
    depart_texte:
      "Ce projet collectif consistait à analyser des données pour comprendre le coût de l’IA générative, puis à les rendre lisibles sur un site.",
    depart_objectif:
      "L’objectif est de transformer des données brutes en un propos clair et vérifiable pour un public non spécialiste.",

    demarche_titre: "Des données brutes à un récit clair, étape par étape.",
    demarche_intro:
      "Le projet suit un fil rigoureux : chercher et nettoyer les données, choisir des indicateurs, puis les présenter.",

    recul_titre: RECUL,

    categories: ["developpement"],
    tags: ["Étude de données", "Visualisation", "Travail en équipe", "Développement web"],
    etapes: [
      {
        titre: "Collecter et nettoyer les données",
        description: "Recherche de sources fiables, récupération des jeux de données et mise en forme pour l’analyse.",
      },
      {
        titre: "Analyser et choisir les indicateurs",
        description: "Sélection des chiffres les plus parlants pour répondre à la question posée.",
      },
      {
        titre: "Concevoir les visualisations",
        description: "Choix des graphiques adaptés à chaque donnée, lisibles pour un public non spécialiste.",
      },
      {
        titre: "Publier et présenter",
        description: "Mise en ligne du site et présentation des résultats et des sources.",
      },
    ],
    apprentissages: [
      {
        icone: "donnees",
        titre: "Citer et vérifier chaque source",
        texte: "Un propos chiffré n’est crédible que si chaque donnée peut être retrouvée et vérifiée.",
      },
      {
        icone: "design",
        titre: "Choisir la bonne représentation",
        texte: "Le type de graphique change la compréhension : il faut l’adapter à la question et au public.",
      },
      {
        icone: "equipe",
        titre: "Travailler en équipe sur un même jeu de données",
        texte: "Se mettre d’accord sur les formats et les règles de nettoyage évite les erreurs au moment de l’assemblage.",
      },
    ],
  },
];
