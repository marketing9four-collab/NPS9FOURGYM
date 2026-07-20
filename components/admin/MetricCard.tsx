import { Card } from "@/components/ui/Card";

export function MetricCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <Card>
      <p className="text-sm font-medium text-brand-gray-600">{label}</p>
      <p className="mt-2 text-2xl font-bold text-brand-black">{value}</p>
      {hint && <p className="mt-1 text-xs text-brand-gray-600">{hint}</p>}
    </Card>
  );
}
