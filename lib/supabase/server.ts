import "server-only";
import { createClient } from "@supabase/supabase-js";
import { requiredEnv } from "@/lib/env";

/**
 * Cliente con la service role key: ignora RLS por completo.
 * Solo debe usarse dentro de código de servidor ya protegido por la sesión de
 * administrador (ver lib/auth/session.ts). El import "server-only" hace que el
 * build falle si este módulo termina en un bundle de cliente.
 */
export function getAdminSupabaseClient() {
  const url = requiredEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceKey = requiredEnv("SUPABASE_SERVICE_ROLE_KEY");

  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}
