"use client";

import { useState } from "react";
import Link from "next/link";
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

    const { error } = await supabase.auth.signUp({
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
    <section className="max-w-5xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-0 overflow-hidden">
      <div className="hidden md:flex flex-col justify-between bg-ink text-paper rounded-l-3xl p-10">
        <p className="font-display font-bold text-xl">PHAYO<span className="text-amber">.</span></p>
        <div>
          <h2 className="font-display font-bold text-3xl leading-tight">Rejoignez la plateforme.</h2>
          <ul className="text-paper/70 mt-4 text-sm grid gap-2">
            <li>✓ Clients : trouvez et demandez des services</li>
            <li>✓ Acteurs : proposez vos services</li>
            <li>✓ Publiez vos articles avec photos</li>
          </ul>
        </div>
        <p className="text-xs text-paper/50">Un site, tous les services</p>
      </div>

      <div className="carte md:rounded-l-none md:rounded-r-3xl p-8 md:p-10">
        <h1 className="font-display font-bold text-3xl">Créer un compte</h1>
        <p className="text-sm text-slate mt-1">Choisissez votre profil puis remplissez vos informations.</p>

        <div className="grid grid-cols-2 gap-2 mt-6 p-1 bg-paper rounded-full">
          {["client", "acteur"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`py-2 rounded-full text-sm font-medium transition-colors ${
                role === r ? "bg-ink text-paper" : "text-slate"
              }`}
            >
              {r === "client" ? "Client" : "Acteur"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 mt-6">
          <input
            type="text" placeholder="Nom complet" required
            value={nom} onChange={(e) => setNom(e.target.value)} className="champ"
          />
          <input
            type="tel" placeholder="Téléphone (ex: 6XX XXX XXX)" required
            value={telephone} onChange={(e) => setTelephone(e.target.value)} className="champ"
          />
          <input
            type="email" placeholder="Email" required
            value={email} onChange={(e) => setEmail(e.target.value)} className="champ"
          />
          <input
            type="password" placeholder="Mot de passe (6 caractères min.)" required minLength={6}
            value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} className="champ"
          />

          <div className="grid grid-cols-2 gap-3">
            <select required value={region} onChange={handleRegionChange} className="champ">
              <option value="">Région</option>
              {Object.keys(regionsCameroun).map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <select
              required value={departement} onChange={(e) => setDepartement(e.target.value)}
              disabled={!region} className="champ disabled:bg-slate/10"
            >
              <option value="">Département</option>
              {(regionsCameroun[region] || []).map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {erreur && <p className="text-sm text-red-600">{erreur}</p>}
          <button type="submit" disabled={chargement} className="btn-principal mt-2">
            {chargement ? "Création..." : "Créer mon compte"}
          </button>
        </form>

        <p className="text-sm text-slate mt-6">
          Déjà inscrit ?{" "}
          <Link href="/login" className="text-ink font-medium underline">Se connecter</Link>
        </p>
      </div>
    </section>
  );
}
