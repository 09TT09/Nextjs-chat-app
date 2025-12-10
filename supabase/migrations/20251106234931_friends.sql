-- Create the friend table
create table if not exists friends (
  id bigint generated always as identity primary key,
  user_id uuid not null references profiles(id) on delete cascade,
  friend_id uuid not null references profiles(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  unique (user_id, friend_id)
);

-- Indexes for faster queries
create index if not exists idx_friends_user_id on friends(user_id);
create index if not exists idx_friends_friend_id on friends(friend_id);

-- Enable RLS
/*alter table friends enable row level security;*/

-- Create policies
create policy "Users can insert own friends"
  on friends for insert
  with check (user_id = auth.uid());

create policy "Users can select own friends"
  on friends for select
  using (user_id = auth.uid());

-- Triggered functions
create or replace function public.handle_friend_acceptance()
returns trigger as $$
begin
  if new.status = 'accepted' then
    insert into friends (user_id, friend_id)
    values (LEAST(new.sender_id, new.receiver_id), GREATEST(new.sender_id, new.receiver_id))
    on conflict do nothing;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_friend_request_updated on friend_requests;

create trigger on_friend_request_updated
after update on friend_requests
for each row
when (old.status is distinct from new.status)
execute procedure public.handle_friend_acceptance();
