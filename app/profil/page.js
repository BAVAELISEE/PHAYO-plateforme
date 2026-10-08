"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { regionsCameroun } from "@/lib/cameroun";

const ROLES = { client: "Client", acteur: "Acteur", admin: "Admin" };

export default function Profil() {
  const supabase = createClient();
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("client");
  const [chargement, setChargement] = useState(true);

  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [region, setRegion] = useState("");
  const [departement, setDepartement] = useState("");

  const [enregistre, setEnregistre] = useState(false);
  const [erreur, setErreur] = useState("");
  const [copie, setCopie] = useState(false);

  const [confirmationSuppression, setConfirmationSuppression] = useState(false);
  const [suppression, setSuppression] = useState(false);

  useEffect(() => {
    async function charger() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setChargement(false); return; }
      setUserId(user.id);
      setEmail(user.email || "");

      const { data } = await supabase
        .from("profiles")
        .select("nom, telephone, region, departement, role")
        .eq("id", user.id)
        .single();

      setNom(data?.nom || "");
      setTelephone(data?.telephone || "");
      setRegion(data?.region || "");
      setDepartement(data?.departement || "");
      setRole(data?.role || "client");
      setChargement(false);
    }
    charger();
  }, []);

  function handleRegionChange(e) {
    setRegion(e.target.value);
    setDepartement("");
  }

  async function enregistrer(e) {
    e.preventDefault();
    setErreur("");
    setEnregistre(false);

    const { error } = await supabase
      .from("profiles")
      .update({ nom, telephone, region, departement })
      .eq("id", userId);

    if (error) {
      setErreur(error.message);
      return;
    }
    setEnregistre(true);
  }

  const texteDePartage = "Découvrez PHAYO : un site, tous les services.";

  async function partager() {
    const url = window.location.origin;
    if (navigator.share) {
      try {
        await navigator.share({ title: "PHAYO", text: texteDePartage, url });
      } catch {
        /* partage annulé */
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopie(true);
      setTimeout(() => setCopie(false), 2500);
    }
  }

  async function copierLien() {
    await navigator.clipboard.writeText(window.location.origin);
    setCopie(true);
    setTimeout(() => setCopie(false), 2500);
  }

  async function deconnexion() {
    await supabase.auth.signOut();
    router.push("/");
  }

  async function supprimerCompte() {
    setSuppression(true);
    const { error } = await supabase.from("profiles").delete().eq("id", userId);

    if (error) {
      setErreur(error.message);
      setSuppression(false);
      return;
    }

    await supabase.auth.signOut();
    router.push("/");
  }

  if (chargement) {
    return <p className="max-w-3xl mx-auto px-6 py-16 text-sm text-slate">Chargement...</p>;
  }

  if (!userId) {
    return (
      <section className="max-w-md mx-auto px-6 py-20 text-center">
        <div className="carte p-10">
          <p className="font-display font-bold text-xl">Connectez-vous</p>
          <p className="text-sm text-slate mt-2">Vous devez être connecté pour accéder à votre profil.</p>
          <Link href="/login" className="btn-principal inline-block mt-6">Se connecter</Link>
        </div>
      </section>
    );
  }

  const initiales = (nom || email || "?")
    .split(" ")
    .map((m) => m[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const lienDashboard = role === "acteur" ? "/acteur/dashboard" : role === "admin" ? "/admin/dashboard" : "/client/dashboard";
  const lienWhatsApp = `https://wa.me/?text=${encodeURIComponent(
    texteDePartage + " " + (typeof window !== "undefined" ? window.location.origin : "")
  )}`;

  return (
    <section className="max-w-3xl mx-auto px-6 py-14">
      {/* En-tête du profil */}
      <div className="carte p-6 md:p-8 flex flex-col sm:flex-row sm:items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-ink text-amber grid place-items-center font-display font-bold text-2xl shrink-0">
          {initiales}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-display font-bold text-2xl truncate">{nom || "Mon profil"}</h1>
          <p className="text-sm text-slate truncate">{email}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="badge bg-amber/15 text-amber">{ROLES[role]}</span>
            {region && <span className="badge bg-slate/10 text-slate">{region}{departement ? ` · ${departement}` : ""}</span>}
          </div>
        </div>
        <div className="flex gap-2 sm:flex-col">
          <Link href={lienDashboard} className="btn-principal !px-4 !py-2 text-center">Mon espace</Link>
          <button onClick={deconnexion} className="btn-secondaire !px-4 !py-2">Déconnexion</button>
        </div>
      </div>

      {/* Informations */}
      <form onSubmit={enregistrer} className="carte p-6 md:p-8 mt-6 grid gap-4">
        <h2 className="font-display font-bold text-lg">Mes coordonnées</h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-slate">Nom complet</label>
            <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} className="champ mt-1" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate">Téléphone</label>
            <input type="tel" value={telephone} onChange={(e) => setTelephone(e.target.value)} className="champ mt-1" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate">Région</label>
            <select value={region} onChange={handleRegionChange} className="champ mt-1">
              <option value="">—</option>
              {Object.keys(regionsCameroun).map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate">Département</label>
            <select
              value={departement} onChange={(e) => setDepartement(e.target.value)}
              disabled={!region} className="champ mt-1 disabled:bg-slate/10"
            >
              <option value="">—</option>
              {(regionsCameroun[region] || []).map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {erreur && <p className="text-sm text-red-600">{erreur}</p>}
        {enregistre && <p className="text-sm text-verified">Enregistré ✓</p>}

        <button type="submit" className="btn-principal w-fit">Enregistrer</button>
      </form>

      {/* Partager */}
      <div className="carte p-6 md:p-8 mt-6">
        <h2 className="font-display font-bold text-lg">Partager PHAYO</h2>
        <p className="text-sm text-slate mt-1">Faites découvrir la plateforme à vos proches.</p>
        <div className="flex flex-wrap gap-3 mt-4">
          <button onClick={partager} className="btn-principal !py-2">Partager</button>
          <a href={lienWhatsApp} target="_blank" rel="noopener noreferrer" className="btn-secondaire !py-2">
            Envoyer sur WhatsApp
          </a>
          <button onClick={copierLien} className="btn-secondaire !py-2">
            {copie ? "Lien copié ✓" : "Copier le lien"}
          </button>
        </div>
      </div>

      {/* Raccourcis */}
      <div className="grid sm:grid-cols-2 gap-4 mt-6">
        <Link href="/articles/ajouter" className="carte carte-hover p-5">
          <p className="font-display font-bold">Ajouter un article</p>
          <p className="text-xs text-slate mt-1">Publiez un article avec photos.</p>
        </Link>
        <Link href="/services" className="carte carte-hover p-5">
          <p className="font-display font-bold">Parcourir les services</p>
          <p className="text-xs text-slate mt-1">Trouvez un acteur près de chez vous.</p>
        </Link>
      </div>

      {/* Zone dangereuse */}
      <div className="mt-12 border border-red-200 bg-red-50/50 rounded-2xl p-6">
        <h2 className="font-display font-bold text-red-600">Zone dangereuse</h2>
        <p className="text-xs text-slate mt-1 mb-4">
          La suppression de votre compte efface votre profil, vos services, vos articles
          et vos demandes. Cette action est irréversible.
        </p>

        {!confirmationSuppression ? (
          <button
            onClick={() => setConfirmationSuppression(true)}
            className="border border-red-300 text-red-600 text-sm font-medium px-5 py-2 rounded-full bg-white"
          >
            Supprimer mon compte
          </button>
        ) : (
          <div className="grid gap-3">
            <p className="text-sm text-red-600 font-medium">Êtes-vous sûr ? Cette action est définitive.</p>
            <div className="flex gap-2">
              <button
                onClick={supprimerCompte}
                disabled={suppression}
                className="bg-red-600 text-white text-sm font-medium px-5 py-2 rounded-full disabled:opacity-50"
              >
                {suppression ? "Suppression..." : "Oui, supprimer définitivement"}
              </button>
              <button onClick={() => setConfirmationSuppression(false)} className="btn-secondaire !py-2">
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
