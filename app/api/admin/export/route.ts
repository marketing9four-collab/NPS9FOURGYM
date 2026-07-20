import { NextRequest, NextResponse } from "next/server";
import { dashboardFiltersSchema } from "@/lib/validation/admin";
import { getAdminSupabaseClient } from "@/lib/supabase/server";
import { sanitizeSearchTerm } from "@/lib/admin/search";
import { buildResponsesCsv } from "@/lib/csv";
import type { SurveyResponseRow } from "@/lib/supabase/types";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const parsed = dashboardFiltersSchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams)
  );

  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "Filtros inválidos." }, { status: 400 });
  }

  const { unit, from, to, q, sort } = parsed.data;
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

  const [column, direction] = sort.split(".") as ["created_at", "asc" | "desc"];
  query = query.order(column, { ascending: direction === "asc" });

  const { data, error } = await query;

  if (error) {
    console.error("Erro ao exportar respostas:", error);
    return NextResponse.json(
      { ok: false, message: "Não foi possível gerar o arquivo CSV." },
      { status: 500 }
    );
  }

  const csv = buildResponsesCsv((data ?? []) as SurveyResponseRow[]);
  const filename = `pesquisa-9fourgym-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
