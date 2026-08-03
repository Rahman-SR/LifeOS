create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 120),
  avatar_url text,
  timezone text not null default 'UTC',
  week_starts_on smallint not null default 1 check (week_starts_on between 0 and 6),
  theme_preference text not null default 'system'
    check (theme_preference in ('system', 'light', 'dark')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.task_categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  color text not null check (color ~ '^#[0-9A-Fa-f]{6}$'),
  icon text,
  position integer not null default 0 check (position >= 0),
  created_at timestamptz not null default now(),
  constraint task_categories_user_name_key unique (user_id, name),
  constraint task_categories_user_id_id_key unique (user_id, id)
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  category_id uuid,
  title text not null check (char_length(title) between 1 and 240),
  description text,
  due_date date,
  due_time time,
  priority text not null default 'medium'
    check (priority in ('low', 'medium', 'high')),
  is_completed boolean not null default false,
  completed_at timestamptz,
  recurrence_rule text,
  position integer not null default 0 check (position >= 0),
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tasks_completion_state_check check (
    (is_completed and completed_at is not null)
    or (not is_completed and completed_at is null)
  ),
  constraint tasks_user_category_fkey
    foreign key (user_id, category_id)
    references public.task_categories (user_id, id)
    on delete set null (category_id)
);

create table public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 160),
  description text,
  color text not null check (color ~ '^#[0-9A-Fa-f]{6}$'),
  icon text,
  frequency_type text not null default 'daily'
    check (frequency_type in ('daily', 'weekly', 'custom')),
  target_count integer not null default 1 check (target_count > 0),
  days_of_week smallint[] not null default array[]::smallint[],
  reminder_time time,
  is_active boolean not null default true,
  position integer not null default 0 check (position >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint habits_days_of_week_check check (
    days_of_week <@ array[0, 1, 2, 3, 4, 5, 6]::smallint[]
  ),
  constraint habits_user_id_id_key unique (user_id, id)
);

create table public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  habit_id uuid not null,
  log_date date not null,
  completed_count integer not null default 1 check (completed_count >= 0),
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint habit_logs_user_habit_date_key unique (user_id, habit_id, log_date),
  constraint habit_logs_user_habit_fkey
    foreign key (user_id, habit_id)
    references public.habits (user_id, id)
    on delete cascade
);

create table public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null default '' check (char_length(title) <= 240),
  content text not null default '',
  color text,
  is_pinned boolean not null default false,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint notes_color_check check (color is null or color ~ '^#[0-9A-Fa-f]{6}$')
);

create table public.mood_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  log_date date not null,
  mood_score smallint not null check (mood_score between 1 and 5),
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint mood_logs_user_date_key unique (user_id, log_date)
);

create table public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  entry_date date not null,
  title text check (title is null or char_length(title) <= 240),
  content text not null default '',
  mood_score smallint check (mood_score between 1 and 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint journal_entries_user_date_key unique (user_id, entry_date)
);

create table public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 240),
  description text,
  target_date date,
  status text not null default 'active'
    check (status in ('active', 'completed', 'paused', 'archived')),
  progress smallint not null default 0 check (progress between 0 and 100),
  color text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint goals_color_check check (color is null or color ~ '^#[0-9A-Fa-f]{6}$'),
  constraint goals_user_id_id_key unique (user_id, id)
);

create table public.goal_milestones (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  goal_id uuid not null,
  title text not null check (char_length(title) between 1 and 240),
  is_completed boolean not null default false,
  completed_at timestamptz,
  position integer not null default 0 check (position >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint goal_milestones_completion_state_check check (
    (is_completed and completed_at is not null)
    or (not is_completed and completed_at is null)
  ),
  constraint goal_milestones_user_goal_fkey
    foreign key (user_id, goal_id)
    references public.goals (user_id, id)
    on delete cascade
);

create table public.notification_preferences (
  user_id uuid primary key references auth.users (id) on delete cascade,
  task_reminders_enabled boolean not null default true,
  habit_reminders_enabled boolean not null default true,
  daily_summary_enabled boolean not null default false,
  daily_summary_time time not null default '20:00',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index tasks_user_category_idx on public.tasks (user_id, category_id);
create index tasks_user_due_idx on public.tasks (user_id, due_date, due_time)
  where is_completed = false and archived_at is null;
create index tasks_user_updated_idx on public.tasks (user_id, updated_at desc);
create index habits_user_active_idx on public.habits (user_id, position)
  where is_active = true;
create index habit_logs_user_date_idx on public.habit_logs (user_id, log_date desc);
create index notes_user_updated_idx on public.notes (user_id, is_pinned desc, updated_at desc)
  where archived_at is null;
create index goals_user_status_idx on public.goals (user_id, status, target_date);
create index goal_milestones_user_goal_idx
  on public.goal_milestones (user_id, goal_id, position);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger tasks_set_updated_at
before update on public.tasks
for each row execute function public.set_updated_at();

create trigger habits_set_updated_at
before update on public.habits
for each row execute function public.set_updated_at();

create trigger habit_logs_set_updated_at
before update on public.habit_logs
for each row execute function public.set_updated_at();

create trigger notes_set_updated_at
before update on public.notes
for each row execute function public.set_updated_at();

create trigger mood_logs_set_updated_at
before update on public.mood_logs
for each row execute function public.set_updated_at();

create trigger journal_entries_set_updated_at
before update on public.journal_entries
for each row execute function public.set_updated_at();

create trigger goals_set_updated_at
before update on public.goals
for each row execute function public.set_updated_at();

create trigger goal_milestones_set_updated_at
before update on public.goal_milestones
for each row execute function public.set_updated_at();

create trigger notification_preferences_set_updated_at
before update on public.notification_preferences
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested_name text;
begin
  requested_name := nullif(trim(new.raw_user_meta_data ->> 'display_name'), '');

  insert into public.profiles (id, display_name)
  values (
    new.id,
    left(
      coalesce(
        requested_name,
        nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
        'LifeOS User'
      ),
      120
    )
  );

  insert into public.notification_preferences (user_id)
  values (new.id);

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

revoke all on function public.set_updated_at() from public, anon, authenticated;
revoke all on function public.handle_new_user() from public, anon, authenticated;

alter table public.profiles enable row level security;
alter table public.task_categories enable row level security;
alter table public.tasks enable row level security;
alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;
alter table public.notes enable row level security;
alter table public.mood_logs enable row level security;
alter table public.journal_entries enable row level security;
alter table public.goals enable row level security;
alter table public.goal_milestones enable row level security;
alter table public.notification_preferences enable row level security;

create policy "Users can read their profile"
on public.profiles for select
to authenticated
using ((select auth.uid()) = id);

create policy "Users can update their profile"
on public.profiles for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "Users manage their task categories"
on public.task_categories for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users manage their tasks"
on public.tasks for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users manage their habits"
on public.habits for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users manage their habit logs"
on public.habit_logs for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users manage their notes"
on public.notes for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users manage their mood logs"
on public.mood_logs for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users manage their journal entries"
on public.journal_entries for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users manage their goals"
on public.goals for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users manage their goal milestones"
on public.goal_milestones for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can read notification preferences"
on public.notification_preferences for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can update notification preferences"
on public.notification_preferences for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

revoke all on all tables in schema public from anon;
grant usage on schema public to authenticated;
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on
  public.task_categories,
  public.tasks,
  public.habits,
  public.habit_logs,
  public.notes,
  public.mood_logs,
  public.journal_entries,
  public.goals,
  public.goal_milestones
to authenticated;
grant select, update on public.notification_preferences to authenticated;
