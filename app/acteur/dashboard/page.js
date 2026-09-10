"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { servicesDistance, servicesPresentiels } from "@/lib/data";

export default function ActeurDashboard() {
  const supabase = createClient();
  const [userId, setUserId] = useState(null);
  const [mesServices, setMesServices] = useState([]);
  const [demandesRecues, setDemandesRecues] = useState([]);
  const [chargement, setChargement] = useState(true);

  // Formulaire d'ajout
  const [type, setType] = useState("distance");
  const [domaine, setDomaine] = useState("");
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState("");

  const domainesDisponibles = (type === "distance" ? servicesDistance : servicesPresentiels).map(
    (s) => s.nom
  );

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
    setDemandesRecues((prev) =>
      prev.map((d) => (d.id === id ? { ...d, statut } : d))
    );
  }

  async function ajouterService(e) {
    e.preventDefault();
    setErreur("");

    if (!domaine || !titre) {
      setErreur("Merci de remplir au moins le domaine et le titre.");
      return;
    }

    setEnvoi(true);

    const { data, error } = await supabase
      .from("services")
      .insert({
        acteur_id: userId,
        type,
        domaine,
        titre,
        description,
      })
      .select()
      .single();

    setEnvoi(false);

    if (error) {
      setErreur(error.message);
      return;
    }

    setMesServices([data, ...mesServices]);
    setTitre("");
    setDescription("");
    setDomaine("");
  }

  if (chargement) {
    return <p className="max-w-6xl mx-auto px-6 py-16 text-sm text-slate">Chargement...</p>;
  }

  if (!userId) {
    return (
      <p className="max-w-6xl mx-auto px-6 py-16 text-sm text-slate">
        Vous devez être connecté en tant qu'acteur pour accéder à cette page.
      </p>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <span className="font-mono text-xs text-amber uppercase tracking-widest">Espace acteur</span>
      <h1 className="font-display font-bold text-3xl mt-2 mb-10">Mes services</h1>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Formulaire d'ajout */}
        <div>
          <h2 className="font-display font-bold text-lg mb-4">Ajouter un service</h2>
          <form onSubmit={ajouterService} className="grid gap-4">
            <div className="flex gap-2">
              {["distance", "presentiel"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => { setType(t); setDomaine(""); }}
                  className={`flex-1 py-2 rounded-full text-sm font-medium border ${
                    type === t ? "bg-ink text-paper border-ink" : "border-ink/20 text-slate"
                  }`}
                >
                  {t === "distance" ? "À distance" : "Présentiel"}
                </button>
              ))}
            </div>

            <select
              required value={domaine} onChange={(e) => setDomaine(e.target.value)}
              className="border border-ink/20 rounded-lg px-4 py-3 text-sm bg-white"
            >
              <option value="">Choisir un domaine</option>
              {domainesDisponibles.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <input
              type="text" placeholder="Titre du service" required
              value={titre} onChange={(e) => setTitre(e.target.value)}
              className="border border-ink/20 rounded-lg px-4 py-3 text-sm"
            />
            <textarea
              placeholder="Description (optionnel)" rows={3}
              value={description} onChange={(e) => setDescription(e.target.value)}
              className="border border-ink/20 rounded-lg px-4 py-3 text-sm"
            />

            {erreur && <p className="text-sm text-red-600">{erreur}</p>}
            <button
              type="submit" disabled={envoi}
              className="bg-ink text-paper rounded-full py-3 text-sm font-medium disabled:opacity-50"
            >
              {envoi ? "Ajout..." : "Ajouter le service"}
            </button>
          </form>
        </div>

        {/* Liste des services */}
        <div>
          <h2 className="font-display font-bold text-lg mb-4">Mes services proposés</h2>
          {mesServices.length === 0 && (
            <p className="text-sm text-slate">Vous n'avez pas encore ajouté de service.</p>
          )}
          <div className="grid gap-4">
            {mesServices.map((s) => (
              <div key={s.id} className="border border-ink/10 rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-amber">{s.domaine}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      s.verifie ? "bg-verified/10 text-verified" : "bg-slate/10 text-slate"
                    }`}
                  >
                    {s.verifie ? "Vérifié" : "En attente de vérification"}
                  </span>
                </div>
                <h3 className="font-display font-bold mt-2">{s.titre}</h3>
                {s.description && <p className="text-sm text-slate mt-1">{s.description}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Demandes reçues */}
      <div className="mt-16">
        <h2 className="font-display font-bold text-lg mb-4">Demandes reçues</h2>
        {demandesRecues.length === 0 && (
          <p className="text-sm text-slate">Aucune demande pour le moment.</p>
        )}
        <div className="grid md:grid-cols-2 gap-4">
          {demandesRecues.map((d) => (
            <div key={d.id} className="border border-ink/10 rounded-2xl p-5">
              <span className="font-mono text-xs text-amber">{d.services?.domaine}</span>
              <h3 className="font-display font-bold mt-1">{d.services?.titre}</h3>
              <p className="text-xs text-slate mt-2">
                Client : {d.profiles?.nom || "—"} — {d.profiles?.region}, {d.profiles?.departement}
              </p>
              <select
                value={d.statut}
                onChange={(e) => changerStatut(d.id, e.target.value)}
                className="mt-3 border border-ink/20 rounded-lg px-3 py-2 text-sm bg-white"
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
