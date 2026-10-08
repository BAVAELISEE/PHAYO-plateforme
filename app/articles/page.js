"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

export default function Articles() {
  const supabase = createClient();
  const [articles, setArticles] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [recherche, setRecherche] = useState("");
  const [photoActive, setPhotoActive] = useState({});

  useEffect(() => {
    async function charger() {
      const { data } = await supabase
        .from("articles")
        .select("*, profiles:auteur_id (nom, telephone)")
        .order("created_at", { ascending: false });

      setArticles(data || []);
      setChargement(false);
    }
    charger();
  }, []);

  const filtres = articles.filter((a) =>
    `${a.nom} ${a.description || ""}`.toLowerCase().includes(recherche.toLowerCase())
  );

  return (
    <section className="max-w-6xl mx-auto px-6 py-14">
      <span className="font-mono text-xs text-amber uppercase tracking-widest">Articles</span>
      <div className="flex flex-wrap items-end justify-between gap-4 mt-2">
        <h1 className="font-display font-bold text-4xl">Articles proposés</h1>
        <Link href="/articles/ajouter" className="btn-principal">+ Ajouter un article</Link>
      </div>

      <input
        type="search" placeholder="Rechercher un article…"
        value={recherche} onChange={(e) => setRecherche(e.target.value)}
        className="champ mt-6 max-w-md"
      />

      {chargement && <p className="text-sm text-slate mt-10">Chargement...</p>}

      {!chargement && filtres.length === 0 && (
        <div className="carte p-10 text-center mt-10">
          <p className="font-display font-bold">Aucun article pour le moment</p>
          <p className="text-sm text-slate mt-1">Soyez le premier à en publier un.</p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {filtres.map((a) => {
          const photos = a.photos || [];
          const index = photoActive[a.id] || 0;
          return (
            <article key={a.id} className="carte carte-hover overflow-hidden flex flex-col">
              {photos.length > 0 ? (
                <div>
                  <img src={photos[index]} alt={a.nom} className="w-full h-56 object-cover" />
                  {photos.length > 1 && (
                    <div className="flex gap-2 p-2 bg-paper">
                      {photos.map((p, i) => (
                        <button
                          key={p}
                          onClick={() => setPhotoActive({ ...photoActive, [a.id]: i })}
                          className={`w-12 h-12 rounded-lg overflow-hidden border-2 ${
                            i === index ? "border-amber" : "border-transparent"
                          }`}
                          aria-label={`Photo ${i + 1}`}
                        >
                          <img src={p} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-56 bg-paper grid place-items-center text-slate text-sm">Pas de photo</div>
              )}
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-display font-bold text-lg">{a.nom}</h3>
                {a.description && <p className="text-sm text-slate mt-2 leading-relaxed">{a.description}</p>}
                <div className="mt-auto pt-4">
                  <p className="text-xs text-slate">Par {a.profiles?.nom || "un utilisateur"}</p>
                  {a.profiles?.telephone && (
                    <a href={`tel:${a.profiles.telephone}`} className="inline-block mt-1 text-sm font-medium text-verified">
                      📞 {a.profiles.telephone}
                    </a>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
