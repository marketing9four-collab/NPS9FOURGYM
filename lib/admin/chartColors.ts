// Paleta validada del skill dataviz (references/palette.md) — valores tal cual,
// sin reordenar. Slots 1-4 son seguros para comparación de las 4 unidades
// (validados all-pairs); "sequential" es el hue azul para series únicas.
export const CHART = {
  surface: "#fcfcfb",
  gridline: "#e1e0d9",
  baseline: "#c3c2b7",
  mutedInk: "#898781",
  primaryInk: "#0b0b0b",
  secondaryInk: "#52514e",
  sequential: "#2a78d6", // step 450 — bars de una sola serie (promedio, distribución)
};

export const UNIT_SERIES_COLORS: Record<string, string> = {
  ARBOLEDAS: "#2a78d6", // slot 1 blue
  METEPEC: "#008300", // slot 2 green
  INTERLOMAS: "#e87ba4", // slot 3 magenta
  LOMAS: "#eda100", // slot 4 yellow
};
