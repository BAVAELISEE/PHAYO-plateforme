"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { regionsCameroun } from "@/lib/cameroun";

export default function Profil() {
  const supabase = createClient();
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [chargement, setChargement] = useState(true);

  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [region, setRegion] = useState("");
  const [departement, setDepartement] = useState("");

  const [enregistre, setEnregistre] = useState(false);
  const [erreur, setErreur] = useState("");

  const [confirmationSuppression, setConfirmationSuppression] = useState(false);
  const [suppression, setSuppression] = useState(false);

  useEffect(() => {
    async function charger() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setChargement(false); return; }
      setUserId(user.id);

      const { data } = await supabase
        .from("profiles")
        .select("nom, telephone, region, departement")
        .eq("id", user.id)
        .single();

      setNom(data?.nom || "");
      setTelephone(data?.telephone || "");
      setRegion(data?.region || "");
      setDepartement(data?.departement || "");
      setChargement(false);
    }
    charger();
  }, []);

  function handleRegionChange(e) {
    setRegion(e.target.value);
    setDepartement("");
  }

  async function enregistrer(e) {
    e.preventDefault();
    setErreur("");
    setEnregistre(false);

    const { error } = await supabase
      .from("profiles")
      .update({ nom, telephone, region, departement })
      .eq("id", userId);

    if (error) {
      setErreur(error.message);
      return;
    }

    setEnregistre(true);
  }

  async function supprimerCompte() {
    setSuppression(true);

    // Supprime le profil (les services, demandes et articles liés sont
    // supprimés automatiquement via la suppression en cascade).
    const { error } = await supabase.from("profiles").delete().eq("id", userId);

    if (error) {
      setErreur(error.message);
      setSuppression(false);
      return;
    }

    await supabase.auth.signOut();
    router.push("/");
  }

  if (chargement) {
    return <p className="max-w-md mx-auto px-6 py-16 text-sm text-slate">Chargement...</p>;
  }

  if (!userId) {
    return (
      <p className="max-w-md mx-auto px-6 py-16 text-sm text-slate">
        Vous devez être connecté pour accéder à votre profil.
      </p>
    );
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
            type="tel" value={telephone} onChange={(e) => setTelephone(e.target.value)}
            className="border border-ink/20 rounded-lg px-4 py-3 text-sm w-full mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate">Région</label>
            <select
              value={region} onChange={handleRegionChange}
              className="border border-ink/20 rounded-lg px-3 py-3 text-sm bg-white w-full mt-1"
            >
              <option value="">—</option>
              {Object.keys(regionsCameroun).map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate">Département</label>
            <select
              value={departement} onChange={(e) => setDepartement(e.target.value)}
              disabled={!region}
              className="border border-ink/20 rounded-lg px-3 py-3 text-sm bg-white w-full mt-1 disabled:bg-slate/10"
            >
              <option value="">—</option>
              {(regionsCameroun[region] || []).map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
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

      <div className="mt-6 text-sm">
        <a href="/articles/ajouter" className="text-ink hover:text-amber font-medium">
          Ajouter un article →
        </a>
      </div>

      <div className="mt-16 border-t border-red-200 pt-6">
        <h2 className="font-display font-bold text-red-600 mb-2">Zone dangereuse</h2>
        <p className="text-xs text-slate mb-4">
          La suppression de votre compte efface votre profil, vos services,
          vos articles et vos demandes. Cette action est irréversible.
        </p>

        {!confirmationSuppression ? (
          <button
            onClick={() => setConfirmationSuppression(true)}
            className="border border-red-300 text-red-600 text-sm font-medium px-4 py-2 rounded-full"
          >
            Supprimer mon compte
          </button>
        ) : (
          <div className="grid gap-2">
            <p className="text-sm text-red-600 font-medium">
              Êtes-vous sûr ? Cette action est définitive.
            </p>
            <div className="flex gap-2">
              <button
                onClick={supprimerCompte}
                disabled={suppression}
                className="bg-red-600 text-paper text-sm font-medium px-4 py-2 rounded-full disabled:opacity-50"
              >
                {suppression ? "Suppression..." : "Oui, supprimer définitivement"}
              </button>
              <button
                onClick={() => setConfirmationSuppression(false)}
                className="border border-ink/20 text-sm font-medium px-4 py-2 rounded-full"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
