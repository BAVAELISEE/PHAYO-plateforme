"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

export default function AdminDashboard() {
  const supabase = createClient();
  const [chargement, setChargement] = useState(true);
  const [autorise, setAutorise] = useState(false);
  const [enAttente, setEnAttente] = useState([]);
  const [verifies, setVerifies] = useState([]);

  useEffect(() => {
    async function charger() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setChargement(false); return; }

      const { data: profil } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profil?.role !== "admin") {
        setChargement(false);
        return;
      }
      setAutorise(true);

      await rafraichir();
      setChargement(false);
    }
    charger();
  }, []);

  async function rafraichir() {
    const { data: pending } = await supabase
      .from("services")
      .select("*, profiles:acteur_id (nom, region, departement)")
      .eq("verifie", false)
      .order("created_at", { ascending: true });

    const { data: done } = await supabase
      .from("services")
      .select("*, profiles:acteur_id (nom, region, departement)")
      .eq("verifie", true)
      .order("created_at", { ascending: false });

    setEnAttente(pending || []);
    setVerifies(done || []);
  }

  async function valider(id) {
    await supabase.from("services").update({ verifie: true }).eq("id", id);
    rafraichir();
  }

  async function rejeter(id) {
    await supabase.from("services").delete().eq("id", id);
    rafraichir();
  }

  if (chargement) {
    return <p className="max-w-6xl mx-auto px-6 py-16 text-sm text-slate">Chargement...</p>;
  }

  if (!autorise) {
    return (
      <p className="max-w-6xl mx-auto px-6 py-16 text-sm text-slate">
        Cette page est réservée à l'admin.
      </p>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <span className="font-mono text-xs text-amber uppercase tracking-widest">Espace admin</span>
      <h1 className="font-display font-bold text-3xl mt-2 mb-10">Vérification des services</h1>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Services en attente */}
        <div>
          <h2 className="font-display font-bold text-lg mb-4">
            En attente ({enAttente.length})
          </h2>
          {enAttente.length === 0 && (
            <p className="text-sm text-slate">Aucun service en attente.</p>
          )}
          <div className="grid gap-4">
            {enAttente.map((s) => (
              <div key={s.id} className="border border-amber/40 rounded-2xl p-5">
                <span className="font-mono text-xs text-amber">{s.domaine}</span>
                <h3 className="font-display font-bold mt-1">{s.titre}</h3>
                {s.description && <p className="text-sm text-slate mt-1">{s.description}</p>}
                <p className="text-xs text-slate mt-2">
                  Par {s.profiles?.nom || "acteur"} — {s.profiles?.region}, {s.profiles?.departement}
                </p>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => valider(s.id)}
                    className="bg-verified text-paper text-xs font-medium px-4 py-2 rounded-full"
                  >
                    Valider
                  </button>
                  <button
                    onClick={() => rejeter(s.id)}
                    className="border border-ink/20 text-xs font-medium px-4 py-2 rounded-full"
                  >
                    Rejeter
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Services déjà vérifiés */}
        <div>
          <h2 className="font-display font-bold text-lg mb-4">
            Vérifiés ({verifies.length})
          </h2>
          <div className="grid gap-4">
            {verifies.map((s) => (
              <div key={s.id} className="border border-ink/10 rounded-2xl p-5">
                <span className="font-mono text-xs text-verified">{s.domaine}</span>
                <h3 className="font-display font-bold mt-1">{s.titre}</h3>
                <p className="text-xs text-slate mt-2">Par {s.profiles?.nom || "acteur"}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
