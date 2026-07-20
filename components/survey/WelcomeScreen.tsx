"use client";

import { useEffect } from "react";
import Image from "next/image";

const DISPLAY_MS = 2500;

export function WelcomeScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDone, DISPLAY_MS);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-black px-6 text-center">
      <div className="animate-welcome-in">
        <Image
          src="/images/shield-logo.png"
          alt="9FOURGYM"
          width={220}
          height={291}
          priority
        />
      </div>
      <h1
        className="mt-6 animate-welcome-in text-2xl font-bold text-white sm:text-3xl"
        style={{ animationDelay: "150ms" }}
      >
        ¡Bienvenido a la encuesta de satisfacción!
      </h1>
      <button
        type="button"
        onClick={onDone}
        className="mt-8 text-sm font-medium text-brand-gray-200 underline-offset-2 hover:underline hover:text-white"
      >
        Continuar
      </button>
    </div>
  );
}
