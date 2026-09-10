"use client";

import { useState } from "react";
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
    <section className="max-w-md mx-auto px-6 py-20">
      <h1 className="font-display font-bold text-3xl mb-8">Connexion</h1>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <input
          type="email" placeholder="Email" required
          value={email} onChange={(e) => setEmail(e.target.value)}
          className="border border-ink/20 rounded-lg px-4 py-3 text-sm"
        />
        <input
          type="password" placeholder="Mot de passe" required
          value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)}
          className="border border-ink/20 rounded-lg px-4 py-3 text-sm"
        />
        {erreur && <p className="text-sm text-red-600">{erreur}</p>}
        <button
          type="submit" disabled={chargement}
          className="bg-ink text-paper rounded-full py-3 text-sm font-medium mt-2 disabled:opacity-50"
        >
          {chargement ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </section>
  );
}
