"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { UNITS, type Unit, type DateRangePreset } from "@/lib/constants";
import { questions } from "@/lib/questions";
import type { DashboardStats } from "@/lib/admin/aggregate";
import type { SurveyResponseRow } from "@/lib/supabase/types";
import { Button } from "@/components/ui/Button";
import { MetricCard } from "./MetricCard";
import { FilterBar } from "./FilterBar";
import { AverageByQuestionChart } from "./charts/AverageByQuestionChart";
import { UnitComparisonChart } from "./charts/UnitComparisonChart";
import { DistributionChart } from "./charts/DistributionChart";
import { ChoiceBreakdownChart } from "./charts/ChoiceBreakdownChart";
import { TimeBreakdownChart } from "./charts/TimeBreakdownChart";
import { QuestionMetricsTable } from "./QuestionMetricsTable";
import { ResponsesTable } from "./ResponsesTable";
import { ResponseDetailDialog } from "./ResponseDetailDialog";
import { Pagination } from "./Pagination";
import { ExportButton } from "./ExportButton";
import { ResetDataButton } from "./ResetDataButton";
import { formatDateTime, cn } from "@/lib/utils";

const PAGE_SIZE = 20;

function computeDateRange(
  preset: DateRangePreset,
  customFrom: string,
  customTo: string
): { from?: string; to?: string } {
  const now = new Date();
  if (preset === "today") {
    return { from: new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString() };
  }
  if (preset === "7d") {
    return { from: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString() };
  }
  if (preset === "30d") {
    return { from: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString() };
  }
  return {
    from: customFrom ? new Date(`${customFrom}T00:00:00`).toISOString() : undefined,
    to: customTo ? new Date(`${customTo}T23:59:59.999`).toISOString() : undefined,
  };
}

export function Dashboard() {
  const router = useRouter();

  const [unit, setUnit] = useState<Unit | "ALL">("ALL");
  const [preset, setPreset] = useState<DateRangePreset>("30d");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const ratingQuestions = questions.filter((q) => q.type !== "choice" && q.type !== "time");
  const choiceQuestions = questions.filter((q) => q.type === "choice");
  const timeQuestions = questions.filter((q) => q.type === "time");
  const [selectedQuestionId, setSelectedQuestionId] = useState(ratingQuestions[0]?.id ?? "");
  const [detailId, setDetailId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [responses, setResponses] = useState<SurveyResponseRow[]>([]);
  const [total, setTotal] = useState(0);
  const [responsesLoading, setResponsesLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const { from, to } = useMemo(
    () => computeDateRange(preset, customFrom, customTo),
    [preset, customFrom, customTo]
  );

  const baseParams = useMemo(() => {
    const params = new URLSearchParams();
    if (unit !== "ALL") params.set("unit", unit);
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (q.trim()) params.set("q", q.trim());
    return params;
  }, [unit, from, to, q]);

  const responsesQueryString = useMemo(() => {
    const params = new URLSearchParams(baseParams);
    params.set("page", String(page));
    params.set("pageSize", String(PAGE_SIZE));
    params.set("sort", `created_at.${sortDirection}`);
    return params.toString();
  }, [baseParams, page, sortDirection]);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await fetch(`/api/admin/stats?${baseParams.toString()}`);
      const body = await res.json();
      if (!body.ok) throw new Error(body.message);
      setStats(body.stats);
      setLoadError(null);
    } catch {
      setLoadError("Não foi possível carregar as métricas. Verifique sua conexão.");
    } finally {
      setStatsLoading(false);
    }
  }, [baseParams]);

  const fetchResponses = useCallback(async () => {
    setResponsesLoading(true);
    try {
      const res = await fetch(`/api/admin/responses?${responsesQueryString}`);
      const body = await res.json();
      if (!body.ok) throw new Error(body.message);
      setResponses(body.rows);
      setTotal(body.total);
      setLoadError(null);
    } catch {
      setLoadError("Não foi possível carregar as respostas. Verifique sua conexão.");
    } finally {
      setResponsesLoading(false);
    }
  }, [responsesQueryString]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats, refreshKey]);

  useEffect(() => {
    fetchResponses();
  }, [fetchResponses, refreshKey]);

  // Qualquer mudança de filtro volta para a página 1.
  useEffect(() => {
    setPage(1);
  }, [unit, from, to, q, sortDirection]);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/nps-9fourgym/login");
    router.refresh();
  }

  function handleRefresh() {
    setRefreshKey((k) => k + 1);
  }

  const selectedQuestion = stats?.questionStats.find((qs) => qs.id === selectedQuestionId);

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-black">Painel de resultados</h1>
          <p className="text-sm text-brand-gray-600">Pesquisa de satisfação 9FOURGYM</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleRefresh}>
            Atualizar
          </Button>
          <Button variant="ghost" onClick={handleLogout}>
            Sair
          </Button>
        </div>
      </div>

      {loadError && (
        <p role="alert" className="mt-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
          {loadError}
        </p>
      )}

      <div className="mt-6">
        <FilterBar
          unit={unit}
          onUnitChange={setUnit}
          preset={preset}
          onPresetChange={setPreset}
          customFrom={customFrom}
          customTo={customTo}
          onCustomFromChange={setCustomFrom}
          onCustomToChange={setCustomTo}
          q={q}
          onQChange={setQ}
        />
      </div>

      <section aria-label="Métricas gerais" className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <MetricCard label="Total de respostas" value={statsLoading ? "…" : String(stats?.totalResponses ?? 0)} />
        <MetricCard
          label="Índice de satisfação"
          value={statsLoading ? "…" : stats?.overallAverage?.toFixed(2) ?? "N/A"}
        />
        <MetricCard label="Anônimas" value={statsLoading ? "…" : String(stats?.anonymousCount ?? 0)} />
        <MetricCard label="Identificadas" value={statsLoading ? "…" : String(stats?.identifiedCount ?? 0)} />
        <MetricCard
          label="Última resposta"
          value={statsLoading || !stats?.lastResponseAt ? "—" : formatDateTime(stats.lastResponseAt)}
        />
      </section>

      <section aria-label="Respostas por unidade" className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {UNITS.map((u) => (
          <MetricCard
            key={u}
            label={`Respostas — ${u.charAt(0)}${u.slice(1).toLowerCase()}`}
            value={statsLoading ? "…" : String(stats?.countByUnit[u] ?? 0)}
          />
        ))}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-brand-gray-200 bg-white p-5">
          <h2 className="text-base font-semibold text-brand-black">Média por pergunta</h2>
          {stats && (
            <AverageByQuestionChart
              data={stats.questionStats.filter((q) => q.type !== "choice" && q.type !== "time")}
            />
          )}
        </div>
        <div className="rounded-2xl border border-brand-gray-200 bg-white p-5">
          <h2 className="text-base font-semibold text-brand-black">Comparação por unidade</h2>
          {stats && (
            <UnitComparisonChart
              data={stats.questionStats.filter((q) => q.type !== "choice" && q.type !== "time")}
            />
          )}
        </div>
      </section>

      {choiceQuestions.length > 0 && (
        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          {choiceQuestions.map((qDef) => {
            const qStat = stats?.questionStats.find((qs) => qs.id === qDef.id);
            return (
              <div key={qDef.id} className="rounded-2xl border border-brand-gray-200 bg-white p-5">
                <h2 className="text-base font-semibold text-brand-black">{qDef.label}</h2>
                {qStat?.choiceCounts && Object.keys(qStat.choiceCounts).length > 0 ? (
                  <ChoiceBreakdownChart counts={qStat.choiceCounts} />
                ) : (
                  <p className="mt-3 text-sm text-brand-gray-600">Ainda não há respostas.</p>
                )}
              </div>
            );
          })}
        </section>
      )}

      {timeQuestions.length > 0 && (
        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          {timeQuestions.map((qDef) => {
            const qStat = stats?.questionStats.find((qs) => qs.id === qDef.id);
            return (
              <div key={qDef.id} className="rounded-2xl border border-brand-gray-200 bg-white p-5">
                <h2 className="text-base font-semibold text-brand-black">{qDef.label}</h2>
                {qStat?.timeCounts && Object.keys(qStat.timeCounts).length > 0 ? (
                  <TimeBreakdownChart counts={qStat.timeCounts} />
                ) : (
                  <p className="mt-3 text-sm text-brand-gray-600">Ainda não há respostas.</p>
                )}
              </div>
            );
          })}
        </section>
      )}

      <section className="mt-8 rounded-2xl border border-brand-gray-200 bg-white p-5">
        <h2 className="text-base font-semibold text-brand-black">Distribuição de notas</h2>
        <div
          className="mt-3 flex gap-2 overflow-x-auto pb-1"
          role="group"
          aria-label="Selecione uma pergunta"
        >
          {ratingQuestions.map((qDef) => (
            <button
              key={qDef.id}
              type="button"
              aria-pressed={selectedQuestionId === qDef.id}
              onClick={() => setSelectedQuestionId(qDef.id)}
              className={cn(
                "flex-shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-sm font-medium",
                selectedQuestionId === qDef.id
                  ? "border-brand-black bg-brand-black text-white"
                  : "border-brand-gray-200 text-brand-gray-600"
              )}
            >
              {qDef.label}
            </button>
          ))}
        </div>
        {selectedQuestion && <DistributionChart question={selectedQuestion} />}
      </section>

      <section className="mt-8">
        <h2 className="text-base font-semibold text-brand-black">Métricas por pergunta</h2>
        <p className="mt-1 text-xs text-brand-gray-600 sm:hidden">Deslize para o lado para ver mais →</p>
        <div className="mt-3">
          {stats && (
            <QuestionMetricsTable
              data={stats.questionStats.filter((q) => q.type !== "choice" && q.type !== "time")}
            />
          )}
        </div>
      </section>

      <section className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-brand-black">Respostas recentes</h2>
          <div className="flex gap-2">
            <ExportButton queryString={baseParams.toString()} />
            <ResetDataButton onDone={handleRefresh} />
          </div>
        </div>
        <p className="mt-1 text-xs text-brand-gray-600 sm:hidden">Deslize para o lado para ver mais →</p>

        <div className="mt-3">
          <ResponsesTable
            rows={responses}
            onViewDetails={setDetailId}
            sortDirection={sortDirection}
            onToggleSort={() => setSortDirection((d) => (d === "desc" ? "asc" : "desc"))}
          />
        </div>

        {!responsesLoading && (
          <Pagination page={page} pageSize={PAGE_SIZE} total={total} onPageChange={setPage} />
        )}
      </section>

      <ResponseDetailDialog responseId={detailId} onClose={() => setDetailId(null)} />
    </div>
  );
}
