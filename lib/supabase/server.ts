import "server-only";
import { createClient } from "@supabase/supabase-js";
import { requiredEnv } from "@/lib/env";

/**
 * Cliente con la service role key: ignora RLS por completo. Nunca se expone
 * al cliente (import "server-only" hace que el build falle si este módulo
 * termina en un bundle de cliente). Se usa en: (1) rutas del panel admin, ya
 * protegidas por la sesión de administrador (ver lib/auth/session.ts), y
 * (2) la actualización puntual de una fila en app/api/survey/route.ts,
 * acotada a un único submission_id ya validado con Zod.
 */
export function getAdminSupabaseClient() {
  const url = requiredEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceKey = requiredEnv("SUPABASE_SERVICE_ROLE_KEY");

  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}
