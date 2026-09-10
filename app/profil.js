"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

export default function Profil() {
  const supabase = createClient();
  const [chargement, setChargement] = useState(true);
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [enregistre, setEnregistre] = useState(false);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    async function charger() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setChargement(false); return; }

      const { data } = await supabase
        .from("profiles")
        .select("nom, telephone")
        .eq("id", user.id)
        .single();

      setNom(data?.nom || "");
      setTelephone(data?.telephone || "");
      setChargement(false);
    }
    charger();
  }, []);

  async function enregistrer(e) {
    e.preventDefault();
    setErreur("");
    setEnregistre(false);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({ nom, telephone })
      .eq("id", user.id);

    if (error) {
      setErreur(error.message);
      return;
    }

    setEnregistre(true);
  }

  if (chargement) {
    return <p className="max-w-md mx-auto px-6 py-16 text-sm text-slate">Chargement...</p>;
  }

  return (
    <section className="max-w-md mx-auto px-6 py-20">
      <h1 className="font-display font-bold text-3xl mb-8">Mon profil</h1>

      <form onSubmit={enregistrer} className="grid gap-4">
        <div>
          <label className="text-xs text-slate">Nom complet</label>
          <input
            type="text" value={nom} onChange={(e) => setNom(e.target.value)}
            className="border border-ink/20 rounded-lg px-4 py-3 text-sm w-full mt-1"
          />
        </div>
        <div>
          <label className="text-xs text-slate">Téléphone</label>
          <input
            type="tel" placeholder="ex: 6XX XXX XXX" value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            className="border border-ink/20 rounded-lg px-4 py-3 text-sm w-full mt-1"
          />
        </div>

        {erreur && <p className="text-sm text-red-600">{erreur}</p>}
        {enregistre && <p className="text-sm text-verified">Enregistré ✓</p>}

        <button
          type="submit"
          className="bg-ink text-paper rounded-full py-3 text-sm font-medium mt-2"
        >
          Enregistrer
        </button>
      </form>
    </section>
  );
}
