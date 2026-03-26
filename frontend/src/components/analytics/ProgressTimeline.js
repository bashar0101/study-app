"use client";

import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export default function ProgressTimeline({ data = [] }) {
  // Build a 7x~15 grid for the last ~100 days
  const today = new Date();
  const cells = [];

  for (let i = 104; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const dayData = data.find((d) => d.date === dateStr);
    const count = dayData?.count || dayData?.sessionsCount || 0;

    cells.push({ date: dateStr, count });
  }

  const getColor = (count) => {
    if (count === 0) return "bg-gray-100";
    if (count <= 1) return "bg-green-200";
    if (count <= 3) return "bg-green-400";
    return "bg-green-600";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Heatmap</CardTitle>
      </CardHeader>
      <div className="flex flex-wrap gap-1">
        {cells.map((cell) => (
          <div
            key={cell.date}
            className={cn("w-3 h-3 rounded-sm", getColor(cell.count))}
            title={`${cell.date}: ${cell.count} sessions`}
          />
        ))}
      </div>
      <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
        <span>Less</span>
        <div className="flex gap-0.5">
          <div className="w-3 h-3 rounded-sm bg-gray-100" />
          <div className="w-3 h-3 rounded-sm bg-green-200" />
          <div className="w-3 h-3 rounded-sm bg-green-400" />
          <div className="w-3 h-3 rounded-sm bg-green-600" />
        </div>
        <span>More</span>
      </div>
    </Card>
  );
}
