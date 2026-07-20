import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/session";
import { Dashboard } from "@/components/admin/Dashboard";

export const metadata = {
  title: "Painel de resultados | 9FOURGYM",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  // El middleware ya protege esta ruta; esta es una segunda verificación
  // (defensa en profundidad) antes de tocar el cliente Supabase de servicio.
  if (!session) {
    redirect("/admin/nps-9fourgym/login");
  }

  return <Dashboard />;
}
