/** Promedio general de las respuestas numéricas de una encuesta, ignorando N/A (null). */
export function calculateOverallAverage(
  answers: Record<string, number | string | null>
): number | null {
  const numeric = Object.values(answers).filter(
    (v): v is number => typeof v === "number"
  );
  if (numeric.length === 0) return null;
  const sum = numeric.reduce((acc, v) => acc + v, 0);
  return Math.round((sum / numeric.length) * 100) / 100;
}

/** Promedio de una pregunta específica a través de varias respuestas, ignorando N/A. */
export function calculateQuestionAverage(
  responses: { answers: Record<string, number | string | null> }[],
  questionId: string
): { average: number | null; naCount: number; naPercent: number } {
  const values = responses.map((r) => r.answers[questionId]);
  const numeric = values.filter((v): v is number => typeof v === "number");
  const naCount = values.filter((v) => v === null || v === undefined).length;
  const naPercent = values.length > 0 ? (naCount / values.length) * 100 : 0;
  if (numeric.length === 0) return { average: null, naCount, naPercent };
  const sum = numeric.reduce((acc, v) => acc + v, 0);
  return {
    average: Math.round((sum / numeric.length) * 100) / 100,
    naCount,
    naPercent,
  };
}

export type NpsClassification = "promoter" | "passive" | "detractor";

/**
 * Clasificación NPS tradicional (0-6 detractor, 7-8 pasivo, 9-10 promotor).
 * Solo aplica a preguntas con type: "nps"; no confundir con el promedio general.
 * Actualmente ninguna pregunta es de tipo "nps" (ver lib/questions.ts), por lo que
 * esta función queda lista pero sin uso hasta que se agregue esa pregunta.
 */
export function classifyNps(score: number): NpsClassification {
  if (score >= 9) return "promoter";
  if (score >= 7) return "passive";
  return "detractor";
}

export function calculateNpsScore(scores: number[]): number | null {
  if (scores.length === 0) return null;
  const promoters = scores.filter((s) => classifyNps(s) === "promoter").length;
  const detractors = scores.filter((s) => classifyNps(s) === "detractor").length;
  return Math.round(((promoters - detractors) / scores.length) * 100);
}
