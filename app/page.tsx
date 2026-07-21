import Link from "next/link";
import Image from "next/image";
import { UNITS, UNIT_LABELS, UNIT_SLUGS } from "@/lib/constants";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 py-16 text-center">
      <Image
        src="/images/shield-logo.png"
        alt="9FOURGYM"
        width={110}
        height={145}
        priority
      />
      <h1 className="mt-6 text-2xl font-bold text-brand-black sm:text-3xl">
        Selecciona tu sede
      </h1>
      <p className="mt-2 max-w-md text-sm text-brand-gray-600">
        Elige tu unidad para comenzar la encuesta de satisfacción.
      </p>

      <div className="mt-8 grid w-full max-w-md grid-cols-2 gap-3">
        {UNITS.map((unit) => (
          <Link
            key={unit}
            href={`/${UNIT_SLUGS[unit]}`}
            className="rounded-xl border-2 border-brand-gray-200 bg-white px-4 py-5 text-center text-sm font-bold uppercase tracking-wide text-brand-black transition-colors hover:border-brand-black sm:text-base"
          >
            {UNIT_LABELS[unit]}
          </Link>
        ))}
      </div>
    </main>
  );
}
