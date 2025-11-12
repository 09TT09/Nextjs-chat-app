create table if not exists friend_requests (
  id bigint generated always as identity primary key,
  sender_id uuid not null references profiles(id) on delete cascade,
  receiver_id uuid not null references profiles(id) on delete cascade,
  status text check (status in ('pending', 'accepted', 'rejected')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  unique (sender_id, receiver_id)
);

create index if not exists idx_friend_requests_sender_id on friend_requests(sender_id);
create index if not exists idx_friend_requests_receiver_id on friend_requests(receiver_id);

alter table friend_requests enable row level security;

-- Users can view their own incoming or outgoing requests
create policy "Users can view own friend requests"
  on friend_requests for select
  using (sender_id = auth.uid() or receiver_id = auth.uid());

-- Users can send requests (insert)
create policy "Users can send friend requests"
  on friend_requests for insert
  with check (sender_id = auth.uid());

-- Users can accept or reject requests they received
create policy "Receivers can update request status"
  on friend_requests for update
  using (receiver_id = auth.uid())
  with check (receiver_id = auth.uid());

-- Enable Realtime on the table
alter publication supabase_realtime add table public.friend_requests;
