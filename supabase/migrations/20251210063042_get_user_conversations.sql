create or replace function public.get_user_conversations(user_uuid uuid)
returns table(
  conversation_id uuid,
  name text,
  created_at timestamp,
  other_user_id uuid,
  other_user_pseudo text,
  other_user_email text,
  other_user_picture text
) as $$
begin
  return query
  select
    c.id,
    c.name,
    c.created_at,
    p.user_id as other_user_id,
    prof.pseudo,
    prof.email,
    prof.picture
  from conversations c
  join conversation_participants cp1 on cp1.conversation_id = c.id
  join conversation_participants p on p.conversation_id = c.id and p.user_id != user_uuid
  join profiles prof on prof.id = p.user_id;
end;
$$ language plpgsql security definer;
