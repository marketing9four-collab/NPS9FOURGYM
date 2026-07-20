import { NextRequest, NextResponse } from "next/server";
import { submissionSchema } from "@/lib/validation/survey";
import { calculateOverallAverage } from "@/lib/nps";
import { ANONYMOUS_NAME } from "@/lib/constants";
import { getAnonSupabaseClient } from "@/lib/supabase/anon";
import { getAdminSupabaseClient } from "@/lib/supabase/server";
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

  const payload: SurveyResponseInsert = {
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

  // Primer guardado (al terminar de calificar, antes de los datos de contacto):
  // inserta con la clave anon — RLS solo permite insert a este rol, así que un
  // bug en esta ruta nunca podría leer/editar/borrar otras filas.
  const anonClient = getAnonSupabaseClient();
  const { error: insertError } = await anonClient.from("survey_responses").insert(payload);

  if (!insertError) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  // Reintento con el mismo submissionId: ya existe una fila (guardada cuando
  // terminó de calificar). Se actualiza esa misma fila —p. ej. para agregar
  // nombre/correo— en vez de crear una duplicada. Esto requiere la service
  // role key porque el público solo tiene permiso de insert, nunca de update;
  // el alcance queda acotado a esta única fila, identificada por el
  // submissionId ya validado con Zod (nunca por un parámetro arbitrario).
  if (insertError.code === "23505") {
    const adminClient = getAdminSupabaseClient();
    const { error: updateError } = await adminClient
      .from("survey_responses")
      .update(payload)
      .eq("submission_id", submissionId);

    if (updateError) {
      console.error("Error al actualizar la encuesta:", updateError);
      return NextResponse.json(
        { ok: false, message: "No se pudo guardar tu respuesta. Intenta de nuevo." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  }

  console.error("Error al guardar la encuesta:", insertError);
  return NextResponse.json(
    { ok: false, message: "No se pudo guardar tu respuesta. Intenta de nuevo." },
    { status: 500 }
  );
}
