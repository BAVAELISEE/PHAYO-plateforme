import Link from "next/link";

export const metadata = { title: "À propos — PHAYO" };

export default function APropos() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="font-display font-bold text-3xl">À propos de PHAYO</h1>
      <p className="mt-4 text-lg text-ink/80 leading-relaxed">
        PHAYO est une plateforme camerounaise : <strong>un site, tous les services</strong>.
        Notre but est simple : aider les gens à trouver rapidement quelqu’un de fiable près de
        chez eux, et aider les prestataires à se faire connaître.
      </p>

      <div className="grid sm:grid-cols-3 gap-4 mt-10">
        <div className="carte p-5">
          <p className="font-display font-bold">Pour les clients</p>
          <p className="text-sm text-ink/70 mt-2">
            Parcourez les services disponibles, choisissez par région et département, et
            envoyez une demande en quelques clics.
          </p>
        </div>
        <div className="carte p-5">
          <p className="font-display font-bold">Pour les acteurs</p>
          <p className="text-sm text-ink/70 mt-2">
            Publiez vos services et vos articles, recevez des demandes et soyez contacté
            directement par téléphone ou WhatsApp.
          </p>
        </div>
        <div className="carte p-5">
          <p className="font-display font-bold">Gratuit</p>
          <p className="text-sm text-ink/70 mt-2">
            L’inscription et l’utilisation du site sont gratuites. Aucun paiement ne passe par
            la plateforme : clients et acteurs s’entendent entre eux.
          </p>
        </div>
      </div>

      <h2 className="font-display font-bold text-xl mt-12">Comment ça marche ?</h2>
      <ol className="list-decimal pl-6 mt-3 space-y-2 text-ink/80">
        <li>Créez un compte client ou acteur.</li>
        <li>Les acteurs publient leurs services ; les clients envoient des demandes.</li>
        <li>Les deux parties se contactent grâce au numéro affiché et conviennent des détails.</li>
      </ol>

      <h2 className="font-display font-bold text-xl mt-12">Soutenir le projet</h2>
      <p className="mt-3 text-ink/80">
        PHAYO est un projet indépendant. Vous pouvez nous suivre sur WhatsApp et partager le
        site autour de vous : c’est la meilleure façon de nous aider.
      </p>

      <div className="flex flex-wrap gap-3 mt-8">
        <Link href="/register" className="btn-principal">Créer un compte</Link>
        <Link href="/contact" className="btn-secondaire">Nous contacter</Link>
      </div>
    </div>
  );
}
