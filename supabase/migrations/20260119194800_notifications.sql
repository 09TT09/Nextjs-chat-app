-- Create the notifications table
create table if not exists notifications (
  id bigint generated always as identity primary key,
  recipient_id uuid not null references profiles(id) on delete cascade,
  sender_id uuid references profiles(id) on delete set null,
  type text not null,
  entity_type text not null,
  entity_id text not null,
  created_at timestamptz default now(),
  read_at timestamptz
);

-- Index for faster queries
create index if not exists idx_notifications_unread on notifications (recipient_id, created_at desc) where read_at is null;
create index if not exists idx_notifications_recipient_created_at on notifications (recipient_id, created_at desc);