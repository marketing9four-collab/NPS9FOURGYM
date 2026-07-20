import { Button } from "@/components/ui/Button";

export function ConfirmationScreen({ onFinish }: { onFinish: () => void }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  return (
    <div className="mx-auto max-w-xl px-6 py-16 text-center animate-slide-in">
      <div
        aria-hidden="true"
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-600"
      >
        ✓
      </div>
      <h2 className="mt-6 text-2xl font-bold text-brand-black">
        ¡Gracias por compartir tu opinión!
      </h2>
      <p className="mt-3 text-brand-gray-600">
        Tus respuestas fueron registradas correctamente y nos ayudarán a mejorar tu
        experiencia en 9FOURGYM.
      </p>

      <div className="mt-8 flex flex-col items-center gap-3">
        <Button onClick={onFinish}>Finalizar</Button>
        {siteUrl && (
          <a
            href={siteUrl}
            className="text-sm font-medium text-brand-gray-600 underline-offset-2 hover:underline"
          >
            Volver al sitio de 9FOURGYM
          </a>
        )}
      </div>
    </div>
  );
}
