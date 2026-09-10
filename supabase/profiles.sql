create table profiles (
  id uuid references auth.users on delete cascade primary key,
  nom text,
  role text check (role in ('client', 'acteur', 'admin')) default 'client',
  region text,
  departement text,
  created_at timestamp with time zone default now()
);

alter table profiles enable row level security;

create policy "Chacun peut lire son propre profil"
  on profiles for select
  using (auth.uid() = id);

create policy "Chacun peut modifier son propre profil"
  on profiles for update
  using (auth.uid() = id);

create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nom, role, region, departement)
  values (
    new.id,
    new.raw_user_meta_data->>'nom',
    coalesce(new.raw_user_meta_data->>'role', 'client'),
    new.raw_user_meta_data->>'region',
    new.raw_user_meta_data->>'departement'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
