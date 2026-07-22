"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CHART } from "@/lib/admin/chartColors";

export function TimeBreakdownChart({ counts }: { counts: Record<string, number> }) {
  const chartData = Object.entries(counts)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => a.label.localeCompare(b.label));

  return (
    <ResponsiveContainer width="100%" height={Math.max(160, chartData.length * 40)}>
      <BarChart data={chartData} layout="vertical" margin={{ left: 12, right: 24 }}>
        <CartesianGrid horizontal={false} stroke={CHART.gridline} />
        <XAxis
          type="number"
          allowDecimals={false}
          tick={{ fill: CHART.mutedInk, fontSize: 12 }}
          axisLine={{ stroke: CHART.baseline }}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="label"
          width={60}
          tick={{ fill: CHART.secondaryInk, fontSize: 13 }}
          axisLine={{ stroke: CHART.baseline }}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: "rgba(11,11,11,0.04)" }}
          formatter={(value: number) => [value, "Respostas"]}
          contentStyle={{ borderRadius: 8, borderColor: CHART.gridline, fontSize: 13 }}
        />
        <Bar dataKey="count" fill={CHART.sequential} radius={[0, 4, 4, 0]} barSize={20} />
      </BarChart>
    </ResponsiveContainer>
  );
}
