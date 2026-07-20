"use client";

import { useEffect, useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { questions } from "@/lib/questions";
import { UNIT_LABELS } from "@/lib/constants";
import { formatDateTime } from "@/lib/utils";
import type { SurveyResponseRow } from "@/lib/supabase/types";

export function ResponseDetailDialog({
  responseId,
  onClose,
}: {
  responseId: string | null;
  onClose: () => void;
}) {
  const [row, setRow] = useState<SurveyResponseRow | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!responseId) return;
    setLoading(true);
    setError(null);
    setRow(null);

    fetch(`/api/admin/responses/${responseId}`)
      .then((res) => res.json())
      .then((body) => {
        if (!body.ok) throw new Error(body.message);
        setRow(body.row);
      })
      .catch(() => setError("Não foi possível carregar o detalhe da resposta."))
      .finally(() => setLoading(false));
  }, [responseId]);

  return (
    <Dialog open={Boolean(responseId)} onClose={onClose} title="Detalhe da resposta">
      {loading && <p className="text-sm text-brand-gray-600">Carregando…</p>}
      {error && <p className="text-sm text-rose-600">{error}</p>}

      {row && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Info label="Data" value={formatDateTime(row.created_at)} />
            <Info label="Unidade" value={UNIT_LABELS[row.unit]} />
            <Info label="Nome" value={row.respondent_name} />
            <Info label="E-mail" value={row.respondent_email ?? "—"} />
            <Info
              label="Média"
              value={row.overall_average === null ? "N/A" : row.overall_average.toFixed(2)}
            />
          </div>

          <div className="divide-y divide-brand-gray-200 border-t border-brand-gray-200">
            {questions.map((q) => {
              const value = row.answers[q.id];
              const comment = row.comments?.[q.id];
              return (
                <div key={q.id} className="py-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-brand-black">{q.label}</p>
                    <span className="rounded-full bg-brand-gray-100 px-3 py-1 text-sm font-semibold">
                      {value === null || value === undefined ? "N/A" : value}
                    </span>
                  </div>
                  {comment && (
                    <p className="mt-2 rounded-lg bg-brand-gray-50 p-3 text-sm text-brand-gray-600">
                      “{comment}”
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Dialog>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-brand-gray-600">{label}</p>
      <p className="text-brand-black">{value}</p>
    </div>
  );
}
