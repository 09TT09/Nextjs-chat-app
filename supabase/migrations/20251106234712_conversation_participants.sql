create table if not exists conversation_participants (
  user_id uuid not null references profiles(id) on delete cascade,
  conversation_id uuid not null references conversations(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  primary key (user_id, conversation_id)
);

create index if not exists idx_participants_user_id on conversation_participants(user_id);
create index if not exists idx_participants_conversation_id on conversation_participants(conversation_id);