alter table public.tasks
  add column if not exists reminder_at timestamptz;

create index if not exists tasks_user_reminder_idx
  on public.tasks (user_id, reminder_at)
  where reminder_at is not null and is_completed = false and archived_at is null;
