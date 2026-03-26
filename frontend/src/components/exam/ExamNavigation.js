"use client";

import { cn } from "@/lib/utils";
import { Flag } from "lucide-react";

export default function ExamNavigation({
  questions,
  currentIndex,
  answers,
  flagged,
  onNavigate,
}) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-700">Questions</h4>
      <div className="grid grid-cols-5 gap-2">
        {questions.map((q, idx) => {
          const isAnswered = !!answers[q.id];
          const isFlagged = flagged.has(q.id);
          const isCurrent = idx === currentIndex;

          return (
            <button
              key={q.id}
              onClick={() => onNavigate(idx)}
              className={cn(
                "relative h-10 rounded-lg text-xs font-medium transition-all",
                isCurrent && "ring-2 ring-indigo-500 ring-offset-1",
                isAnswered
                  ? "bg-indigo-100 text-indigo-700"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              )}
            >
              {idx + 1}
              {isFlagged && (
                <Flag className="absolute -top-1 -right-1 h-3 w-3 text-yellow-500" />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded bg-indigo-100" />
          Answered
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded bg-gray-100" />
          Unanswered
        </div>
        <div className="flex items-center gap-1.5">
          <Flag className="h-3 w-3 text-yellow-500" />
          Flagged
        </div>
      </div>
    </div>
  );
}
