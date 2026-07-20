"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { FieldError } from "@/components/ui/FieldError";

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(body?.message || "Usuário ou senha incorretos.");
        return;
      }

      router.push("/admin/nps-9fourgym");
      router.refresh();
    } catch {
      setError("Não foi possível conectar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <h1 className="text-2xl font-bold text-brand-black">Painel administrativo</h1>
      <p className="mt-1 text-sm text-brand-gray-600">9FOURGYM — Pesquisa de satisfação</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
        <div>
          <label htmlFor="username" className="block text-sm font-semibold text-brand-black">
            Usuário
          </label>
          <input
            id="username"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-2 w-full rounded-lg border border-brand-gray-200 px-4 py-3 text-base focus:border-brand-black"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-brand-black">
            Senha
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-lg border border-brand-gray-200 px-4 py-3 text-base focus:border-brand-black"
          />
        </div>

        <FieldError>{error}</FieldError>

        <Button type="submit" isLoading={loading} className="w-full">
          Entrar
        </Button>
      </form>
    </div>
  );
}
