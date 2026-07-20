"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CHART } from "@/lib/admin/chartColors";
import type { QuestionStat } from "@/lib/admin/aggregate";

export function AverageByQuestionChart({ data }: { data: QuestionStat[] }) {
  const chartData = data.map((q) => ({
    label: q.label,
    average: q.average ?? 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={Math.max(160, chartData.length * 56)}>
      <BarChart data={chartData} layout="vertical" margin={{ left: 12, right: 24 }}>
        <CartesianGrid horizontal={false} stroke={CHART.gridline} />
        <XAxis
          type="number"
          domain={[0, 10]}
          tick={{ fill: CHART.mutedInk, fontSize: 12 }}
          axisLine={{ stroke: CHART.baseline }}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="label"
          width={160}
          tick={{ fill: CHART.secondaryInk, fontSize: 13 }}
          axisLine={{ stroke: CHART.baseline }}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: "rgba(11,11,11,0.04)" }}
          formatter={(value: number) => [value.toFixed(2), "Média"]}
          contentStyle={{ borderRadius: 8, borderColor: CHART.gridline, fontSize: 13 }}
        />
        <Bar dataKey="average" fill={CHART.sequential} radius={[0, 4, 4, 0]} barSize={24} />
      </BarChart>
    </ResponsiveContainer>
  );
}
