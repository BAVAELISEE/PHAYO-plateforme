"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { domainesServices } from "@/lib/data";

export default function ActeurDashboard() {
  const supabase = createClient();
  const [userId, setUserId] = useState(null);
  const [mesServices, setMesServices] = useState([]);
  const [mesArticles, setMesArticles] = useState([]);
  const [demandesRecues, setDemandesRecues] = useState([]);
  const [chargement, setChargement] = useState(true);

  const [domaine, setDomaine] = useState("");
  const [domainePersonnalise, setDomainePersonnalise] = useState("");
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [telephone, setTelephone] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState("");

  const domaineFinal = domaine === "autre" ? domainePersonnalise.trim() : domaine;

  useEffect(() => {
    async function charger() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setChargement(false);
        return;
      }
      setUserId(user.id);

      const { data } = await supabase
        .from("services")
        .select("*")
        .eq("acteur_id", user.id)
        .order("created_at", { ascending: false });
      setMesServices(data || []);

      const { data: articles } = await supabase
        .from("articles")
        .select("*")
        .eq("auteur_id", user.id)
        .order("created_at", { ascending: false });
      setMesArticles(articles || []);

      const { data: demandes } = await supabase
        .from("demandes")
        .select("*, services (titre, domaine), profiles:client_id (nom, region, departement)")
        .eq("acteur_id", user.id)
        .order("created_at", { ascending: false });
      setDemandesRecues(demandes || []);

      setChargement(false);
    }
    charger();
  }, []);

  async function changerStatut(id, statut) {
    await supabase.from("demandes").update({ statut }).eq("id", id);
    setDemandesRecues((prev) => prev.map((d) => (d.id === id ? { ...d, statut } : d)));
  }

  async function ajouterService(e) {
    e.preventDefault();
    setErreur("");

    if (!domaineFinal || !titre || !telephone) {
      setErreur("Merci de remplir au moins le domaine, le titre et le téléphone.");
      return;
    }

    setEnvoi(true);

    const { data, error } = await supabase
      .from("services")
      .insert({ acteur_id: userId, type: "distance", domaine: domaineFinal, titre, description, telephone })
      .select()
      .single();

    setEnvoi(false);

    if (error) {
      setErreur(error.message);
      return;
    }

    setMesServices([data, ...mesServices]);
    setTitre(""); setDescription(""); setDomaine(""); setDomainePersonnalise(""); setTelephone("");
  }

  async function supprimerService(id) {
    await supabase.from("services").delete().eq("id", id);
    setMesServices((prev) => prev.filter((s) => s.id !== id));
  }

  async function supprimerArticle(id) {
    await supabase.from("articles").delete().eq("id", id);
    setMesArticles((prev) => prev.filter((a) => a.id !== id));
  }

  if (chargement) {
    return <p className="max-w-6xl mx-auto px-6 py-16 text-sm text-slate">Chargement...</p>;
  }

  if (!userId) {
    return (
      <section className="max-w-md mx-auto px-6 py-20 text-center">
        <div className="carte p-10">
          <p className="font-display font-bold text-xl">Connectez-vous</p>
          <p className="text-sm text-slate mt-2">Vous devez être connecté en tant qu'acteur pour accéder à cette page.</p>
          <Link href="/login" className="btn-principal inline-block mt-6">Se connecter</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-6 py-14">
      <span className="font-mono text-xs text-amber uppercase tracking-widest">Espace acteur</span>
      <h1 className="font-display font-bold text-4xl mt-2">Mes services</h1>

      <div className="grid grid-cols-3 gap-4 mt-8 max-w-xl">
        <div className="carte p-4">
          <p className="text-2xl font-display font-bold">{mesServices.length}</p>
          <p className="text-xs text-slate">services</p>
        </div>
        <div className="carte p-4">
          <p className="text-2xl font-display font-bold">{demandesRecues.length}</p>
          <p className="text-xs text-slate">demandes</p>
        </div>
        <div className="carte p-4">
          <p className="text-2xl font-display font-bold">{mesArticles.length}</p>
          <p className="text-xs text-slate">articles</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-10 mt-12">
        <div>
          <h2 className="font-display font-bold text-xl mb-4">Ajouter un service</h2>
          <form onSubmit={ajouterService} className="carte p-6 grid gap-4">
            <select required value={domaine} onChange={(e) => setDomaine(e.target.value)} className="champ">
              <option value="">Choisir un domaine</option>
              {domainesServices.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
              <option value="autre">Autre (préciser)</option>
            </select>

            {domaine === "autre" && (
              <input
                type="text" placeholder="Précisez votre domaine" required
                value={domainePersonnalise} onChange={(e) => setDomainePersonnalise(e.target.value)}
                className="champ"
              />
            )}

            <input
              type="text" placeholder="Titre du service" required
              value={titre} onChange={(e) => setTitre(e.target.value)} className="champ"
            />
            <textarea
              placeholder="Description (optionnel)" rows={3}
              value={description} onChange={(e) => setDescription(e.target.value)} className="champ"
            />
            <input
              type="tel" placeholder="Votre numéro pour ce service" required
              value={telephone} onChange={(e) => setTelephone(e.target.value)} className="champ"
            />

            {erreur && <p className="text-sm text-red-600">{erreur}</p>}
            <button type="submit" disabled={envoi} className="btn-principal">
              {envoi ? "Ajout..." : "Ajouter le service"}
            </button>
          </form>
        </div>

        <div>
          <h2 className="font-display font-bold text-xl mb-4">Mes services proposés</h2>
          {mesServices.length === 0 && (
            <p className="text-sm text-slate">Vous n'avez pas encore ajouté de service.</p>
          )}
          <div className="grid gap-4">
            {mesServices.map((s) => (
              <div key={s.id} className="carte p-5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-amber">{s.domaine}</span>
                  <span className={`badge ${s.verifie ? "bg-verified/10 text-verified" : "bg-slate/10 text-slate"}`}>
                    {s.verifie ? "Vérifié" : "En attente de vérification"}
                  </span>
                </div>
                <h3 className="font-display font-bold mt-2">{s.titre}</h3>
                {s.description && <p className="text-sm text-slate mt-1">{s.description}</p>}
                {s.telephone && <p className="text-xs text-slate mt-2">📞 {s.telephone}</p>}
                <button
                  onClick={() => supprimerService(s.id)}
                  className="mt-3 text-xs font-medium text-red-600 hover:underline"
                >
                  Supprimer ce service
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mes articles */}
      <div className="mt-14">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-xl">Mes articles</h2>
          <Link href="/articles/ajouter" className="btn-secondaire !py-2">+ Ajouter un article</Link>
        </div>
        {mesArticles.length === 0 && (
          <p className="text-sm text-slate">Vous n'avez pas encore ajouté d'article.</p>
        )}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          {mesArticles.map((a) => (
            <div key={a.id} className="carte overflow-hidden">
              {a.photos?.[0] && (
                <img src={a.photos[0]} alt={a.nom} className="w-full h-36 object-cover" />
              )}
              <div className="p-4">
                <h3 className="font-display font-bold">{a.nom}</h3>
                <button
                  onClick={() => supprimerArticle(a.id)}
                  className="mt-2 text-xs font-medium text-red-600 hover:underline"
                >
                  Supprimer cet article
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Demandes reçues */}
      <div className="mt-14">
        <h2 className="font-display font-bold text-xl mb-4">Demandes reçues</h2>
        {demandesRecues.length === 0 && (
          <p className="text-sm text-slate">Aucune demande pour le moment.</p>
        )}
        <div className="grid md:grid-cols-2 gap-5">
          {demandesRecues.map((d) => (
            <div key={d.id} className="carte p-5">
              <span className="font-mono text-xs text-amber">{d.services?.domaine}</span>
              <h3 className="font-display font-bold mt-1">{d.services?.titre}</h3>
              <p className="text-xs text-slate mt-2">
                Client : {d.profiles?.nom || "—"} — {d.profiles?.region}, {d.profiles?.departement}
              </p>
              {d.telephone && (
                <a href={`tel:${d.telephone}`} className="inline-block mt-2 text-sm font-medium text-verified">
                  📞 {d.telephone}
                </a>
              )}
              <select
                value={d.statut}
                onChange={(e) => changerStatut(d.id, e.target.value)}
                className="champ mt-3"
              >
                <option value="en_attente">En attente</option>
                <option value="en_cours">En cours</option>
                <option value="termine">Terminé</option>
              </select>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
