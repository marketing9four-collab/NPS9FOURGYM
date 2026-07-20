import { Button } from "@/components/ui/Button";

export function ExportButton({ queryString }: { queryString: string }) {
  return (
    <Button
      variant="secondary"
      onClick={() => {
        window.location.href = `/api/admin/export?${queryString}`;
      }}
    >
      Exportar CSV
    </Button>
  );
}
