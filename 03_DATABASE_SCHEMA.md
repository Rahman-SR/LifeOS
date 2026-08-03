# LifeOS — Supabase Database Schema

## 1. Database Principles

- Use PostgreSQL through Supabase
- Every user-owned row must contain `user_id`
- Enable Row Level Security on every user-owned table
- Use UUID primary keys
- Use `timestamptz` for timestamps
- Use `date` for daily records
- Use soft archive fields where useful
- Create indexes for common filters

---

## 2. Extensions

```sql
create extension if not exists "pgcrypto";
```

---

## 3. Profiles

```sql
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  avatar_url text,
  timezone text not null default 'Asia/Kolkata',
  week_starts_on smallint not null default 1 check (week_starts_on between 0 and 6),
  time_format text not null default '12h' check (time_format in ('12h', '24h')),
  theme text not null default 'system' check (theme in ('system', 'light', 'dark')),
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

---

## 4. Task Categories

```sql
create table public.task_categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  icon text,
  color_token text,
  created_at timestamptz not null default now(),
  unique(user_id, name)
);
```

---

## 5. Tasks

```sql
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category_id uuid references public.task_categories(id) on delete set null,
  title text not null check (char_length(title) between 1 and 180),
  description text,
  priority text not null default 'medium'
    check (priority in ('low', 'medium', 'high')),
  due_date date,
  due_time time,
  reminder_at timestamptz,
  is_completed boolean not null default false,
  completed_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### Recommended Indexes

```sql
create index tasks_user_due_date_idx
  on public.tasks(user_id, due_date);

create index tasks_user_completed_idx
  on public.tasks(user_id, is_completed);
```

---

## 6. Habits

```sql
create table public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  description text,
  icon text,
  color_token text,
  frequency_type text not null default 'daily'
    check (frequency_type in ('daily', 'weekdays')),
  weekdays smallint[] not null default '{}',
  reminder_time time,
  target_count integer not null default 1 check (target_count > 0),
  is_active boolean not null default true,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

---

## 7. Habit Logs

```sql
create table public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  habit_id uuid not null references public.habits(id) on delete cascade,
  log_date date not null,
  completed_count integer not null default 1 check (completed_count >= 0),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, habit_id, log_date)
);
```

### Index

```sql
create index habit_logs_user_date_idx
  on public.habit_logs(user_id, log_date);
```

---

## 8. Notes

```sql
create table public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  content text not null default '',
  is_pinned boolean not null default false,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### Index

```sql
create index notes_user_updated_idx
  on public.notes(user_id, updated_at desc);
```

---

## 9. Mood Logs

```sql
create table public.mood_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  mood_date date not null,
  mood text not null
    check (mood in ('excellent', 'good', 'okay', 'low', 'bad')),
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, mood_date)
);
```

---

## 10. Journal Entries

```sql
create table public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_date date not null,
  title text,
  content text not null default '',
  went_well text,
  was_difficult text,
  improve_tomorrow text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, entry_date)
);
```

---

## 11. Goals

```sql
create table public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 180),
  description text,
  target_date date,
  progress integer not null default 0 check (progress between 0 and 100),
  status text not null default 'active'
    check (status in ('active', 'completed', 'paused', 'archived')),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

---

## 12. Goal Milestones

```sql
create table public.goal_milestones (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  goal_id uuid not null references public.goals(id) on delete cascade,
  title text not null,
  is_completed boolean not null default false,
  completed_at timestamptz,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

---

## 13. Notification Preferences

```sql
create table public.notification_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  notifications_enabled boolean not null default true,
  morning_reminder_enabled boolean not null default false,
  morning_reminder_time time,
  evening_reminder_enabled boolean not null default false,
  evening_reminder_time time,
  journal_reminder_enabled boolean not null default false,
  journal_reminder_time time,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

---

## 14. Updated At Trigger

```sql
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
```

Create triggers for tables containing `updated_at`.

Example:

```sql
create trigger tasks_set_updated_at
before update on public.tasks
for each row execute function public.set_updated_at();
```

Repeat for:

- profiles
- tasks
- habits
- habit_logs
- notes
- mood_logs
- journal_entries
- goals
- goal_milestones
- notification_preferences

---

## 15. Create Profile Automatically

```sql
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', 'LifeOS User')
  );

  insert into public.notification_preferences (user_id)
  values (new.id);

  return new;
end;
$$;
```

```sql
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
```

---

## 16. Row Level Security

Enable RLS:

```sql
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
```

### Profile Policies

```sql
create policy "Users can view own profile"
on public.profiles for select
using (auth.uid() = id);

create policy "Users can update own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);
```

### Generic User-Owned Table Policies

Use the following pattern for each table containing `user_id`.

```sql
create policy "Users can view own rows"
on public.tasks for select
using (auth.uid() = user_id);

create policy "Users can insert own rows"
on public.tasks for insert
with check (auth.uid() = user_id);

create policy "Users can update own rows"
on public.tasks for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own rows"
on public.tasks for delete
using (auth.uid() = user_id);
```

Repeat and rename for:

- task_categories
- habits
- habit_logs
- notes
- mood_logs
- journal_entries
- goals
- goal_milestones
- notification_preferences

---

## 17. Storage

Create an optional bucket:

```text
avatars
```

Recommended rules:

- Public read only if desired
- Authenticated users can upload only into their own folder
- Maximum file size should be restricted
- Allow only image MIME types

Example path:

```text
{user_id}/avatar.jpg
```

---

## 18. Data Integrity Rules

- A mood entry is unique per user per date
- A journal entry is unique per user per date
- A habit log is unique per user, habit, and date
- Goal progress stays between 0 and 100
- Task title and habit name cannot be empty
- Deleting a user removes their user-owned records
- Archived records remain hidden from normal lists

---

## 19. Suggested TypeScript Types

```ts
export type TaskPriority = "low" | "medium" | "high";

export type MoodValue =
  | "excellent"
  | "good"
  | "okay"
  | "low"
  | "bad";

export type GoalStatus =
  | "active"
  | "completed"
  | "paused"
  | "archived";
```

Generate full database types using the Supabase CLI after the schema is applied.
