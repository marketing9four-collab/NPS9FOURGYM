export const UNITS = ["ARBOLEDAS", "METEPEC", "INTERLOMAS", "LOMAS"] as const;
export type Unit = (typeof UNITS)[number];

export const UNIT_LABELS: Record<Unit, string> = {
  ARBOLEDAS: "Arboledas",
  METEPEC: "Metepec",
  INTERLOMAS: "Interlomas",
  LOMAS: "Lomas",
};

export const ANONYMOUS_NAME = "Usuario Anónimo";

/** Slugs de URL por unidad — usados en las rutas /[unit] (una liga fija por sede). */
export const UNIT_SLUGS: Record<Unit, string> = {
  ARBOLEDAS: "arboledas",
  METEPEC: "metepec",
  INTERLOMAS: "interlomas",
  LOMAS: "lomas",
};

export function getUnitBySlug(slug: string): Unit | null {
  const entry = (Object.entries(UNIT_SLUGS) as [Unit, string][]).find(
    ([, s]) => s === slug.toLowerCase()
  );
  return entry ? entry[0] : null;
}

/**
 * Clases de color por nota, siguiendo el mapeo del brief:
 * 0-3 rojizo, 4-6 amarillo/naranja, 7-8 verde claro, 9-10 verde, N/A gris.
 * El color siempre acompaña al dígito visible; nunca es la única señal.
 */
export function ratingColorClasses(value: number | null): {
  base: string;
  selected: string;
} {
  if (value === null) {
    return {
      base: "border-brand-gray-200 bg-brand-gray-50 text-brand-gray-600",
      selected: "border-brand-gray-600 bg-brand-gray-200 text-brand-gray-900",
    };
  }
  if (value <= 3) {
    return {
      base: "border-rose-200 bg-rose-50 text-rose-700",
      selected: "border-rose-500 bg-rose-500 text-white",
    };
  }
  if (value <= 6) {
    return {
      base: "border-amber-200 bg-amber-50 text-amber-700",
      selected: "border-amber-500 bg-amber-500 text-white",
    };
  }
  if (value <= 8) {
    return {
      base: "border-lime-200 bg-lime-50 text-lime-700",
      selected: "border-lime-600 bg-lime-600 text-white",
    };
  }
  return {
    base: "border-green-200 bg-green-50 text-green-700",
    selected: "border-green-600 bg-green-600 text-white",
  };
}

export const DATE_RANGE_PRESETS = ["today", "7d", "30d", "custom"] as const;
export type DateRangePreset = (typeof DATE_RANGE_PRESETS)[number];
