import { useState } from "react";
import type { Question } from "@/lib/questions";
import { FieldError } from "@/components/ui/FieldError";
import { cn } from "@/lib/utils";

const OTHER_LABEL = "Otra";

interface ChoiceQuestionProps {
  question: Question;
  value: string | null | undefined;
  onChange: (value: string | null) => void;
  error?: string | null;
  innerRef?: (el: HTMLDivElement | null) => void;
}

export function ChoiceQuestion({
  question,
  value,
  onChange,
  error,
  innerRef,
}: ChoiceQuestionProps) {
  const groupLabelId = `question-${question.id}-label`;
  const options = question.options ?? [];
  const isOtherValue = Boolean(value) && !options.includes(value ?? "");
  const [otherSelected, setOtherSelected] = useState(isOtherValue);
  const otherText = otherSelected ? value ?? "" : "";

  function selectOption(option: string) {
    setOtherSelected(false);
    onChange(option);
  }

  function selectOther() {
    setOtherSelected(true);
    onChange("");
  }

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
        role="radiogroup"
        aria-labelledby={groupLabelId}
        className="mt-4 flex flex-wrap gap-2"
      >
        {options.map((option) => {
          const selected = !otherSelected && value === option;
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => selectOption(option)}
              className={cn(
                "rounded-full border-2 px-4 py-2 text-sm font-medium transition-colors",
                selected
                  ? "border-brand-black bg-brand-black text-white"
                  : "border-brand-gray-200 bg-white text-brand-black hover:border-brand-black"
              )}
            >
              {option}
            </button>
          );
        })}

        {question.allowOther && (
          <button
            type="button"
            role="radio"
            aria-checked={otherSelected}
            onClick={selectOther}
            className={cn(
              "rounded-full border-2 px-4 py-2 text-sm font-medium transition-colors",
              otherSelected
                ? "border-brand-black bg-brand-black text-white"
                : "border-brand-gray-200 bg-white text-brand-black hover:border-brand-black"
            )}
          >
            {OTHER_LABEL}
          </button>
        )}
      </div>

      {otherSelected && (
        <input
          type="text"
          value={otherText}
          onChange={(e) => onChange(e.target.value)}
          maxLength={200}
          placeholder="¿Cuál?"
          aria-label={`Especifica cuál para: ${question.label}`}
          className="mt-3 w-full rounded-lg border border-brand-gray-200 px-4 py-3 text-sm focus:border-brand-black sm:max-w-xs"
        />
      )}

      <FieldError>{error}</FieldError>
    </div>
  );
}
