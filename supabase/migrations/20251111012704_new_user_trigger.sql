-- Enable the pgcrypto extension (for generating friendcodes, etc.)
create extension if not exists pgcrypto;

-- Function: handle_new_user
create or replace function public.handle_new_user()
returns trigger as $$
declare
  pictures text[] := array[
    '/default/avatars/avatar-blue.webp',
    '/default/avatars/avatar-cyan.webp',
    '/default/avatars/avatar-green.webp',
    '/default/avatars/avatar-orange.webp',
    '/default/avatars/avatar-red.webp',
    '/default/avatars/avatar-violet.webp',
    '/default/avatars/avatar-yellow.webp'
  ];
  rand_index int;
begin
  rand_index := floor(random() * 7 + 1);

  insert into public.profiles (
    id,
    email,
    pseudo,
    firstname,
    lastname,
    picture
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'pseudo', null),
    coalesce(new.raw_user_meta_data->>'firstname', null),
    coalesce(new.raw_user_meta_data->>'lastname', null),
    pictures[rand_index]
  );

  return new;
end;
$$ language plpgsql security definer;

-- Drop existing trigger if present (to make this migration idempotent)
drop trigger if exists on_auth_user_created on auth.users;

-- Create trigger: runs automatically after a new auth user is created
create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();
