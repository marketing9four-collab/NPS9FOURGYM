import { questions } from "@/lib/questions";
import { RatingQuestion } from "./RatingQuestion";
import { ChoiceQuestion } from "./ChoiceQuestion";
import { TimeQuestion } from "./TimeQuestion";

interface QuestionListProps {
  answers: Record<string, number | string | null | undefined>;
  onChange: (questionId: string, value: number | string | null) => void;
  errors?: Record<string, string>;
  registerRef?: (questionId: string, el: HTMLDivElement | null) => void;
  comments: Record<string, string>;
  onCommentChange: (questionId: string, value: string) => void;
}

export function QuestionList({
  answers,
  onChange,
  errors,
  registerRef,
  comments,
  onCommentChange,
}: QuestionListProps) {
  return (
    <div className="mx-auto max-w-3xl px-6">
      {questions.map((question) =>
        question.type === "choice" ? (
          <ChoiceQuestion
            key={question.id}
            question={question}
            value={answers[question.id] as string | null | undefined}
            onChange={(value) => onChange(question.id, value)}
            error={errors?.[question.id]}
            innerRef={(el) => registerRef?.(question.id, el)}
          />
        ) : question.type === "time" ? (
          <TimeQuestion
            key={question.id}
            question={question}
            value={answers[question.id] as string | null | undefined}
            onChange={(value) => onChange(question.id, value)}
            error={errors?.[question.id]}
            innerRef={(el) => registerRef?.(question.id, el)}
          />
        ) : (
          <RatingQuestion
            key={question.id}
            question={question}
            value={answers[question.id] as number | null | undefined}
            onChange={(value) => onChange(question.id, value)}
            error={errors?.[question.id]}
            innerRef={(el) => registerRef?.(question.id, el)}
            comment={comments[question.id]}
            onCommentChange={(value) => onCommentChange(question.id, value)}
          />
        )
      )}
    </div>
  );
}
