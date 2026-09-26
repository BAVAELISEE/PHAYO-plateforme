"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

export default function Articles() {
  const supabase = createClient();
  const [articles, setArticles] = useState([]);
  const [chargement, setChargement] = useState(true);

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

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <span className="font-mono text-xs text-amber uppercase tracking-widest">Articles</span>
      <div className="flex items-center justify-between mt-2 mb-10">
        <h1 className="font-display font-bold text-3xl">Articles proposés</h1>
        <a
          href="/articles/ajouter"
          className="bg-ink text-paper text-sm font-medium px-4 py-2 rounded-full"
        >
          + Ajouter un article
        </a>
      </div>

      {chargement && <p className="text-sm text-slate">Chargement...</p>}
      {!chargement && articles.length === 0 && (
        <p className="text-sm text-slate">Aucun article pour le moment.</p>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {articles.map((a) => (
          <div key={a.id} className="border border-ink/10 rounded-2xl overflow-hidden">
            {a.photos?.[0] && (
              <img src={a.photos[0]} alt={a.nom} className="w-full h-48 object-cover" />
            )}
            <div className="p-5">
              <h3 className="font-display font-bold text-lg">{a.nom}</h3>
              {a.description && <p className="text-sm text-slate mt-2">{a.description}</p>}
              <p className="text-xs text-slate mt-3">Par {a.profiles?.nom || "un utilisateur"}</p>
              {a.profiles?.telephone && (
                <a
                  href={`tel:${a.profiles.telephone}`}
                  className="inline-block mt-1 text-sm font-medium text-verified"
                >
                  📞 {a.profiles.telephone}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
