create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

create index if not exists idx_messages_conversation_id on messages(conversation_id);
create index if not exists idx_messages_user_id on messages(user_id);
create index if not exists idx_messages_created_at on messages(created_at);