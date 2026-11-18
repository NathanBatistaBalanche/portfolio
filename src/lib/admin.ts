/**
 * src/lib/admin.ts
 * Authentification de l'espace admin (/admin).
 *
 * Les identifiants ne sont JAMAIS écrits dans le code : ils viennent du fichier .env
 *   ADMIN_USER=ton-identifiant
 *   ADMIN_PASSWORD=un-mot-de-passe-long
 *   ADMIN_SECRET=une-longue-chaine-aleatoire   (sert à signer le cookie de connexion)
 *
 * Générer un secret :  bun -e "console.log(crypto.randomUUID() + crypto.randomUUID())"
 * Si une de ces variables manque, la connexion est refusée.
 */
import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const COOKIE_SESSION = "admin_session";
export const DUREE_SESSION_S = 60 * 60 * 12; // 12 h

const env = (cle: string): string => String(process.env[cle] ?? import.meta.env?.[cle] ?? "");

export function adminConfigure(): boolean {
  return Boolean(env("ADMIN_USER") && env("ADMIN_PASSWORD") && env("ADMIN_SECRET"));
}

const empreinte = (texte: string) => createHash("sha256").update(texte).digest();
const egal = (a: string, b: string) => timingSafeEqual(empreinte(a), empreinte(b));

export function identifiantsValides(utilisateur: string, motDePasse: string): boolean {
  if (!adminConfigure()) return false;
  // Les deux comparaisons sont toujours faites (pas de sortie anticipée)
  const u = egal(utilisateur, env("ADMIN_USER"));
  const m = egal(motDePasse, env("ADMIN_PASSWORD"));
  return u && m;
}

const signer = (expiration: string) => createHmac("sha256", env("ADMIN_SECRET")).update(expiration).digest("hex");

/** Valeur du cookie : « expiration.signature » */
export function creerSession(): string {
  const expiration = String(Date.now() + DUREE_SESSION_S * 1000);
  return `${expiration}.${signer(expiration)}`;
}

export function sessionValide(valeur: string | undefined): boolean {
  if (!valeur || !adminConfigure()) return false;
  const [expiration, signature] = valeur.split(".");
  if (!expiration || !signature || Number(expiration) < Date.now()) return false;
  return egal(signature, signer(expiration));
}

// ---------- Limite de tentatives de connexion : 5 par IP toutes les 15 minutes ----------
const FENETRE_MS = 15 * 60 * 1000;
const MAX_ECHECS = 5;
const echecs = new Map<string, number[]>();

const recents = (ip: string) => (echecs.get(ip) ?? []).filter((t) => Date.now() - t < FENETRE_MS);

export const tropDEchecs = (ip: string) => recents(ip).length >= MAX_ECHECS;
export const noterEchec = (ip: string) => echecs.set(ip, [...recents(ip), Date.now()]);
export const effacerEchecs = (ip: string) => echecs.delete(ip);