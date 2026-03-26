"use client";

import { Clock } from "lucide-react";
import { formatTimeRemaining } from "@/lib/utils";

export default function StudyTimer({ seconds }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <Clock className="h-4 w-4" />
      <span className="font-mono">{formatTimeRemaining(seconds)}</span>
    </div>
  );
}
