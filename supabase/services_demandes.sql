-- Colonne de vérification sur les acteurs (validée par l'admin)
alter table profiles add column verifie boolean default false;


-- Table services : ce que chaque acteur propose
create table services (
  id uuid default gen_random_uuid() primary key,
  acteur_id uuid references profiles(id) on delete cascade not null,
  type text check (type in ('distance', 'presentiel')) not null,
  domaine text not null,        -- ex: "Éducatif", "Création de sites"
  titre text not null,
  description text,
  verifie boolean default false, -- validé par l'admin avant d'apparaître publiquement
  created_at timestamp with time zone default now()
);

alter table services enable row level security;

-- Tout le monde peut voir les services déjà vérifiés
create policy "Services vérifiés visibles par tous"
  on services for select
  using (verifie = true);

-- Un acteur peut voir tous SES services, même non vérifiés
create policy "Un acteur voit ses propres services"
  on services for select
  using (auth.uid() = acteur_id);

-- Un acteur peut créer/modifier/supprimer ses propres services
create policy "Un acteur gère ses propres services"
  on services for insert
  with check (auth.uid() = acteur_id);

create policy "Un acteur modifie ses propres services"
  on services for update
  using (auth.uid() = acteur_id);

create policy "Un acteur supprime ses propres services"
  on services for delete
  using (auth.uid() = acteur_id);

-- L'admin voit et modifie tous les services (pour la vérification)
create policy "L'admin gère tous les services"
  on services for all
  using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );


-- Table demandes : suivi client -> acteur -> service
create table demandes (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references profiles(id) on delete cascade not null,
  acteur_id uuid references profiles(id) on delete cascade not null,
  service_id uuid references services(id) on delete cascade not null,
  statut text check (statut in ('en_attente', 'en_cours', 'termine')) default 'en_attente',
  created_at timestamp with time zone default now()
);

alter table demandes enable row level security;

-- Le client voit ses propres demandes
create policy "Le client voit ses demandes"
  on demandes for select
  using (auth.uid() = client_id);

-- L'acteur voit les demandes qui lui sont adressées
create policy "L'acteur voit les demandes reçues"
  on demandes for select
  using (auth.uid() = acteur_id);

-- Le client peut créer une demande
create policy "Le client crée une demande"
  on demandes for insert
  with check (auth.uid() = client_id);

-- L'acteur peut mettre à jour le statut d'une demande qui lui est adressée
create policy "L'acteur met à jour le statut"
  on demandes for update
  using (auth.uid() = acteur_id);

-- L'admin voit et gère toutes les demandes
create policy "L'admin gère toutes les demandes"
  on demandes for all
  using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );
