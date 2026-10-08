import Link from "next/link";
import HeroIllustration from "@/components/HeroIllustration";
import { domainesServices } from "@/lib/data";

const ETAPES = [
  { n: "1", titre: "Créez votre compte", texte: "Inscrivez-vous comme client ou comme acteur, avec votre région et votre département." },
  { n: "2", titre: "Trouvez ou proposez", texte: "Les acteurs publient leurs services, vérifiés par l'équipe avant d'être visibles." },
  { n: "3", titre: "Contactez-vous", texte: "Faites votre demande et échangez directement par téléphone ou WhatsApp." },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-14 pb-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <span className="badge bg-amber/15 text-amber font-mono uppercase tracking-widest">
            Un site, tous les services
          </span>
          <h1 className="font-display font-bold text-4xl md:text-5xl mt-5 leading-tight">
            Trouvez le bon service, <span className="text-amber">près de chez vous.</span>
          </h1>
          <p className="text-slate mt-5 max-w-lg leading-relaxed">
            PHAYO est un site polyvalent qui relie clients et acteurs : éducation, santé,
            technologie, transport, commerce et bien d'autres domaines. Chaque service est
            vérifié avant d'être publié.
          </p>

          {/* Espace connexion / inscription */}
          <div className="carte p-5 mt-8 max-w-md">
            <p className="text-sm font-medium">Rejoignez la plateforme</p>
            <p className="text-xs text-slate mt-1">Déjà inscrit ? Connectez-vous. Sinon, créez votre compte en 1 minute.</p>
            <div className="flex gap-3 mt-4">
              <Link href="/login" className="btn-secondaire flex-1 text-center !px-4">Se connecter</Link>
              <Link href="/register" className="btn-principal flex-1 text-center !px-4">S'inscrire</Link>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto w-full">
          <HeroIllustration />
        </div>
      </section>

      {/* À propos */}
      <section className="bg-white border-y border-ink/10">
        <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <span className="font-mono text-xs text-amber uppercase tracking-widest">À propos</span>
            <h2 className="font-display font-bold text-2xl mt-2">Comment ça marche</h2>
          </div>
          <div className="md:col-span-2 grid sm:grid-cols-3 gap-6">
            {ETAPES.map((e) => (
              <div key={e.n}>
                <div className="w-9 h-9 rounded-full bg-ink text-paper grid place-items-center font-display font-bold">
                  {e.n}
                </div>
                <h3 className="font-display font-bold mt-3">{e.titre}</h3>
                <p className="text-sm text-slate mt-1 leading-relaxed">{e.texte}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Domaines */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <span className="font-mono text-xs text-amber uppercase tracking-widest">Domaines</span>
        <h2 className="font-display font-bold text-2xl mt-2">Des services dans tous les domaines</h2>
        <p className="text-sm text-slate mt-2">Et bien d'autres : les acteurs peuvent ajouter leur propre domaine.</p>
        <div className="flex flex-wrap gap-3 mt-6">
          {domainesServices.map((d) => (
            <Link
              key={d}
              href="/services"
              className="carte carte-hover px-5 py-3 text-sm font-medium"
            >
              {d}
            </Link>
          ))}
        </div>
      </section>

      {/* Appel final */}
      <section className="max-w-6xl mx-auto px-6 pb-8">
        <div className="bg-ink text-paper rounded-3xl p-8 md:p-12 grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h2 className="font-display font-bold text-2xl md:text-3xl">Rejoignez la communauté</h2>
            <p className="text-paper/70 mt-2 text-sm">
              Suivez notre chaîne et notre groupe WhatsApp pour ne rien manquer.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 md:justify-end">
            <a
              href="https://whatsapp.com/channel/0029Vb98OtHGE56fBwx6371l"
              target="_blank" rel="noopener noreferrer"
              className="bg-amber text-ink rounded-full px-6 py-3 text-sm font-medium text-center"
            >
              Suivre la chaîne
            </a>
            <a
              href="https://chat.whatsapp.com/K9MOnC8uxb0AKjGQuY9JkJ?s=sw&p=a&mlu=4&ilr=4"
              target="_blank" rel="noopener noreferrer"
              className="border border-paper/30 rounded-full px-6 py-3 text-sm font-medium text-center"
            >
              Rejoindre le groupe
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
