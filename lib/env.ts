/**
 * Lee una variable de entorno requerida y le quita espacios/BOM (U+FEFF) al
 * inicio o final. Algunos flujos de configuracion (dashboards, CLIs en
 * Windows) pueden dejar un BOM invisible al pegar/canalizar el valor, lo que
 * rompe su uso como header HTTP (Supabase) o en comparaciones estrictas.
 */
export function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Falta la variable de entorno ${name}.`);
  }
  return value;
}
