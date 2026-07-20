import { NextRequest, NextResponse } from "next/server";
import { dashboardFiltersSchema } from "@/lib/validation/admin";
import { getAdminSupabaseClient } from "@/lib/supabase/server";
import { sanitizeSearchTerm } from "@/lib/admin/search";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const parsed = dashboardFiltersSchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams)
  );

  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "Filtros inválidos." }, { status: 400 });
  }

  const { unit, from, to, q, page, pageSize, sort } = parsed.data;
  const supabase = getAdminSupabaseClient();

  let query = supabase.from("survey_responses").select("*", { count: "exact" });

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

  const from_ = (page - 1) * pageSize;
  const to_ = from_ + pageSize - 1;
  query = query.range(from_, to_);

  const { data, error, count } = await query;

  if (error) {
    console.error("Erro ao listar respostas:", error);
    return NextResponse.json(
      { ok: false, message: "Não foi possível carregar as respostas." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    rows: data,
    total: count ?? 0,
    page,
    pageSize,
  });
}
