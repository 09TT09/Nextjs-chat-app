-- Trigger function to insert both friend rows
create or replace function public.handle_friend_acceptance()
returns trigger as $$
begin
  if new.status = 'accepted' then
    -- Temporarily disable RLS for this insert
    execute 'set local row_security = off';

    insert into friends (user_id, friend_id)
    values
      (new.sender_id, new.receiver_id),
      (new.receiver_id, new.sender_id)
    on conflict do nothing;
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Drop existing trigger if it exists
drop trigger if exists on_friend_request_updated on friend_requests;

-- Create trigger for updates on friend_requests
create trigger on_friend_request_updated
after update on friend_requests
for each row
when (old.status is distinct from new.status)
execute procedure public.handle_friend_acceptance();
