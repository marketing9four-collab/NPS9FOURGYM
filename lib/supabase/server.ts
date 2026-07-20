import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Cliente con la service role key: ignora RLS por completo.
 * Solo debe usarse dentro de código de servidor ya protegido por la sesión de
 * administrador (ver lib/auth/session.ts). El import "server-only" hace que el
 * build falle si este módulo termina en un bundle de cliente.
 */
export function getAdminSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error("Faltan las variables de entorno de Supabase (service role).");
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}
