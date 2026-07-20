import { UNITS, UNIT_LABELS, type Unit } from "@/lib/constants";
import { FieldError } from "@/components/ui/FieldError";
import { cn } from "@/lib/utils";

interface UnitSelectorProps {
  value: Unit | null;
  onChange: (unit: Unit) => void;
  error?: string | null;
  innerRef?: (el: HTMLDivElement | null) => void;
}

export function UnitSelector({ value, onChange, error, innerRef }: UnitSelectorProps) {
  return (
    <section
      ref={innerRef}
      tabIndex={-1}
      aria-labelledby="unit-selector-heading"
      className="mx-auto max-w-3xl px-6"
    >
      <h2 id="unit-selector-heading" className="text-lg font-semibold text-brand-black">
        Selecciona tu unidad
      </h2>
      <div
        role="radiogroup"
        aria-labelledby="unit-selector-heading"
        aria-invalid={Boolean(error)}
        className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        {UNITS.map((unit) => {
          const selected = value === unit;
          return (
            <button
              key={unit}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(unit)}
              className={cn(
                "rounded-xl border-2 px-4 py-5 text-center text-sm font-bold uppercase tracking-wide transition-colors sm:text-base",
                selected
                  ? "border-brand-red bg-brand-red text-white"
                  : "border-brand-gray-200 bg-white text-brand-black hover:border-brand-black"
              )}
            >
              {UNIT_LABELS[unit]}
            </button>
          );
        })}
      </div>
      <FieldError>{error}</FieldError>
    </section>
  );
}
