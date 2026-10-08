"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function Services() {
  const supabase = createClient();
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [demandeOuverte, setDemandeOuverte] = useState(null);
  const [telephone, setTelephone] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const [confirmes, setConfirmes] = useState([]);
  const [recherche, setRecherche] = useState("");
  const [domaineActif, setDomaineActif] = useState("tous");

  useEffect(() => {
    async function charger() {
      const { data } = await supabase
        .from("services")
        .select("*, profiles:acteur_id (nom)")
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

  const domaines = [...new Set(services.map((s) => s.domaine))];

  const filtres = services.filter((s) => {
    const okDomaine = domaineActif === "tous" || s.domaine === domaineActif;
    const texte = `${s.titre} ${s.description || ""} ${s.domaine}`.toLowerCase();
    return okDomaine && texte.includes(recherche.toLowerCase());
  });

  const parDomaine = filtres.reduce((acc, s) => {
    acc[s.domaine] = acc[s.domaine] || [];
    acc[s.domaine].push(s);
    return acc;
  }, {});

  return (
    <section className="max-w-6xl mx-auto px-6 py-14">
      <span className="font-mono text-xs text-amber uppercase tracking-widest">Nos services</span>
      <h1 className="font-display font-bold text-4xl mt-2">Trouvez votre service</h1>
      <p className="text-slate mt-2 text-sm">Tous les services listés ici ont été vérifiés.</p>

      <input
        type="search" placeholder="Rechercher un service…"
        value={recherche} onChange={(e) => setRecherche(e.target.value)}
        className="champ mt-6 max-w-md"
      />

      <div className="flex flex-wrap gap-2 mt-4">
        {["tous", ...domaines].map((d) => (
          <button
            key={d}
            onClick={() => setDomaineActif(d)}
            className={`badge !px-4 !py-2 border transition-colors ${
              domaineActif === d ? "bg-ink text-paper border-ink" : "bg-white border-ink/15 text-slate"
            }`}
          >
            {d === "tous" ? "Tous" : d}
          </button>
        ))}
      </div>

      {chargement && <p className="text-sm text-slate mt-10">Chargement...</p>}

      {!chargement && filtres.length === 0 && (
        <div className="carte p-10 text-center mt-10">
          <p className="font-display font-bold">Aucun service trouvé</p>
          <p className="text-sm text-slate mt-1">Essayez une autre recherche ou un autre domaine.</p>
        </div>
      )}

      {Object.entries(parDomaine).map(([domaine, liste]) => (
        <div key={domaine} className="mt-12">
          <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-3">
            {domaine}
            <span className="badge bg-amber/15 text-amber">{liste.length}</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {liste.map((s) => (
              <div key={s.id} className="carte carte-hover p-6 flex flex-col">
                <h3 className="font-display font-bold text-lg">{s.titre}</h3>
                {s.description && <p className="text-sm text-slate mt-2 leading-relaxed">{s.description}</p>}

                <div className="mt-auto pt-4">
                  <p className="text-xs text-slate">Proposé par {s.profiles?.nom || "un acteur"}</p>
                  {s.telephone && (
                    <a href={`tel:${s.telephone}`} className="inline-block mt-1 text-sm font-medium text-verified">
                      📞 {s.telephone}
                    </a>
                  )}

                  {confirmes.includes(s.id) ? (
                    <p className="mt-4 text-sm text-verified font-medium">Demande envoyée ✓</p>
                  ) : demandeOuverte === s.id ? (
                    <div className="mt-4 grid gap-2">
                      <input
                        type="tel" placeholder="Votre numéro (ex: 6XX XXX XXX)"
                        value={telephone} onChange={(e) => setTelephone(e.target.value)}
                        className="champ" autoFocus
                      />
                      <button
                        onClick={() => envoyerDemande(s)}
                        disabled={envoi || !telephone}
                        className="btn-principal !py-2"
                      >
                        {envoi ? "Envoi..." : "Confirmer la demande"}
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setDemandeOuverte(s.id)} className="btn-secondaire !py-2 mt-4 w-full">
                      Demander ce service
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
