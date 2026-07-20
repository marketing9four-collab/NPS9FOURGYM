import { FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { FieldError } from "@/components/ui/FieldError";

interface ContactStageProps {
  name: string;
  email: string;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onSubmit: () => void;
  onSubmitAnonymous: () => void;
  onBack: () => void;
  emailError?: string | null;
  submitting: boolean;
}

export function ContactStage({
  name,
  email,
  onNameChange,
  onEmailChange,
  onSubmit,
  onSubmitAnonymous,
  onBack,
  emailError,
  submitting,
}: ContactStageProps) {
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit();
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-10 animate-slide-in">
      <h2 className="text-2xl font-bold text-brand-black">¿Quieres recibir seguimiento?</h2>
      <p className="mt-2 text-brand-gray-600">
        Puedes dejarnos tus datos para que nuestro equipo entre en contacto contigo.
        Esta información es opcional.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
        <div>
          <label htmlFor="contact-name" className="block text-sm font-semibold text-brand-black">
            Nombre
          </label>
          <input
            id="contact-name"
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            autoComplete="name"
            disabled={submitting}
            className="mt-2 w-full rounded-lg border border-brand-gray-200 px-4 py-3 text-base focus:border-brand-black"
            placeholder="Tu nombre (opcional)"
          />
        </div>

        <div>
          <label htmlFor="contact-email" className="block text-sm font-semibold text-brand-black">
            Correo electrónico
          </label>
          <input
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            autoComplete="email"
            disabled={submitting}
            aria-invalid={Boolean(emailError)}
            className="mt-2 w-full rounded-lg border border-brand-gray-200 px-4 py-3 text-base focus:border-brand-black"
            placeholder="tu@correo.com (opcional)"
          />
          <FieldError>{emailError}</FieldError>
        </div>

        <p className="text-xs text-brand-gray-600">
          Tus datos serán utilizados únicamente para fines de contacto y mejora del
          servicio. Puedes enviar la encuesta de forma anónima.
        </p>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <Button type="submit" isLoading={submitting} className="w-full sm:w-auto">
            Enviar encuesta
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={submitting}
            onClick={onSubmitAnonymous}
            className="w-full sm:w-auto"
          >
            Enviar de forma anónima
          </Button>
        </div>

        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="mt-2 text-sm font-medium text-brand-gray-600 underline-offset-2 hover:underline"
        >
          Regresar a las preguntas
        </button>
      </form>
    </div>
  );
}
