"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { regionsCameroun } from "@/lib/cameroun";

export default function Register() {
  const [role, setRole] = useState("client");
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [region, setRegion] = useState("");
  const [departement, setDepartement] = useState("");
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  function handleRegionChange(e) {
    setRegion(e.target.value);
    setDepartement("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErreur("");

    if (!region || !departement) {
      setErreur("Merci de choisir votre région et votre département.");
      return;
    }

    setChargement(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password: motDePasse,
      options: {
        data: { nom, telephone, role, region, departement },
      },
    });

    setChargement(false);

    if (error) {
      setErreur(error.message);
      return;
    }

    router.push(role === "acteur" ? "/acteur/dashboard" : "/client/dashboard");
  }

  return (
    <section className="max-w-md mx-auto px-6 py-20">
      <h1 className="font-display font-bold text-3xl mb-8">Créer un compte</h1>

      <div className="flex gap-2 mb-8">
        {["client", "acteur"].map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`flex-1 py-2 rounded-full text-sm font-medium border ${
              role === r ? "bg-ink text-paper border-ink" : "border-ink/20 text-slate"
            }`}
          >
            {r === "client" ? "Client" : "Acteur"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <input
          type="text" placeholder="Nom complet" required
          value={nom} onChange={(e) => setNom(e.target.value)}
          className="border border-ink/20 rounded-lg px-4 py-3 text-sm"
        />
        <input
          type="tel" placeholder="Téléphone (ex: 6XX XXX XXX)" required
          value={telephone} onChange={(e) => setTelephone(e.target.value)}
          className="border border-ink/20 rounded-lg px-4 py-3 text-sm"
        />
        <input
          type="email" placeholder="Email" required
          value={email} onChange={(e) => setEmail(e.target.value)}
          className="border border-ink/20 rounded-lg px-4 py-3 text-sm"
        />
        <input
          type="password" placeholder="Mot de passe" required minLength={6}
          value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)}
          className="border border-ink/20 rounded-lg px-4 py-3 text-sm"
        />

        <div className="grid grid-cols-2 gap-3">
          <select
            required value={region} onChange={handleRegionChange}
            className="border border-ink/20 rounded-lg px-3 py-3 text-sm bg-white"
          >
            <option value="">Région</option>
            {Object.keys(regionsCameroun).map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          <select
            required value={departement} onChange={(e) => setDepartement(e.target.value)}
            disabled={!region}
            className="border border-ink/20 rounded-lg px-3 py-3 text-sm bg-white disabled:bg-slate/10"
          >
            <option value="">Département</option>
            {(regionsCameroun[region] || []).map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {erreur && <p className="text-sm text-red-600">{erreur}</p>}
        <button
          type="submit" disabled={chargement}
          className="bg-ink text-paper rounded-full py-3 text-sm font-medium mt-2 disabled:opacity-50"
        >
          {chargement ? "Création..." : "Créer mon compte"}
        </button>
      </form>
    </section>
  );
}
