import { questions } from "@/lib/questions";
import { RatingQuestion } from "./RatingQuestion";

interface QuestionListProps {
  answers: Record<string, number | null | undefined>;
  onChange: (questionId: string, value: number | null) => void;
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
      {questions.map((question) => (
        <RatingQuestion
          key={question.id}
          question={question}
          value={answers[question.id]}
          onChange={(value) => onChange(question.id, value)}
          error={errors?.[question.id]}
          innerRef={(el) => registerRef?.(question.id, el)}
          comment={comments[question.id]}
          onCommentChange={(value) => onCommentChange(question.id, value)}
        />
      ))}
    </div>
  );
}
