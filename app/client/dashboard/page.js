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
  const [chargement, setChargement] = useState(true);
  const [demandes, setDemandes] = useState([]);

  useEffect(() => {
    async function charger() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setChargement(false); return; }

      const { data } = await supabase
        .from("demandes")
        .select("*, services (titre, domaine, telephone), profiles:acteur_id (nom)")
        .eq("client_id", user.id)
        .order("created_at", { ascending: false });

      setDemandes(data || []);
      setChargement(false);
    }
    charger();
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <span className="font-mono text-xs text-amber uppercase tracking-widest">Espace client</span>
      <h1 className="font-display font-bold text-3xl mt-2 mb-10">Mes demandes</h1>

      {chargement && <p className="text-sm text-slate">Chargement...</p>}

      {!chargement && demandes.length === 0 && (
        <p className="text-sm text-slate">
          Vous n'avez pas encore fait de demande. Consultez les{" "}
          <a href="/services/distance" className="underline">services à distance</a> ou{" "}
          <a href="/services/presentiel" className="underline">présentiels</a>.
        </p>
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
    </section>
  );
}
