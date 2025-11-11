create table if not exists friends (
  id bigint generated always as identity primary key,
  user_id uuid not null references profiles(id) on delete cascade,
  friend_id uuid not null references profiles(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  unique (user_id, friend_id)
);

create index if not exists idx_friends_user_id on friends(user_id);
create index if not exists idx_friends_friend_id on friends(friend_id);