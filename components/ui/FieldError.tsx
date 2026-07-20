export function FieldError({ children }: { children?: string | null }) {
  if (!children) return null;
  return (
    <p role="alert" className="mt-2 text-sm font-medium text-rose-600">
      {children}
    </p>
  );
}
