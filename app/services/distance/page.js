"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function ServicesDistance() {
  const supabase = createClient();
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [demandeEnCours, setDemandeEnCours] = useState(null);
  const [confirmes, setConfirmes] = useState([]);

  useEffect(() => {
    async function charger() {
      const { data } = await supabase
        .from("services")
        .select("*, profiles:acteur_id (nom)")
        .eq("type", "distance")
        .eq("verifie", true)
        .order("created_at", { ascending: false });

      setServices(data || []);
      setChargement(false);
    }
    charger();
  }, []);

  async function demander(service) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    setDemandeEnCours(service.id);

    const { error } = await supabase.from("demandes").insert({
      client_id: user.id,
      acteur_id: service.acteur_id,
      service_id: service.id,
    });

    setDemandeEnCours(null);

    if (!error) {
      setConfirmes([...confirmes, service.id]);
    }
  }

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <span className="font-mono text-xs text-amber uppercase tracking-widest">1 — À distance</span>
      <h1 className="font-display font-bold text-3xl mt-2 mb-10">Services à distance</h1>

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
            ) : (
              <button
                onClick={() => demander(s)}
                disabled={demandeEnCours === s.id}
                className="mt-4 text-sm font-medium text-ink hover:text-amber transition-colors disabled:opacity-50"
              >
                {demandeEnCours === s.id ? "Envoi..." : "Demander ce service →"}
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
