"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";

const CONFIRM_PHRASE = "APAGAR TUDO";

export function ResetDataButton({ onDone }: { onDone: () => void }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function close() {
    setOpen(false);
    setInput("");
    setError(null);
  }

  async function handleConfirm() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: input }),
      });
      const body = await res.json();
      if (!res.ok || !body.ok) {
        setError(body.message || "Não foi possível apagar os dados.");
        return;
      }
      close();
      onDone();
    } catch {
      setError("Não foi possível conectar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)} className="border-rose-300 text-rose-700 hover:bg-rose-50">
        Apagar todos os dados
      </Button>

      <Dialog open={open} onClose={close} title="Apagar todos os dados">
        <div className="space-y-4 text-sm">
          <p className="text-brand-gray-600">
            Esta ação apaga <strong>permanentemente</strong> todas as respostas da
            pesquisa. Use apenas para limpar dados de teste antes de divulgar o link.
            Não pode ser desfeita.
          </p>
          <p className="text-brand-gray-600">
            Digite <strong>{CONFIRM_PHRASE}</strong> para confirmar:
          </p>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full rounded-lg border border-brand-gray-200 px-4 py-2"
            autoFocus
          />
          {error && <p className="text-rose-600">{error}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={close} disabled={loading}>
              Cancelar
            </Button>
            <Button
              onClick={handleConfirm}
              isLoading={loading}
              disabled={input !== CONFIRM_PHRASE}
              className="bg-rose-600 hover:bg-rose-700"
            >
              Apagar definitivamente
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
