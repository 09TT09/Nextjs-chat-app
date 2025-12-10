create or replace function public.create_user_to_user_conversation(other_user uuid)
returns table(conversation_id uuid) as $$
declare new_conv_id uuid;
begin
  -- 1. Create conversation with current logged-in user
  insert into conversations (user_to_user, created_by)
  values (true, auth.uid())
  returning id into new_conv_id;

  -- 2. Add participants: current user and the other user
  insert into conversation_participants (conversation_id, user_id)
  values (new_conv_id, auth.uid()), (new_conv_id, other_user);

  -- 3. Return the new conversation id
  return query select new_conv_id;
end;
$$ language plpgsql security definer;

alter function public.create_user_to_user_conversation(uuid) owner to postgres;