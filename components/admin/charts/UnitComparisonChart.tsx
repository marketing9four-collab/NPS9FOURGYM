"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CHART, UNIT_SERIES_COLORS } from "@/lib/admin/chartColors";
import { UNITS, UNIT_LABELS } from "@/lib/constants";
import type { QuestionStat } from "@/lib/admin/aggregate";

export function UnitComparisonChart({ data }: { data: QuestionStat[] }) {
  const chartData = data.map((q) => {
    const row: Record<string, string | number> = { label: q.label };
    for (const unit of UNITS) {
      row[unit] = q.byUnit[unit] ?? 0;
    }
    return row;
  });

  // En pantallas angostas, 8 categorias con etiquetas rotadas se superponen
  // si se comprimen al 100% del ancho. Se fuerza un ancho minimo y se envuelve
  // en un contenedor con scroll horizontal, igual que las tablas del panel.
  const minWidth = Math.max(480, chartData.length * 100);

  return (
    <div className="overflow-x-auto">
      <div style={{ minWidth }}>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData} margin={{ top: 8, right: 12, left: -12, bottom: 72 }}>
            <CartesianGrid vertical={false} stroke={CHART.gridline} />
            <XAxis
              dataKey="label"
              interval={0}
              angle={-40}
              textAnchor="end"
              height={90}
              tick={{ fill: CHART.secondaryInk, fontSize: 11 }}
              axisLine={{ stroke: CHART.baseline }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 10]}
              tick={{ fill: CHART.mutedInk, fontSize: 12 }}
              axisLine={{ stroke: CHART.baseline }}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: "rgba(11,11,11,0.04)" }}
              contentStyle={{ borderRadius: 8, borderColor: CHART.gridline, fontSize: 13 }}
            />
            <Legend wrapperStyle={{ fontSize: 12, color: CHART.secondaryInk }} />
            {UNITS.map((unit) => (
              <Bar
                key={unit}
                dataKey={unit}
                name={UNIT_LABELS[unit]}
                fill={UNIT_SERIES_COLORS[unit]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
