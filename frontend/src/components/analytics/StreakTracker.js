"use client";

import Card from "@/components/ui/Card";
import { Flame } from "lucide-react";

export default function StreakTracker({ streak = 0 }) {
  return (
    <Card className="flex items-center gap-4">
      <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
        <Flame className="h-6 w-6 text-orange-500" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{streak}</p>
        <p className="text-sm text-gray-500">Day streak</p>
      </div>
    </Card>
  );
}
