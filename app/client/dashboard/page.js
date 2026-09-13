"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

const LABELS_STATUT = {
  en_attente: { texte: "En attente", classe: "bg-slate/10 text-slate" },
  en_cours: { texte: "En cours", classe: "bg-amber/10 text-amber" },
  termine: { texte: "Terminé", classe: "bg-verified/10 text-verified" },
};

export default function ClientDashboard() {
  const supabase = createClient();
  const [userId, setUserId] = useState(null);
  const [chargement, setChargement] = useState(true);

  const [demandes, setDemandes] = useState([]);
  const [servicesDisponibles, setServicesDisponibles] = useState([]);
  const [filtreType, setFiltreType] = useState("distance");

  const [demandeOuverte, setDemandeOuverte] = useState(null);
  const [telephone, setTelephone] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const [confirmes, setConfirmes] = useState([]);

  useEffect(() => {
    async function charger() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setChargement(false); return; }
      setUserId(user.id);

      const { data: mesDemandes } = await supabase
        .from("demandes")
        .select("*, services (titre, domaine, telephone), profiles:acteur_id (nom)")
        .eq("client_id", user.id)
        .order("created_at", { ascending: false });

      const { data: disponibles } = await supabase
        .from("services")
        .select("*, profiles:acteur_id (nom)")
        .eq("verifie", true)
        .order("created_at", { ascending: false });

      setDemandes(mesDemandes || []);
      setServicesDisponibles(disponibles || []);
      setChargement(false);
    }
    charger();
  }, []);

  async function envoyerDemande(service) {
    if (!telephone) return;
    setEnvoi(true);

    const { error } = await supabase.from("demandes").insert({
      client_id: userId,
      acteur_id: service.acteur_id,
      service_id: service.id,
      telephone,
    });

    setEnvoi(false);

    if (!error) {
      setConfirmes([...confirmes, service.id]);
      setDemandeOuverte(null);
      setTelephone("");
    }
  }

  const servicesFiltres = servicesDisponibles.filter((s) => s.type === filtreType);

  if (chargement) {
    return <p className="max-w-6xl mx-auto px-6 py-16 text-sm text-slate">Chargement...</p>;
  }

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <span className="font-mono text-xs text-amber uppercase tracking-widest">Espace client</span>
      <h1 className="font-display font-bold text-3xl mt-2 mb-10">Mon espace</h1>

      {/* Mes demandes */}
      <div className="mb-16">
        <h2 className="font-display font-bold text-lg mb-4">Mes demandes</h2>

        {demandes.length === 0 && (
          <p className="text-sm text-slate">Vous n'avez pas encore fait de demande.</p>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {demandes.map((d) => {
            const statut = LABELS_STATUT[d.statut] || LABELS_STATUT.en_attente;
            return (
              <div key={d.id} className="border border-ink/10 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-amber">{d.services?.domaine}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${statut.classe}`}>
                    {statut.texte}
                  </span>
                </div>
                <h3 className="font-display font-bold mt-2">{d.services?.titre}</h3>
                <p className="text-xs text-slate mt-2">Acteur : {d.profiles?.nom || "—"}</p>
                {d.services?.telephone && (
                  <a
                    href={`tel:${d.services.telephone}`}
                    className="inline-block mt-3 text-sm font-medium text-ink hover:text-amber"
                  >
                    📞 {d.services.telephone}
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Services disponibles */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-lg">Services disponibles</h2>
          <div className="flex gap-2">
            {["distance", "presentiel"].map((t) => (
              <button
                key={t}
                onClick={() => setFiltreType(t)}
                className={`text-xs px-3 py-1.5 rounded-full border font-medium ${
                  filtreType === t ? "bg-ink text-paper border-ink" : "border-ink/20 text-slate"
                }`}
              >
                {t === "distance" ? "À distance" : "Présentiel"}
              </button>
            ))}
          </div>
        </div>

        {servicesFiltres.length === 0 && (
          <p className="text-sm text-slate">Aucun service disponible dans cette catégorie pour le moment.</p>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {servicesFiltres.map((s) => (
            <div key={s.id} className="border border-ink/10 rounded-2xl p-6">
              <span className="font-mono text-xs text-amber">{s.domaine}</span>
              <h3 className="font-display font-bold text-lg mt-2">{s.titre}</h3>
              {s.description && <p className="text-sm text-slate mt-2">{s.description}</p>}
              <p className="text-xs text-slate mt-3">Proposé par {s.profiles?.nom || "un acteur"}</p>
              {s.telephone && (
                <a
                  href={`tel:${s.telephone}`}
                  className="inline-block mt-1 text-sm font-medium text-verified"
                >
                  📞 {s.telephone}
                </a>
              )}

              {confirmes.includes(s.id) ? (
                <p className="mt-4 text-sm text-verified font-medium">Demande envoyée ✓</p>
              ) : demandeOuverte === s.id ? (
                <div className="mt-4 grid gap-2">
                  <input
                    type="tel"
                    placeholder="Votre numéro (ex: 6XX XXX XXX)"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    className="border border-ink/20 rounded-lg px-3 py-2 text-sm"
                    autoFocus
                  />
                  <button
                    onClick={() => envoyerDemande(s)}
                    disabled={envoi || !telephone}
                    className="bg-ink text-paper text-sm font-medium py-2 rounded-full disabled:opacity-50"
                  >
                    {envoi ? "Envoi..." : "Confirmer la demande"}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setDemandeOuverte(s.id)}
                  className="mt-4 text-sm font-medium text-ink hover:text-amber transition-colors"
                >
                  Demander ce service →
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
