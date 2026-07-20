import { NextRequest, NextResponse } from "next/server";
import { submissionSchema } from "@/lib/validation/survey";
import { calculateOverallAverage } from "@/lib/nps";
import { ANONYMOUS_NAME } from "@/lib/constants";
import { getAnonSupabaseClient } from "@/lib/supabase/anon";
import type { SurveyResponseInsert } from "@/lib/supabase/types";

export const runtime = "nodejs";

function deriveRespondent(
  rawName: string | undefined,
  rawEmail: string | undefined,
  anonymous: boolean | undefined
): { name: string; email: string | null } {
  if (anonymous) {
    return { name: ANONYMOUS_NAME, email: null };
  }

  const name = rawName?.trim();
  const email = rawEmail?.trim();

  return {
    name: name ? name : ANONYMOUS_NAME,
    email: email ? email : null,
  };
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Solicitud inválida." },
      { status: 400 }
    );
  }

  const parsed = submissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: parsed.error.errors[0]?.message || "Datos de la encuesta inválidos.",
      },
      { status: 400 }
    );
  }

  const { submissionId, unit, answers, name, email, anonymous, comments } = parsed.data;
  const respondent = deriveRespondent(name, email, anonymous);
  const overallAverage = calculateOverallAverage(answers);

  const cleanComments = Object.fromEntries(
    Object.entries(comments ?? {}).filter(([, text]) => text.trim().length > 0)
  );

  const insertPayload: SurveyResponseInsert = {
    submission_id: submissionId,
    unit,
    respondent_name: respondent.name,
    respondent_email: respondent.email,
    answers,
    comments: Object.keys(cleanComments).length > 0 ? cleanComments : null,
    overall_average: overallAverage,
    completed: true,
    user_agent: request.headers.get("user-agent"),
  };

  const supabase = getAnonSupabaseClient();
  const { error } = await supabase.from("survey_responses").insert(insertPayload);

  if (error) {
    // Reintento con el mismo submissionId (p. ej. tras un fallo de red) no debe
    // crear una fila duplicada: se trata como éxito idempotente.
    if (error.code === "23505") {
      return NextResponse.json({ ok: true }, { status: 201 });
    }
    console.error("Error al guardar la encuesta:", error);
    return NextResponse.json(
      { ok: false, message: "No se pudo guardar tu respuesta. Intenta de nuevo." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
