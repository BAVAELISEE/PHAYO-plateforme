import Link from "next/link";
import { domainesServices } from "@/lib/data";

export default function Home() {
  return (
    <div>
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16">
        <span className="font-mono text-xs text-amber uppercase tracking-widest">
          Un site, tous les services
        </span>
        <h1 className="font-display font-bold text-4xl md:text-6xl mt-4 max-w-3xl leading-tight">
          Un site polyvalent qui relie clients et acteurs.
        </h1>
        <p className="text-slate mt-6 max-w-xl">
          La plateforme centralise l'offre, vérifie les acteurs, et laisse le
          client consulter et bénéficier des services en toute confiance.
        </p>
        <div className="flex gap-4 mt-8">
          <Link href="/register" className="bg-ink text-paper px-6 py-3 rounded-full text-sm font-medium">
            Créer un compte
          </Link>
          <Link href="/services" className="border border-ink/20 px-6 py-3 rounded-full text-sm font-medium">
            Voir les services
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        <h2 className="font-display font-bold text-xl mb-1">Domaines proposés</h2>
        <p className="text-sm text-slate mb-6">
          Et bien d'autres — les acteurs peuvent ajouter leur propre domaine.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {domainesServices.map((d) => (
            <div key={d} className="flex items-baseline gap-3 border-b border-ink/10 pb-3">
              <span className="font-medium">{d}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
