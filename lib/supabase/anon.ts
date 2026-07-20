import { createClient } from "@supabase/supabase-js";

/**
 * Cliente con la clave anon/publishable. Usado únicamente por el endpoint público
 * de envío de encuestas. Las políticas RLS de `survey_responses` solo permiten
 * `insert` a este rol — es una segunda capa de defensa aunque el código de la ruta
 * tenga un bug, la base de datos rechaza cualquier lectura/escritura fuera de insert.
 */
export function getAnonSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Faltan las variables de entorno de Supabase (anon).");
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}
