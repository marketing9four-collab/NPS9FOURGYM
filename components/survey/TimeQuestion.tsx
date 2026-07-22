import type { Question } from "@/lib/questions";
import { FieldError } from "@/components/ui/FieldError";

interface TimeQuestionProps {
  question: Question;
  value: string | null | undefined;
  onChange: (value: string | null) => void;
  error?: string | null;
  innerRef?: (el: HTMLDivElement | null) => void;
}

export function TimeQuestion({
  question,
  value,
  onChange,
  error,
  innerRef,
}: TimeQuestionProps) {
  const fieldId = `question-${question.id}-time`;

  return (
    <div
      ref={innerRef}
      tabIndex={-1}
      className="border-t border-brand-gray-200 py-6 first:border-t-0"
    >
      <label htmlFor={fieldId} className="text-base font-semibold text-brand-black">
        {question.label}
      </label>

      <input
        id={fieldId}
        type="time"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
        className="mt-4 w-full max-w-[160px] rounded-lg border border-brand-gray-200 px-4 py-3 text-base focus:border-brand-black"
      />

      <FieldError>{error}</FieldError>
    </div>
  );
}
