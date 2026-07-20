-- Comentario opcional de texto libre por pregunta.
-- Objeto {questionId: string}; solo incluye preguntas donde el usuario escribió algo.
alter table public.survey_responses
  add column if not exists comments jsonb;

comment on column public.survey_responses.comments is
  'Comentarios opcionales por pregunta: {questionId: texto}. Ausente/null si nadie comentó.';
