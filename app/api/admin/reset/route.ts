import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabaseClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const CONFIRM_PHRASE = "APAGAR TUDO";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const confirm = (body as { confirm?: string } | null)?.confirm;
  if (confirm !== CONFIRM_PHRASE) {
    return NextResponse.json(
      { ok: false, message: `Digite "${CONFIRM_PHRASE}" para confirmar.` },
      { status: 400 }
    );
  }

  const supabase = getAdminSupabaseClient();
  // neq com um uuid impossivel = corresponde a todas as linhas; Postgres/PostgREST
  // nao permite um delete sem condicao "where".
  const { error, count } = await supabase
    .from("survey_responses")
    .delete({ count: "exact" })
    .neq("id", "00000000-0000-0000-0000-000000000000");

  if (error) {
    console.error("Erro ao apagar as respostas:", error);
    return NextResponse.json(
      { ok: false, message: "Não foi possível apagar os dados." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, deleted: count ?? 0 });
}
