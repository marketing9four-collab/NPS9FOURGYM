import { NextRequest, NextResponse } from "next/server";
import { dashboardFiltersSchema } from "@/lib/validation/admin";
import { getAdminSupabaseClient } from "@/lib/supabase/server";
import { sanitizeSearchTerm } from "@/lib/admin/search";
import { computeDashboardStats } from "@/lib/admin/aggregate";
import type { SurveyResponseRow } from "@/lib/supabase/types";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const parsed = dashboardFiltersSchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams)
  );

  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "Filtros inválidos." }, { status: 400 });
  }

  const { unit, from, to, q } = parsed.data;
  const supabase = getAdminSupabaseClient();

  let query = supabase.from("survey_responses").select("*");

  if (unit) query = query.eq("unit", unit);
  if (from) query = query.gte("created_at", from);
  if (to) query = query.lte("created_at", to);
  if (q) {
    const term = sanitizeSearchTerm(q);
    if (term) {
      query = query.or(`respondent_name.ilike.%${term}%,respondent_email.ilike.%${term}%`);
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error("Erro ao calcular métricas:", error);
    return NextResponse.json(
      { ok: false, message: "Não foi possível calcular as métricas." },
      { status: 500 }
    );
  }

  const stats = computeDashboardStats((data ?? []) as SurveyResponseRow[]);
  return NextResponse.json({ ok: true, stats });
}
