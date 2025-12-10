-- Enable Row Level Security (RLS)
/*alter table conversations enable row level security;*/

-- Create policies
/*
create policy "Users can view their conversations"
  on conversations
  for select
  using (
    exists (
      select 1
      from conversation_participants cp
      where cp.conversation_id = conversations.id
        and cp.user_id = auth.uid()
    )
  );

create policy "Users can create conversations"
  on conversations
  for insert
  with check (created_by = auth.uid());

create policy "Users can update their conversations"
  on conversations
  for update
  using (created_by = auth.uid())
  with check (created_by = auth.uid());
*/