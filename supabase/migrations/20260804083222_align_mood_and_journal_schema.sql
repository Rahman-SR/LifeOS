do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'mood_logs'
      and column_name = 'log_date'
  ) then
    alter table public.mood_logs rename column log_date to mood_date;
  end if;
end
$$;

alter table public.mood_logs
  add column if not exists mood text;

update public.mood_logs
set mood = case mood_score
  when 5 then 'excellent'
  when 4 then 'good'
  when 3 then 'okay'
  when 2 then 'low'
  else 'bad'
end
where mood is null;

alter table public.mood_logs
  alter column mood set not null,
  alter column mood_score drop not null;

alter table public.mood_logs
  drop constraint if exists mood_logs_mood_check;

alter table public.mood_logs
  add constraint mood_logs_mood_check
  check (mood in ('excellent', 'good', 'okay', 'low', 'bad'));

alter table public.journal_entries
  add column if not exists went_well text,
  add column if not exists was_difficult text,
  add column if not exists improve_tomorrow text;

create index if not exists mood_logs_user_date_desc_idx
  on public.mood_logs (user_id, mood_date desc);

create index if not exists journal_entries_user_date_desc_idx
  on public.journal_entries (user_id, entry_date desc);

-- Legacy numeric score columns remain nullable for backwards-compatible data retention.
-- Existing owner-only RLS policies and authenticated CRUD grants remain in force.
