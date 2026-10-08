"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function AjouterArticle() {
  const supabase = createClient();
  const router = useRouter();

  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [fichiers, setFichiers] = useState([]);
  const [apercus, setApercus] = useState([]);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState("");

  function handleFichiers(e) {
    setFichiers(Array.from(e.target.files).slice(0, 5));
  }

  // Aperçus des photos choisies
  useEffect(() => {
    const urls = fichiers.map((f) => URL.createObjectURL(f));
    setApercus(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [fichiers]);

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

    const urlsPhotos = [];
    for (const fichier of fichiers) {
      const chemin = `${user.id}/${Date.now()}-${fichier.name}`;
      const { error: erreurUpload } = await supabase.storage.from("articles").upload(chemin, fichier);

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
    <section className="max-w-xl mx-auto px-6 py-14">
      <span className="font-mono text-xs text-amber uppercase tracking-widest">Nouvel article</span>
      <h1 className="font-display font-bold text-3xl mt-2">Ajouter un article</h1>
      <p className="text-sm text-slate mt-1">Donnez un nom, une description et jusqu'à 5 photos.</p>

      <form onSubmit={handleSubmit} className="carte p-6 md:p-8 grid gap-5 mt-8">
        <div>
          <label className="text-xs font-medium text-slate">Nom de l'article</label>
          <input
            type="text" required value={nom} onChange={(e) => setNom(e.target.value)}
            className="champ mt-1"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate">Description</label>
          <textarea
            rows={4} value={description} onChange={(e) => setDescription(e.target.value)}
            className="champ mt-1"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate">Photos (depuis votre appareil)</label>
          <label className="mt-1 flex flex-col items-center justify-center gap-1 border-2 border-dashed border-ink/20 rounded-xl p-6 text-sm text-slate cursor-pointer hover:border-amber transition-colors">
            <span className="text-2xl">📷</span>
            <span>Cliquez pour choisir des photos</span>
            <input type="file" accept="image/*" multiple onChange={handleFichiers} className="hidden" />
          </label>

          {apercus.length > 0 && (
            <div className="grid grid-cols-5 gap-2 mt-3">
              {apercus.map((u) => (
                <img key={u} src={u} alt="Aperçu" className="w-full aspect-square object-cover rounded-lg" />
              ))}
            </div>
          )}
        </div>

        {erreur && <p className="text-sm text-red-600">{erreur}</p>}
        <button type="submit" disabled={envoi} className="btn-principal">
          {envoi ? "Envoi..." : "Publier l'article"}
        </button>
      </form>
    </section>
  );
}
