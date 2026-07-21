import type { Unit } from "@/lib/constants";

export interface SurveyResponseRow {
  id: string;
  submission_id: string;
  unit: Unit;
  respondent_name: string;
  respondent_email: string | null;
  answers: Record<string, number | string | null>;
  comments: Record<string, string> | null;
  overall_average: number | null;
  completed: boolean;
  user_agent: string | null;
  created_at: string;
}

export interface SurveyResponseInsert {
  submission_id: string;
  unit: Unit;
  respondent_name: string;
  respondent_email: string | null;
  answers: Record<string, number | string | null>;
  comments: Record<string, string> | null;
  overall_average: number | null;
  completed: boolean;
  user_agent: string | null;
}
