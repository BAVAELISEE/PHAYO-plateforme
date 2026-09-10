# Plateforme Services — Next.js + Supabase

Squelette basé sur le plan : services à distance / présentiels, 3 rôles
(client, acteur, admin). Pas de paiement pour les acteurs — un bloc de
soutien (numéros de téléphone) est affiché en bas de chaque page à la place.

## Lancer le projet

1. Copiez `.env.local.example` en `.env.local` et remplissez avec vos clés
   Supabase (Settings > API sur supabase.com).
2. Exécutez `supabase/profiles.sql` dans le SQL Editor de votre projet Supabase.
3. Puis :

```bash
npm install
npm run dev
```

Ouvrez http://localhost:3000

## Structure

- `app/` — pages (App Router)
- `components/` — Header, Footer (avec les numéros de soutien), ServiceCard
- `lib/data.js` — données de démonstration (à remplacer par Supabase)
- `lib/supabase.js` — client Supabase
- `supabase/profiles.sql` — table des profils + rôles + trigger d'inscription

## Prochaines étapes

1. Remplacer `lib/data.js` par de vraies requêtes Supabase.
2. Ajouter la page de détail d'un service.
3. Protéger les routes `/client`, `/acteur`, `/admin` selon le rôle connecté.
