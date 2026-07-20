import Image from "next/image";

export function BannerHeader() {
  return (
    <header>
      <div className="relative w-full">
        <Image
          src="/images/banner-head.png"
          alt="9FOURGYM"
          width={1920}
          height={427}
          priority
          className="h-auto w-full object-cover"
          sizes="100vw"
        />
      </div>
      <div className="mx-auto max-w-3xl px-6 py-10 text-center sm:py-14">
        <h1 className="text-3xl font-bold tracking-tight text-brand-black sm:text-4xl">
          Encuesta de satisfacción 9FOURGYM
        </h1>
        <p className="mt-3 text-lg text-brand-gray-600">
          Tu opinión nos ayuda a mejorar cada día.
        </p>
        <p className="mx-auto mt-4 max-w-xl text-sm text-brand-gray-600">
          Califica cada uno de los siguientes aspectos del 0 al 10. Si no puedes
          evaluar algún punto, selecciona N/A.
        </p>
      </div>
    </header>
  );
}
