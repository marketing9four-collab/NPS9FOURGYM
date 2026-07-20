import { questions } from "@/lib/questions";
import { UNITS, ANONYMOUS_NAME, type Unit } from "@/lib/constants";
import { calculateQuestionAverage } from "@/lib/nps";
import type { SurveyResponseRow } from "@/lib/supabase/types";

export interface QuestionStat {
  id: string;
  label: string;
  average: number | null;
  naCount: number;
  naPercent: number;
  distribution: Record<number, number>; // score (0-10) -> count
  byUnit: Record<Unit, number | null>;
}

export interface DashboardStats {
  totalResponses: number;
  overallAverage: number | null;
  anonymousCount: number;
  identifiedCount: number;
  countByUnit: Record<Unit, number>;
  lastResponseAt: string | null;
  questionStats: QuestionStat[];
}

export function computeDashboardStats(rows: SurveyResponseRow[]): DashboardStats {
  const totalResponses = rows.length;

  const averages = rows
    .map((r) => r.overall_average)
    .filter((v): v is number => typeof v === "number");
  const overallAverage =
    averages.length > 0
      ? Math.round((averages.reduce((a, b) => a + b, 0) / averages.length) * 100) / 100
      : null;

  const anonymousCount = rows.filter(
    (r) => r.respondent_name === ANONYMOUS_NAME && !r.respondent_email
  ).length;
  const identifiedCount = totalResponses - anonymousCount;

  const countByUnit = Object.fromEntries(
    UNITS.map((unit) => [unit, rows.filter((r) => r.unit === unit).length])
  ) as Record<Unit, number>;

  const lastResponseAt = rows.reduce<string | null>((latest, r) => {
    if (!latest || r.created_at > latest) return r.created_at;
    return latest;
  }, null);

  const questionStats: QuestionStat[] = questions.map((q) => {
    const { average, naCount, naPercent } = calculateQuestionAverage(rows, q.id);

    const distribution: Record<number, number> = {};
    for (let score = 0; score <= 10; score++) {
      distribution[score] = rows.filter((r) => r.answers[q.id] === score).length;
    }

    const byUnit = Object.fromEntries(
      UNITS.map((unit) => {
        const unitRows = rows.filter((r) => r.unit === unit);
        return [unit, calculateQuestionAverage(unitRows, q.id).average];
      })
    ) as Record<Unit, number | null>;

    return { id: q.id, label: q.label, average, naCount, naPercent, distribution, byUnit };
  });

  return {
    totalResponses,
    overallAverage,
    anonymousCount,
    identifiedCount,
    countByUnit,
    lastResponseAt,
    questionStats,
  };
}
