-- Row Level Security: publico solo puede insertar, nadie mas puede leer/editar/borrar
-- via anon/authenticated. Las consultas del panel admin usan la service_role key,
-- que ignora RLS por diseño de Supabase (nunca expuesta al cliente).

alter table public.survey_responses enable row level security;

-- Asegura que no queden policies previas si esta migracion se re-ejecuta
drop policy if exists "anon_insert_only" on public.survey_responses;

create policy "anon_insert_only"
  on public.survey_responses
  for insert
  to anon
  with check (true);

-- Sin policies de select/update/delete para anon/authenticated:
-- quedan denegadas por defecto en cuanto RLS esta habilitado.
