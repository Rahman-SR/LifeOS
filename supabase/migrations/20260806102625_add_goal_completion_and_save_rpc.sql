alter table public.goals
  add column if not exists completed_at timestamptz;

update public.goals
set
  progress = 100,
  completed_at = coalesce(completed_at, updated_at, now())
where status = 'completed';

update public.goals
set completed_at = null
where status in ('active', 'paused');

alter table public.goals
  drop constraint if exists goals_completion_state_check;

alter table public.goals
  add constraint goals_completion_state_check check (
    (status = 'completed' and progress = 100 and completed_at is not null)
    or (status in ('active', 'paused') and completed_at is null)
    or status = 'archived'
  );

create index if not exists goals_user_status_target_updated_idx
  on public.goals (user_id, status, target_date, updated_at desc);

create index if not exists goals_user_status_completed_idx
  on public.goals (user_id, status, completed_at desc, updated_at desc);

create or replace function public.save_goal_with_milestones(
  p_goal_id uuid,
  p_title text,
  p_description text,
  p_target_date date,
  p_progress smallint,
  p_status text,
  p_completed_at timestamptz,
  p_milestones jsonb
)
returns public.goals
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_goal public.goals;
  v_item jsonb;
  v_milestone_id uuid;
  v_milestone_title text;
  v_is_completed boolean;
  v_position integer := 0;
  v_seen_ids uuid[] := array[]::uuid[];
begin
  if v_user_id is null then
    raise exception 'Authentication is required.' using errcode = '42501';
  end if;

  if p_milestones is null or jsonb_typeof(p_milestones) <> 'array' then
    raise exception 'Milestones must be a JSON array.' using errcode = '22023';
  end if;

  if exists (
    select 1
    from jsonb_array_elements(p_milestones) item
    where nullif(item ->> 'id', '') is not null
    group by item ->> 'id'
    having count(*) > 1
  ) then
    raise exception 'A milestone cannot appear more than once.' using errcode = '22023';
  end if;

  if p_status = 'completed' then
    p_progress := 100;
    p_completed_at := coalesce(p_completed_at, now());
  elsif p_status in ('active', 'paused') then
    p_completed_at := null;
  end if;

  if p_goal_id is null then
    insert into public.goals (
      user_id,
      title,
      description,
      target_date,
      progress,
      status,
      completed_at
    )
    values (
      v_user_id,
      trim(p_title),
      nullif(trim(p_description), ''),
      p_target_date,
      p_progress,
      p_status,
      p_completed_at
    )
    returning * into v_goal;
  else
    update public.goals
    set
      title = trim(p_title),
      description = nullif(trim(p_description), ''),
      target_date = p_target_date,
      progress = p_progress,
      status = p_status,
      completed_at = p_completed_at
    where id = p_goal_id
      and user_id = v_user_id
    returning * into v_goal;

    if not found then
      raise exception 'Goal not found or access denied.' using errcode = 'P0002';
    end if;
  end if;

  for v_item in select value from jsonb_array_elements(p_milestones)
  loop
    v_milestone_id := nullif(v_item ->> 'id', '')::uuid;
    v_milestone_title := trim(coalesce(v_item ->> 'title', ''));
    v_is_completed := coalesce((v_item ->> 'is_completed')::boolean, false);

    if char_length(v_milestone_title) < 1 or char_length(v_milestone_title) > 240 then
      raise exception 'Milestone titles must contain between 1 and 240 characters.' using errcode = '22023';
    end if;

    if v_milestone_id is null then
      insert into public.goal_milestones (
        user_id,
        goal_id,
        title,
        is_completed,
        completed_at,
        position
      )
      values (
        v_user_id,
        v_goal.id,
        v_milestone_title,
        v_is_completed,
        case when v_is_completed then now() else null end,
        v_position
      )
      returning id into v_milestone_id;
    else
      update public.goal_milestones
      set
        title = v_milestone_title,
        is_completed = v_is_completed,
        completed_at = case
          when v_is_completed then coalesce(completed_at, now())
          else null
        end,
        position = v_position
      where id = v_milestone_id
        and goal_id = v_goal.id
        and user_id = v_user_id;

      if not found then
        raise exception 'Milestone not found or access denied.' using errcode = 'P0002';
      end if;
    end if;

    v_seen_ids := array_append(v_seen_ids, v_milestone_id);
    v_position := v_position + 1;
  end loop;

  if cardinality(v_seen_ids) = 0 then
    delete from public.goal_milestones
    where goal_id = v_goal.id
      and user_id = v_user_id;
  else
    delete from public.goal_milestones
    where goal_id = v_goal.id
      and user_id = v_user_id
      and not (id = any(v_seen_ids));
  end if;

  return v_goal;
end;
$$;

revoke all on function public.save_goal_with_milestones(
  uuid,
  text,
  text,
  date,
  smallint,
  text,
  timestamptz,
  jsonb
) from public, anon;

grant execute on function public.save_goal_with_milestones(
  uuid,
  text,
  text,
  date,
  smallint,
  text,
  timestamptz,
  jsonb
) to authenticated;
