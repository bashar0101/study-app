"use client";

import { DIFFICULTY_OPTIONS } from "@/constants/subjects";
import { cn } from "@/lib/utils";

export default function DifficultySelector({ value, onChange }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700">Difficulty</h3>
      <div className="flex gap-3">
        {DIFFICULTY_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex-1 py-2.5 px-4 rounded-lg text-sm font-medium border transition-all",
              value === opt.value
                ? `${opt.bg} ${opt.color} border-current`
                : "border-gray-200 text-gray-600 hover:bg-gray-50"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
