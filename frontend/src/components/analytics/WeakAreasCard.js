"use client";

import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";
import { AlertTriangle } from "lucide-react";

export default function WeakAreasCard({ weakAreas = [] }) {
  if (weakAreas.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weak Areas</CardTitle>
        </CardHeader>
        <p className="text-sm text-gray-500">No weak areas identified yet. Keep studying!</p>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          Weak Areas
        </CardTitle>
      </CardHeader>
      <div className="space-y-4">
        {weakAreas.map((area, idx) => (
          <div key={idx}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-700 font-medium">{area.topic || area.topicName}</span>
              <span className="text-gray-500">{Math.round(area.avgScore || area.score)}%</span>
            </div>
            <ProgressBar
              value={area.avgScore || area.score || 0}
              max={100}
              size="sm"
              color={area.avgScore < 40 ? "red" : "yellow"}
            />
            <p className="text-xs text-gray-400 mt-0.5">{area.subject || area.subjectName}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
