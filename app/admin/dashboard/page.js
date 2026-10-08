"use client";

import Link from "next/link";
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
      <section className="max-w-md mx-auto px-6 py-20 text-center">
        <div className="carte p-10">
          <p className="font-display font-bold text-xl">Accès réservé</p>
          <p className="text-sm text-slate mt-2">
            Cette page est réservée à l'admin. Connectez-vous avec le compte admin.
          </p>
          <Link href="/login" className="btn-principal inline-block mt-6">Se connecter</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-6 py-14">
      <span className="font-mono text-xs text-amber uppercase tracking-widest">Espace admin</span>
      <h1 className="font-display font-bold text-4xl mt-2">Vérification des services</h1>

      <div className="grid sm:grid-cols-2 gap-4 mt-8 max-w-md">
        <div className="carte p-5">
          <p className="text-3xl font-display font-bold text-amber">{enAttente.length}</p>
          <p className="text-xs text-slate mt-1">en attente</p>
        </div>
        <div className="carte p-5">
          <p className="text-3xl font-display font-bold text-verified">{verifies.length}</p>
          <p className="text-xs text-slate mt-1">vérifiés</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-10 mt-12">
        <div>
          <h2 className="font-display font-bold text-lg mb-4">En attente de vérification</h2>
          {enAttente.length === 0 && (
            <p className="text-sm text-slate">Aucun service en attente.</p>
          )}
          <div className="grid gap-4">
            {enAttente.map((s) => (
              <div key={s.id} className="carte p-5 border-amber/40">
                <span className="badge bg-amber/15 text-amber">{s.domaine}</span>
                <h3 className="font-display font-bold mt-2">{s.titre}</h3>
                {s.description && <p className="text-sm text-slate mt-1">{s.description}</p>}
                <p className="text-xs text-slate mt-2">
                  Par {s.profiles?.nom || "acteur"} — {s.profiles?.region}, {s.profiles?.departement}
                </p>
                {s.telephone && <p className="text-xs text-slate mt-1">📞 {s.telephone}</p>}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => valider(s.id)}
                    className="bg-verified text-white text-xs font-medium px-5 py-2 rounded-full"
                  >
                    Valider
                  </button>
                  <button
                    onClick={() => rejeter(s.id)}
                    className="border border-ink/20 bg-white text-xs font-medium px-5 py-2 rounded-full"
                  >
                    Rejeter
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-display font-bold text-lg mb-4">Déjà vérifiés</h2>
          <div className="grid gap-4">
            {verifies.map((s) => (
              <div key={s.id} className="carte p-5">
                <span className="badge bg-verified/10 text-verified">{s.domaine}</span>
                <h3 className="font-display font-bold mt-2">{s.titre}</h3>
                <p className="text-xs text-slate mt-2">Par {s.profiles?.nom || "acteur"}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
