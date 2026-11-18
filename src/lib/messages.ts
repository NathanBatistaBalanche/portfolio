/**
 * src/lib/messages.ts
 * Messages envoyés depuis le formulaire de contact.
 *
 *   enregistrerMessage({ nom, email, sujet, message })  → id du message
 *   listerMessages()                                    → du plus récent au plus ancien
 *   marquerLu(id)
 *
 * La validation du formulaire (email valide, anti-spam…) se fait dans l'endpoint
 * qui appelle ces fonctions ; ici on garde seulement des limites de longueur de sécurité.
 */
import { db } from "./db";

export interface NouveauMessage {
  nom: string;
  email: string;
  sujet?: string | null;
  message: string;
}

export interface Message {
  id: number;
  nom: string;
  email: string;
  sujet: string | null;
  message: string;
  lu: boolean;
  creeLe: string; // « 2026-11-18 21:59:00 » (heure UTC)
}

const LIMITES = { nom: 100, email: 254, sujet: 150, message: 5000 };

export function enregistrerMessage(donnees: NouveauMessage): number {
  const nom = donnees.nom.trim();
  const email = donnees.email.trim();
  const sujet = donnees.sujet?.trim() || null;
  const message = donnees.message.trim();

  if (!nom || !email || !message) throw new Error("Nom, email et message sont obligatoires.");
  if (
    nom.length > LIMITES.nom ||
    email.length > LIMITES.email ||
    (sujet && sujet.length > LIMITES.sujet) ||
    message.length > LIMITES.message
  ) {
    throw new Error("Un des champs est trop long.");
  }

  const resultat = db
    .prepare("INSERT INTO messages (nom, email, sujet, message) VALUES (?, ?, ?, ?)")
    .run(nom, email, sujet, message);

  return Number(resultat.lastInsertRowid);
}

export function listerMessages(options: { nonLusSeulement?: boolean } = {}): Message[] {
  const filtre = options.nonLusSeulement ? "WHERE lu = 0" : "";
  const lignes = db.prepare(`SELECT * FROM messages ${filtre} ORDER BY created_at DESC, id DESC`).all() as Record<
    string,
    any
  >[];

  return lignes.map((l) => ({
    id: l.id,
    nom: l.nom,
    email: l.email,
    sujet: l.sujet,
    message: l.message,
    lu: l.lu === 1,
    creeLe: l.created_at,
  }));
}

export function marquerLu(id: number): void {
  db.prepare("UPDATE messages SET lu = 1 WHERE id = ?").run(id);
}

export function marquerNonLu(id: number): void {
  db.prepare("UPDATE messages SET lu = 0 WHERE id = ?").run(id);
}

export function marquerTousLus(): void {
  db.prepare("UPDATE messages SET lu = 1 WHERE lu = 0").run();
}

export function supprimerMessage(id: number): void {
  db.prepare("DELETE FROM messages WHERE id = ?").run(id);
}

export function compterMessages(): { total: number; nonLus: number } {
  const l = db.prepare("SELECT COUNT(*) AS total, COALESCE(SUM(lu = 0), 0) AS nonLus FROM messages").get() as {
    total: number;
    nonLus: number;
  };
  return { total: l.total, nonLus: l.nonLus };
}