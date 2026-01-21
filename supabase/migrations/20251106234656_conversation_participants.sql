-- Create the conversation_participants table
create table if not exists conversation_participants (
  user_id uuid not null references profiles(id) on delete cascade,
  conversation_id uuid not null references conversations(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, conversation_id)
);

-- Indexes for faster queries
create index if not exists idx_participants_user_id on conversation_participants(user_id);
create index if not exists idx_participants_conversation_id on conversation_participants(conversation_id);

-- Enable Row Level Security (RLS)
/*alter table public.conversation_participants enable row level security;*/

-- Create policies
/*
alter table conversation_participants enable row level security;

create policy "Users can view participants of their conversations"
  on conversation_participants
  for select
  using (
    exists (
      select 1
      from conversations c
      where c.id = conversation_participants.conversation_id
        and exists (
          select 1
          from conversation_participants cp
          where cp.conversation_id = c.id
            and cp.user_id = auth.uid()
        )
    )
  );

create policy "Users can join conversation"
  on conversation_participants
  for insert
  with check (user_id = auth.uid());
*/

-- Enable Realtime
alter publication supabase_realtime add table public.conversation_participants;