-- 1️⃣ Create the messages table
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

-- 2️⃣ Enable Row Level Security (RLS)
alter table messages enable row level security;

-- 3️⃣ Create policies
create policy "Users can view their messages"
  on messages for select
  using (
    exists (
      select 1
      from conversation_participants
      where conversation_participants.conversation_id = messages.conversation_id
        and conversation_participants.user_id = auth.uid()
    )
  );

create policy "Users can send messages"
  on messages for insert
  with check (
    exists (
      select 1
      from conversation_participants
      where conversation_participants.conversation_id = messages.conversation_id
        and conversation_participants.user_id = auth.uid()
    )
  );

-- 4️⃣ Enable Realtime
alter publication supabase_realtime add table public.messages;
