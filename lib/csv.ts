import { questions } from "@/lib/questions";
import { UNIT_LABELS } from "@/lib/constants";
import type { SurveyResponseRow } from "@/lib/supabase/types";

function escapeCsvField(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function buildResponsesCsv(rows: SurveyResponseRow[]): string {
  const header = [
    "Data",
    "Unidade",
    "Nome",
    "E-mail",
    ...questions.map((q) => q.label),
    "Média",
  ];

  const lines = rows.map((row) => {
    const cells = [
      new Date(row.created_at).toLocaleString("pt-BR"),
      UNIT_LABELS[row.unit],
      row.respondent_name,
      row.respondent_email ?? "",
      ...questions.map((q) => {
        const value = row.answers[q.id];
        return value === null || value === undefined ? "N/A" : String(value);
      }),
      row.overall_average === null ? "N/A" : String(row.overall_average),
    ];
    return cells.map((c) => escapeCsvField(String(c))).join(",");
  });

  // BOM al inicio para que Excel abra correctamente los acentos en español.
  return "﻿" + [header.join(","), ...lines].join("\r\n");
}
