-- Create the conversations table
create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  name text,
  user_to_user boolean,
  user1_id uuid,
  user2_id uuid,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enforce user1_id < user2_id (ordering)
alter table conversations
add constraint user_order_check
check (user1_id < user2_id);

-- Prevent duplicate 1-to-1 conversations
create unique index unique_user_to_user_conversation
on conversations (user1_id, user2_id)
where user_to_user = true;

-- Index for faster queries
create index if not exists idx_conversations_created_at on conversations(created_at);

-- Enable Realtime
alter publication supabase_realtime add table public.conversations;