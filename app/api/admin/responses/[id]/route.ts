import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabaseClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = getAdminSupabaseClient();

  const { data, error } = await supabase
    .from("survey_responses")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Erro ao obter a resposta:", error);
    return NextResponse.json(
      { ok: false, message: "Não foi possível carregar a resposta." },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json({ ok: false, message: "Resposta não encontrada." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, row: data });
}
