"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { QUESTION_TYPES } from "@/constants/subjects";

export default function AnswerInput({
  question,
  onSubmit,
  isSubmitting,
  disabled = false,
}) {
  const [answer, setAnswer] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSubmit = () => {
    const finalAnswer =
      question.type === QUESTION_TYPES.MCQ || question.type === QUESTION_TYPES.TRUE_FALSE
        ? selectedOption
        : answer;
    if (!finalAnswer) return;
    onSubmit(finalAnswer);
    setAnswer("");
    setSelectedOption(null);
  };

  if (question.type === QUESTION_TYPES.MCQ && question.options) {
    return (
      <div className="space-y-3">
        <div className="space-y-2">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => !disabled && setSelectedOption(option)}
              disabled={disabled}
              className={cn(
                "w-full text-left p-3 rounded-lg border text-sm transition-all",
                selectedOption === option
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                  : "border-gray-200 hover:bg-gray-50 text-gray-700",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <span className="font-medium mr-2">
                {String.fromCharCode(65 + idx)}.
              </span>
              {option}
            </button>
          ))}
        </div>
        <Button
          onClick={handleSubmit}
          loading={isSubmitting}
          disabled={!selectedOption || disabled}
          className="w-full"
        >
          Submit Answer
        </Button>
      </div>
    );
  }

  if (question.type === QUESTION_TYPES.TRUE_FALSE) {
    return (
      <div className="space-y-3">
        <div className="flex gap-3">
          {["True", "False"].map((opt) => (
            <button
              key={opt}
              onClick={() => !disabled && setSelectedOption(opt)}
              disabled={disabled}
              className={cn(
                "flex-1 py-3 rounded-lg border text-sm font-medium transition-all",
                selectedOption === opt
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                  : "border-gray-200 hover:bg-gray-50 text-gray-700",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {opt}
            </button>
          ))}
        </div>
        <Button
          onClick={handleSubmit}
          loading={isSubmitting}
          disabled={!selectedOption || disabled}
          className="w-full"
        >
          Submit Answer
        </Button>
      </div>
    );
  }

  // Short answer or Essay
  const isEssay = question.type === QUESTION_TYPES.ESSAY;

  return (
    <div className="space-y-3">
      {isEssay ? (
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Write your essay answer..."
          disabled={disabled}
          rows={8}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 disabled:bg-gray-50 resize-y"
        />
      ) : (
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer..."
          disabled={disabled}
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 disabled:bg-gray-50 resize-y"
        />
      )}
      <Button
        onClick={handleSubmit}
        loading={isSubmitting}
        disabled={!answer.trim() || disabled}
        className="w-full"
      >
        Submit Answer
      </Button>
    </div>
  );
}
