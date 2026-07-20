// PostgREST usa "," y "()" como separadores en el filtro .or(); se eliminan del
// término de búsqueda para que no puedan inyectar condiciones adicionales.
export function sanitizeSearchTerm(q: string): string {
  return q.replace(/[,()%]/g, "").trim();
}
