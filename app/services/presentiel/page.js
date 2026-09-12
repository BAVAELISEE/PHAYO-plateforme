"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function ServicesPresentiel() {
  const supabase = createClient();
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [demandeOuverte, setDemandeOuverte] = useState(null);
  const [telephone, setTelephone] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const [confirmes, setConfirmes] = useState([]);

  useEffect(() => {
    async function charger() {
      const { data } = await supabase
        .from("services")
        .select("*, profiles:acteur_id (nom)")
        .eq("type", "presentiel")
        .eq("verifie", true)
        .order("created_at", { ascending: false });

      setServices(data || []);
      setChargement(false);
    }
    charger();
  }, []);

  async function envoyerDemande(service) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    if (!telephone) return;

    setEnvoi(true);

    const { error } = await supabase.from("demandes").insert({
      client_id: user.id,
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

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <span className="font-mono text-xs text-amber uppercase tracking-widest">2 — Présentiels</span>
      <h1 className="font-display font-bold text-3xl mt-2 mb-10">Services présentiels</h1>

      {chargement && <p className="text-sm text-slate">Chargement...</p>}

      {!chargement && services.length === 0 && (
        <p className="text-sm text-slate">Aucun service disponible pour le moment.</p>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {services.map((s) => (
          <div key={s.id} className="border border-ink/10 rounded-2xl p-6">
            <span className="font-mono text-xs text-amber">{s.domaine}</span>
            <h3 className="font-display font-bold text-lg mt-2">{s.titre}</h3>
            {s.description && <p className="text-sm text-slate mt-2">{s.description}</p>}
            <p className="text-xs text-slate mt-3">Proposé par {s.profiles?.nom || "un acteur"}</p>

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
    </section>
  );
}
