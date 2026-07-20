import { UNITS, UNIT_LABELS } from "@/lib/constants";
import type { QuestionStat } from "@/lib/admin/aggregate";

export function QuestionMetricsTable({ data }: { data: QuestionStat[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-brand-gray-200">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead className="bg-brand-gray-50 text-brand-gray-600">
          <tr>
            <th className="px-4 py-3 font-semibold">Pergunta</th>
            <th className="px-4 py-3 font-semibold">Média</th>
            <th className="px-4 py-3 font-semibold">% N/A</th>
            {UNITS.map((u) => (
              <th key={u} className="px-4 py-3 font-semibold">
                {UNIT_LABELS[u]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-gray-200">
          {data.map((q) => (
            <tr key={q.id}>
              <td className="px-4 py-3 font-medium text-brand-black">{q.label}</td>
              <td className="whitespace-nowrap px-4 py-3">
                {q.average === null ? "N/A" : q.average.toFixed(2)}
              </td>
              <td className="whitespace-nowrap px-4 py-3">{q.naPercent.toFixed(0)}%</td>
              {UNITS.map((u) => (
                <td key={u} className="whitespace-nowrap px-4 py-3">
                  {q.byUnit[u] === null ? "N/A" : q.byUnit[u]!.toFixed(2)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
