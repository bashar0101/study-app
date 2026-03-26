"use client";

import ProgressBar from "@/components/ui/ProgressBar";
import { cn } from "@/lib/utils";

export default function QuizProgress({
  total,
  answered,
  currentIndex,
  onNavigate,
  answers,
  questions,
}) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          {answered} of {total} answered
        </span>
        <span className="text-sm font-medium text-gray-700">
          {Math.round((answered / total) * 100)}%
        </span>
      </div>

      <ProgressBar value={answered} max={total} color="indigo" />

      <div className="flex flex-wrap gap-2">
        {questions.map((q, idx) => (
          <button
            key={q.id}
            onClick={() => onNavigate(idx)}
            className={cn(
              "h-8 w-8 rounded-lg text-xs font-medium transition-all",
              idx === currentIndex && "ring-2 ring-indigo-500 ring-offset-1",
              answers[q.id]
                ? "bg-indigo-100 text-indigo-700"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            )}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
