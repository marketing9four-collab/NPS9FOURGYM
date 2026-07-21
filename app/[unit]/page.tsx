import { notFound } from "next/navigation";
import { getUnitBySlug, UNIT_SLUGS } from "@/lib/constants";
import { SurveyFlow } from "@/components/survey/SurveyFlow";

export function generateStaticParams() {
  return Object.values(UNIT_SLUGS).map((unit) => ({ unit }));
}

export default async function UnitSurveyPage({
  params,
}: {
  params: Promise<{ unit: string }>;
}) {
  const { unit: slug } = await params;
  const unit = getUnitBySlug(slug);

  if (!unit) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      <SurveyFlow fixedUnit={unit} />
    </main>
  );
}
