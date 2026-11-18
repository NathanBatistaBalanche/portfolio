/**
 * src/pages/api/contact.ts
 * Reçoit le formulaire de /contact et l'enregistre dans la table `messages`.
 *
 *  - avec JavaScript : le formulaire est envoyé via fetch, on répond en JSON
 *  - sans JavaScript : le navigateur envoie le formulaire normalement, on redirige vers /contact
 */
import type { APIRoute } from "astro";
import { enregistrerMessage } from "../../lib/messages";

export const prerender = false;

// ---------- Anti-spam ----------
// Limite simple en mémoire : 3 messages par adresse IP toutes les 10 minutes.
const FENETRE_MS = 10 * 60 * 1000;
const MAX_ENVOIS = 3;
const envois = new Map<string, number[]>();

function trop_d_envois(ip: string): boolean {
  const maintenant = Date.now();
  const recents = (envois.get(ip) ?? []).filter((t) => maintenant - t < FENETRE_MS);
  if (recents.length >= MAX_ENVOIS) {
    envois.set(ip, recents);
    return true;
  }
  envois.set(ip, [...recents, maintenant]);
  return false;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function reponse(requete: Request, ok: boolean, message: string, status: number) {
  const veutJson = requete.headers.get("accept")?.includes("application/json");
  if (veutJson) {
    return new Response(JSON.stringify({ ok, message }), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }
  const cible = ok ? "/contact?envoye=1" : `/contact?erreur=${encodeURIComponent(message)}`;
  return new Response(null, { status: 303, headers: { Location: cible } });
}

// Adresse IP : certains adapters ne fournissent pas clientAddress (il lève alors une erreur).
function adresseIp(requete: Request, contexte: () => string): string {
  const transmis = requete.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (transmis) return transmis;
  try {
    return contexte();
  } catch {
    return "inconnue";
  }
}

export const POST: APIRoute = async (contexte) => {
  const { request } = contexte;
  try {
    return await traiter(request, () => contexte.clientAddress);
  } catch (erreur) {
    console.error("[contact] erreur :", erreur);
    return reponse(request, false, "Erreur du serveur : le message n'a pas pu être enregistré.", 500);
  }
};

async function traiter(request: Request, ip: () => string): Promise<Response> {
  const donnees = await request.formData();
  const champ = (nom: string) => String(donnees.get(nom) ?? "").trim();

  // Champ piège « site_web » : invisible pour les humains, rempli par les robots.
  // On répond « OK » sans rien enregistrer pour ne pas leur donner d'indice.
  if (champ("site_web")) return reponse(request, true, "Message envoyé.", 200);

  const nom = champ("nom");
  const email = champ("email");
  const sujet = champ("sujet");
  const message = champ("message");

  if (!nom || !email || !message) {
    return reponse(request, false, "Le nom, l'email et le message sont obligatoires.", 400);
  }
  if (!EMAIL.test(email)) {
    return reponse(request, false, "L'adresse email n'est pas valide.", 400);
  }
  if (trop_d_envois(adresseIp(request, ip))) {
    return reponse(request, false, "Trop de messages envoyés. Réessaie dans quelques minutes.", 429);
  }

  try {
    enregistrerMessage({ nom, email, sujet, message });
  } catch (erreur) {
    const texte = erreur instanceof Error ? erreur.message : "Une erreur est survenue.";
    return reponse(request, false, texte, 400);
  }

  return reponse(request, true, "Message envoyé. Je te réponds sous 48 h.", 200);
}