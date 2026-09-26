"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function AjouterArticle() {
  const supabase = createClient();
  const router = useRouter();

  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [fichiers, setFichiers] = useState([]);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState("");

  function handleFichiers(e) {
    setFichiers(Array.from(e.target.files).slice(0, 5)); // 5 photos max
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErreur("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    if (!nom) {
      setErreur("Merci de donner un nom à l'article.");
      return;
    }

    setEnvoi(true);

    // Upload de chaque photo choisie vers le bucket "articles"
    const urlsPhotos = [];
    for (const fichier of fichiers) {
      const chemin = `${user.id}/${Date.now()}-${fichier.name}`;
      const { error: erreurUpload } = await supabase.storage
        .from("articles")
        .upload(chemin, fichier);

      if (erreurUpload) {
        setErreur("Erreur lors de l'envoi d'une photo : " + erreurUpload.message);
        setEnvoi(false);
        return;
      }

      const { data: urlPublique } = supabase.storage.from("articles").getPublicUrl(chemin);
      urlsPhotos.push(urlPublique.publicUrl);
    }

    const { error } = await supabase.from("articles").insert({
      auteur_id: user.id,
      nom,
      description,
      photos: urlsPhotos,
    });

    setEnvoi(false);

    if (error) {
      setErreur(error.message);
      return;
    }

    router.push("/articles");
  }

  return (
    <section className="max-w-md mx-auto px-6 py-20">
      <h1 className="font-display font-bold text-3xl mb-8">Ajouter un article</h1>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <input
          type="text" placeholder="Nom de l'article" required
          value={nom} onChange={(e) => setNom(e.target.value)}
          className="border border-ink/20 rounded-lg px-4 py-3 text-sm"
        />
        <textarea
          placeholder="Description" rows={4}
          value={description} onChange={(e) => setDescription(e.target.value)}
          className="border border-ink/20 rounded-lg px-4 py-3 text-sm"
        />
        <div>
          <label className="text-xs text-slate">Photos (jusqu'à 5)</label>
          <input
            type="file" accept="image/*" multiple
            onChange={handleFichiers}
            className="border border-ink/20 rounded-lg px-4 py-3 text-sm w-full mt-1 bg-white"
          />
          {fichiers.length > 0 && (
            <p className="text-xs text-slate mt-1">{fichiers.length} photo(s) sélectionnée(s)</p>
          )}
        </div>

        {erreur && <p className="text-sm text-red-600">{erreur}</p>}
        <button
          type="submit" disabled={envoi}
          className="bg-ink text-paper rounded-full py-3 text-sm font-medium disabled:opacity-50"
        >
          {envoi ? "Envoi..." : "Publier l'article"}
        </button>
      </form>
    </section>
  );
}
