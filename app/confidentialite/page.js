export const metadata = { title: "Politique de confidentialité — PHAYO" };

export default function Confidentialite() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="font-display font-bold text-3xl">Politique de confidentialité</h1>
      <p className="text-ink/60 text-sm mt-2">Dernière mise à jour : 14 novembre 2026</p>

      <div className="mt-8 space-y-8 text-ink/80 leading-relaxed">
        <section>
          <h2 className="font-display font-bold text-xl text-ink mb-2">1. Qui sommes-nous ?</h2>
          <p>
            PHAYO est une plateforme camerounaise qui met en relation des clients et des acteurs
            (prestataires de services). Cette page explique quelles informations nous collectons
            et comment nous les utilisons.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl text-ink mb-2">2. Informations collectées</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>À l’inscription : nom, adresse e-mail, mot de passe (stocké de façon sécurisée), numéro de téléphone, région et département.</li>
            <li>Lorsque vous utilisez le site : services publiés, demandes envoyées, articles et photos que vous ajoutez.</li>
            <li>Données techniques classiques (type de navigateur, pages visitées) collectées par notre hébergeur et par nos partenaires publicitaires.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl text-ink mb-2">3. Utilisation des informations</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Créer et gérer votre compte.</li>
            <li>Mettre en relation clients et acteurs. Le numéro de téléphone indiqué sur un service ou une demande est visible par les autres utilisateurs, afin qu’ils puissent vous contacter.</li>
            <li>Améliorer le site et assurer sa sécurité.</li>
          </ul>
          <p className="mt-2">Nous ne vendons pas vos données personnelles.</p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl text-ink mb-2">4. Publicité Google AdSense et cookies</h2>
          <p>
            Ce site utilise Google AdSense pour afficher des annonces. Google et ses partenaires
            peuvent utiliser des cookies pour diffuser des annonces en fonction de vos visites sur
            ce site ou sur d’autres sites. Vous pouvez refuser la personnalisation des annonces
            dans les{" "}
            <a className="text-amber underline" href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
              paramètres des annonces Google
            </a>
            , et en savoir plus sur{" "}
            <a className="text-amber underline" href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">
              la façon dont Google utilise les données
            </a>
            . Vous pouvez aussi bloquer ou supprimer les cookies dans les réglages de votre navigateur.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl text-ink mb-2">5. Services tiers</h2>
          <p>
            Nous utilisons Supabase (comptes et base de données), Vercel (hébergement) et Google
            AdSense (publicité). Ces services traitent des données selon leurs propres politiques
            de confidentialité.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl text-ink mb-2">6. Vos droits</h2>
          <p>
            Vous pouvez modifier vos coordonnées ou supprimer votre compte à tout moment depuis la
            page « Mon profil ». Vous pouvez aussi nous écrire pour demander l’accès à vos
            données ou leur suppression.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl text-ink mb-2">7. Contact</h2>
          <p>
            Pour toute question, rendez-vous sur la page <a className="text-amber underline" href="/contact">Contact</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
