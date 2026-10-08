"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e) {
    e.preventDefault();
    setErreur("");
    setChargement(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: motDePasse,
    });

    if (error) {
      setChargement(false);
      setErreur(error.message);
      return;
    }

    const { data: profil } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    setChargement(false);

    if (profil?.role === "acteur") router.push("/acteur/dashboard");
    else if (profil?.role === "admin") router.push("/admin/dashboard");
    else router.push("/client/dashboard");
  }

  return (
    <section className="max-w-5xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-0 overflow-hidden">
      <div className="hidden md:flex flex-col justify-between bg-ink text-paper rounded-l-3xl p-10">
        <p className="font-display font-bold text-xl">PHAYO<span className="text-amber">.</span></p>
        <div>
          <h2 className="font-display font-bold text-3xl leading-tight">Content de vous revoir.</h2>
          <p className="text-paper/70 mt-3 text-sm">
            Retrouvez vos services, vos demandes et vos articles en un seul endroit.
          </p>
        </div>
        <p className="text-xs text-paper/50">Un site, tous les services</p>
      </div>

      <div className="carte md:rounded-l-none md:rounded-r-3xl p-8 md:p-10">
        <h1 className="font-display font-bold text-3xl">Connexion</h1>
        <p className="text-sm text-slate mt-1">Entrez vos identifiants pour continuer.</p>

        <form onSubmit={handleSubmit} className="grid gap-4 mt-8">
          <input
            type="email" placeholder="Email" required
            value={email} onChange={(e) => setEmail(e.target.value)}
            className="champ"
          />
          <input
            type="password" placeholder="Mot de passe" required
            value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)}
            className="champ"
          />
          {erreur && <p className="text-sm text-red-600">{erreur}</p>}
          <button type="submit" disabled={chargement} className="btn-principal mt-2">
            {chargement ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="text-sm text-slate mt-6">
          Pas encore de compte ?{" "}
          <Link href="/register" className="text-ink font-medium underline">Créer un compte</Link>
        </p>
      </div>
    </section>
  );
}
