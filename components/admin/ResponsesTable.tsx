import { UNIT_LABELS } from "@/lib/constants";
import { formatDateTime } from "@/lib/utils";
import type { SurveyResponseRow } from "@/lib/supabase/types";
import { Button } from "@/components/ui/Button";

export function ResponsesTable({
  rows,
  onViewDetails,
  sortDirection,
  onToggleSort,
}: {
  rows: SurveyResponseRow[];
  onViewDetails: (id: string) => void;
  sortDirection: "asc" | "desc";
  onToggleSort: () => void;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-brand-gray-200">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-brand-gray-50 text-brand-gray-600">
          <tr>
            <th className="px-4 py-3 font-semibold">
              <button
                type="button"
                onClick={onToggleSort}
                className="inline-flex items-center gap-1"
              >
                Data {sortDirection === "desc" ? "↓" : "↑"}
              </button>
            </th>
            <th className="px-4 py-3 font-semibold">Unidade</th>
            <th className="px-4 py-3 font-semibold">Nome</th>
            <th className="px-4 py-3 font-semibold">E-mail</th>
            <th className="px-4 py-3 font-semibold">Média</th>
            <th className="px-4 py-3 font-semibold">
              <span className="sr-only">Ações</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-gray-200">
          {rows.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-brand-gray-600">
                Nenhuma resposta para os filtros selecionados.
              </td>
            </tr>
          )}
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="whitespace-nowrap px-4 py-3">{formatDateTime(row.created_at)}</td>
              <td className="whitespace-nowrap px-4 py-3">{UNIT_LABELS[row.unit]}</td>
              <td className="px-4 py-3">{row.respondent_name}</td>
              <td className="px-4 py-3">{row.respondent_email ?? "—"}</td>
              <td className="whitespace-nowrap px-4 py-3">
                {row.overall_average === null ? "N/A" : row.overall_average.toFixed(2)}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-right">
                <Button variant="ghost" onClick={() => onViewDetails(row.id)}>
                  Ver detalhes
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
