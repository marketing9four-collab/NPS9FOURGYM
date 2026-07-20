import { useState } from "react";
import type { Question } from "@/lib/questions";
import { ratingColorClasses } from "@/lib/constants";
import { FieldError } from "@/components/ui/FieldError";
import { cn } from "@/lib/utils";

const SCORES = Array.from({ length: 11 }, (_, i) => i); // 0..10

interface RatingQuestionProps {
  question: Question;
  value: number | null | undefined;
  onChange: (value: number | null) => void;
  error?: string | null;
  innerRef?: (el: HTMLDivElement | null) => void;
  comment?: string;
  onCommentChange?: (value: string) => void;
}

export function RatingQuestion({
  question,
  value,
  onChange,
  error,
  innerRef,
  comment,
  onCommentChange,
}: RatingQuestionProps) {
  const groupLabelId = `question-${question.id}-label`;
  const commentFieldId = `question-${question.id}-comment`;
  const [commentOpen, setCommentOpen] = useState(Boolean(comment && comment.length > 0));

  return (
    <div
      ref={innerRef}
      tabIndex={-1}
      className="border-t border-brand-gray-200 py-6 first:border-t-0"
    >
      <p id={groupLabelId} className="text-base font-semibold text-brand-black">
        {question.label}
      </p>

      <div
        role="group"
        aria-labelledby={groupLabelId}
        className="rating-scroll mt-4 flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-px-6 pb-2"
      >
        <RatingButton
          selected={value === null}
          onClick={() => onChange(null)}
          ariaLabel="No aplica"
          colors={ratingColorClasses(null)}
        >
          N/A
        </RatingButton>

        {SCORES.map((score) => (
          <RatingButton
            key={score}
            selected={value === score}
            onClick={() => onChange(score)}
            ariaLabel={`Calificación ${score} de 10`}
            colors={ratingColorClasses(score)}
          >
            {score}
          </RatingButton>
        ))}
      </div>

      <FieldError>{error}</FieldError>

      <div className="mt-3">
        <button
          type="button"
          aria-expanded={commentOpen}
          aria-controls={commentFieldId}
          onClick={() => setCommentOpen((v) => !v)}
          className="text-sm font-medium text-brand-gray-600 underline-offset-2 hover:text-brand-black hover:underline"
        >
          {commentOpen ? "Ocultar comentario" : "Quiero comentar esto"}
        </button>

        {commentOpen && (
          <textarea
            id={commentFieldId}
            value={comment ?? ""}
            onChange={(e) => onCommentChange?.(e.target.value)}
            maxLength={1000}
            rows={3}
            placeholder="Escribe aquí tu comentario (opcional)"
            aria-label={`Comentario sobre: ${question.label}`}
            className="mt-2 w-full rounded-lg border border-brand-gray-200 px-4 py-3 text-sm focus:border-brand-black"
          />
        )}
      </div>
    </div>
  );
}

function RatingButton({
  selected,
  onClick,
  ariaLabel,
  colors,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  ariaLabel: string;
  colors: { base: string; selected: string };
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={ariaLabel}
      onClick={onClick}
      className={cn(
        "flex h-12 w-12 flex-shrink-0 snap-start items-center justify-center rounded-full border-2 text-sm font-bold transition-colors",
        selected ? colors.selected : colors.base
      )}
    >
      {children}
    </button>
  );
}
