-- Enable the pgcrypto extension (for generating friendcodes, etc.)
create extension if not exists pgcrypto;

-- Function: handle_new_user
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (
    id,
    email,
    pseudo,
    firstname,
    lastname
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'pseudo', null),
    coalesce(new.raw_user_meta_data->>'firstname', null),
    coalesce(new.raw_user_meta_data->>'lastname', null)
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
