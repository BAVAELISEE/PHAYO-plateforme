import Link from "next/link";
import { servicesDistance, servicesPresentiels } from "@/lib/data";

export default function Home() {
  return (
    <div>
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16">
        <span className="font-mono text-xs text-amber uppercase tracking-widest">
          Un site, deux façons de rendre service
        </span>
        <h1 className="font-display font-bold text-4xl md:text-6xl mt-4 max-w-3xl leading-tight">
          Un site polyvalent qui relie clients et acteurs.
        </h1>
        <p className="text-slate mt-6 max-w-xl">
          Que le service se rende à distance ou sur place, la plateforme
          centralise l'offre, vérifie les acteurs, et laisse le client
          consulter et bénéficier des services en toute confiance.
        </p>
        <div className="flex gap-4 mt-8">
          <Link href="/register" className="bg-ink text-paper px-6 py-3 rounded-full text-sm font-medium">
            Créer un compte
          </Link>
          <Link href="/services/distance" className="border border-ink/20 px-6 py-3 rounded-full text-sm font-medium">
            Voir les services
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="font-display font-bold text-xl mb-1">1 — Services à distance</h2>
            <p className="text-sm text-slate mb-6">Rendus sans déplacement de l'acteur.</p>
            <div className="grid gap-4">
              {servicesDistance.map((s) => (
                <div key={s.code} className="flex items-baseline gap-3 border-b border-ink/10 pb-3">
                  <span className="font-mono text-xs text-amber">{s.code}</span>
                  <span className="font-medium">{s.nom}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-display font-bold text-xl mb-1">2 — Services présentiels</h2>
            <p className="text-sm text-slate mb-6">Rendus directement auprès du client.</p>
            <div className="grid gap-4">
              {servicesPresentiels.map((s) => (
                <div key={s.code} className="flex items-baseline gap-3 border-b border-ink/10 pb-3">
                  <span className="font-mono text-xs text-amber">{s.code}</span>
                  <span className="font-medium">{s.nom}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
