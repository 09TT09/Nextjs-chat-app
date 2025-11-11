create extension if not exists pgcrypto;

create table if not exists profiles (
  id uuid references auth.users on delete cascade not null primary key,
  pseudo text unique,
  firstname text,
  lastname text,
  email text not null unique,
  picture text,
  friendcode text not null unique default encode(extensions.gen_random_bytes(5), 'hex'),
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table profiles enable row level security;

create policy "ALL Users can view each other profile"
  on profiles for select
  using (true);

create policy "Users can insert their own profile."
  on profiles for insert
  with check ((select auth.uid()) = id);

create policy "Users can update own profile."
  on profiles for update
  using ((select auth.uid()) = id);