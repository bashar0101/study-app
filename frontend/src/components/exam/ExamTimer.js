"use client";

import { cn } from "@/lib/utils";
import { formatTimeRemaining } from "@/lib/utils";
import { Clock, AlertTriangle } from "lucide-react";

export default function ExamTimer({ seconds }) {
  const isLow = seconds <= 300; // 5 minutes
  const isCritical = seconds <= 60; // 1 minute

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm font-medium",
        isCritical
          ? "bg-red-100 text-red-700 animate-pulse-soft"
          : isLow
          ? "bg-yellow-100 text-yellow-700"
          : "bg-gray-100 text-gray-700"
      )}
    >
      {isCritical ? (
        <AlertTriangle className="h-4 w-4" />
      ) : (
        <Clock className="h-4 w-4" />
      )}
      {formatTimeRemaining(seconds)}
    </div>
  );
}
