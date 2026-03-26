"use client";

import QuestionCard from "@/components/study/QuestionCard";
import AnswerInput from "@/components/study/AnswerInput";
import Button from "@/components/ui/Button";
import { Flag } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ExamQuestion({
  question,
  questionNumber,
  savedAnswer,
  onAnswer,
  isFlagged,
  onToggleFlag,
  disabled,
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <QuestionCard question={question} questionNumber={questionNumber} />
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => onToggleFlag(question.id)}
          className={cn(
            "flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-colors",
            isFlagged
              ? "bg-yellow-100 text-yellow-700"
              : "text-gray-500 hover:bg-gray-100"
          )}
        >
          <Flag className="h-3.5 w-3.5" />
          {isFlagged ? "Flagged" : "Flag for review"}
        </button>
      </div>

      <AnswerInput
        question={question}
        onSubmit={(answer) => onAnswer(question.id, answer)}
        disabled={disabled}
      />

      {savedAnswer && (
        <p className="text-sm text-gray-500">
          Your answer: <span className="font-medium text-gray-700">{savedAnswer}</span>
        </p>
      )}
    </div>
  );
}
