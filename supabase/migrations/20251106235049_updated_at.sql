create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at_profiles
before update on profiles
for each row execute function set_updated_at();

create trigger set_updated_at_conversations
before update on conversations
for each row execute function set_updated_at();

create trigger set_updated_at_messages
before update on messages
for each row execute function set_updated_at();
