create or replace function public.adjust_habit_completion(
  p_habit_id uuid,
  p_log_date date,
  p_delta integer
)
returns integer
language plpgsql
security invoker
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
  habit_target integer;
  next_count integer;
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  if p_delta not in (-1, 1) then
    raise exception 'Completion delta must be -1 or 1';
  end if;

  select target_count
  into habit_target
  from public.habits
  where id = p_habit_id and user_id = current_user_id;

  if habit_target is null then
    raise exception 'Habit not found';
  end if;

  if p_delta = 1 then
    insert into public.habit_logs (user_id, habit_id, log_date, completed_count)
    values (current_user_id, p_habit_id, p_log_date, 1)
    on conflict (user_id, habit_id, log_date)
    do update set
      completed_count = least(habit_target, public.habit_logs.completed_count + 1),
      updated_at = now()
    returning completed_count into next_count;

    return next_count;
  end if;

  update public.habit_logs
  set completed_count = completed_count - 1,
      updated_at = now()
  where user_id = current_user_id
    and habit_id = p_habit_id
    and log_date = p_log_date
    and completed_count > 1
  returning completed_count into next_count;

  if found then return next_count; end if;

  delete from public.habit_logs
  where user_id = current_user_id
    and habit_id = p_habit_id
    and log_date = p_log_date;

  return 0;
end;
$$;

revoke all on function public.adjust_habit_completion(uuid, date, integer) from public, anon;
grant execute on function public.adjust_habit_completion(uuid, date, integer) to authenticated;
