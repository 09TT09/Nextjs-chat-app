create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  name text,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

create index if not exists idx_conversations_created_at on conversations(created_at);