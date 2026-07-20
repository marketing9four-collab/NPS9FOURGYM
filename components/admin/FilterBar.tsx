import { UNITS, UNIT_LABELS, type Unit } from "@/lib/constants";
import { DATE_RANGE_PRESETS, type DateRangePreset } from "@/lib/constants";
import { cn } from "@/lib/utils";

const PRESET_LABELS: Record<DateRangePreset, string> = {
  today: "Hoje",
  "7d": "Últimos 7 dias",
  "30d": "Últimos 30 dias",
  custom: "Personalizado",
};

interface FilterBarProps {
  unit: Unit | "ALL";
  onUnitChange: (unit: Unit | "ALL") => void;
  preset: DateRangePreset;
  onPresetChange: (preset: DateRangePreset) => void;
  customFrom: string;
  customTo: string;
  onCustomFromChange: (value: string) => void;
  onCustomToChange: (value: string) => void;
  q: string;
  onQChange: (value: string) => void;
}

export function FilterBar({
  unit,
  onUnitChange,
  preset,
  onPresetChange,
  customFrom,
  customTo,
  onCustomFromChange,
  onCustomToChange,
  q,
  onQChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-brand-gray-200 bg-white p-4 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por unidade">
        <FilterChip active={unit === "ALL"} onClick={() => onUnitChange("ALL")}>
          Todas as unidades
        </FilterChip>
        {UNITS.map((u) => (
          <FilterChip key={u} active={unit === u} onClick={() => onUnitChange(u)}>
            {UNIT_LABELS[u]}
          </FilterChip>
        ))}
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por data">
        {DATE_RANGE_PRESETS.map((p) => (
          <FilterChip key={p} active={preset === p} onClick={() => onPresetChange(p)}>
            {PRESET_LABELS[p]}
          </FilterChip>
        ))}
      </div>

      {preset === "custom" && (
        <div className="flex items-center gap-2">
          <label className="sr-only" htmlFor="filter-from">
            De
          </label>
          <input
            id="filter-from"
            type="date"
            value={customFrom}
            onChange={(e) => onCustomFromChange(e.target.value)}
            className="rounded-lg border border-brand-gray-200 px-3 py-2 text-sm"
          />
          <span className="text-brand-gray-600">até</span>
          <label className="sr-only" htmlFor="filter-to">
            Até
          </label>
          <input
            id="filter-to"
            type="date"
            value={customTo}
            onChange={(e) => onCustomToChange(e.target.value)}
            className="rounded-lg border border-brand-gray-200 px-3 py-2 text-sm"
          />
        </div>
      )}

      <div className="sm:ml-auto">
        <label className="sr-only" htmlFor="filter-search">
          Buscar por nome ou e-mail
        </label>
        <input
          id="filter-search"
          type="search"
          value={q}
          onChange={(e) => onQChange(e.target.value)}
          placeholder="Buscar por nome ou e-mail…"
          className="w-full rounded-lg border border-brand-gray-200 px-3 py-2 text-sm sm:w-64"
        />
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-brand-black bg-brand-black text-white"
          : "border-brand-gray-200 bg-white text-brand-gray-600 hover:border-brand-black"
      )}
    >
      {children}
    </button>
  );
}
