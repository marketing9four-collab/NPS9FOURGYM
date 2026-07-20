"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CHART } from "@/lib/admin/chartColors";
import type { QuestionStat } from "@/lib/admin/aggregate";

export function DistributionChart({ question }: { question: QuestionStat }) {
  const chartData = Array.from({ length: 11 }, (_, score) => ({
    score: String(score),
    count: question.distribution[score] ?? 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData} margin={{ top: 8, right: 12, left: -12 }}>
        <CartesianGrid vertical={false} stroke={CHART.gridline} />
        <XAxis
          dataKey="score"
          tick={{ fill: CHART.secondaryInk, fontSize: 12 }}
          axisLine={{ stroke: CHART.baseline }}
          tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fill: CHART.mutedInk, fontSize: 12 }}
          axisLine={{ stroke: CHART.baseline }}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: "rgba(11,11,11,0.04)" }}
          formatter={(value: number) => [value, "Respostas"]}
          labelFormatter={(label) => `Nota ${label}`}
          contentStyle={{ borderRadius: 8, borderColor: CHART.gridline, fontSize: 13 }}
        />
        <Bar dataKey="count" fill={CHART.sequential} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
