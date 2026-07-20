-- 9FOURGYM NPS survey: main table
create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'gym_unit') then
    create type public.gym_unit as enum ('ARBOLEDAS', 'METEPEC', 'INTERLOMAS', 'LOMAS');
  end if;
end
$$;

create table if not exists public.survey_responses (
  id                uuid primary key default gen_random_uuid(),
  submission_id     uuid not null unique,
  unit              public.gym_unit not null,
  respondent_name   text not null default 'Usuario Anónimo',
  respondent_email  text,
  answers           jsonb not null,
  overall_average   numeric(4, 2),
  completed         boolean not null default true,
  user_agent        text,
  created_at        timestamptz not null default now()
);

create index if not exists idx_survey_responses_created_at
  on public.survey_responses (created_at desc);

create index if not exists idx_survey_responses_unit
  on public.survey_responses (unit);

create index if not exists idx_survey_responses_answers_gin
  on public.survey_responses using gin (answers);

comment on table public.survey_responses is
  'Respuestas de la encuesta de satisfaccion/NPS de 9FOURGYM. answers es un objeto {questionId: number|null}, donde null representa "N/A".';
