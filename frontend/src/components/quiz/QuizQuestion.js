"use client";

import QuestionCard from "@/components/study/QuestionCard";
import AnswerInput from "@/components/study/AnswerInput";

export default function QuizQuestion({
  question,
  questionNumber,
  savedAnswer,
  onAnswer,
  disabled,
}) {
  return (
    <div className="space-y-4">
      <QuestionCard question={question} questionNumber={questionNumber} />
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
