"use client";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { CheckCircle, XCircle, Lightbulb, TrendingUp } from "lucide-react";

export default function AIFeedback({ feedback }) {
  if (!feedback) return null;

  const isCorrect = feedback.isCorrect || feedback.score >= 70;

  return (
    <Card className="animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        {isCorrect ? (
          <CheckCircle className="h-6 w-6 text-green-500" />
        ) : (
          <XCircle className="h-6 w-6 text-red-500" />
        )}
        <div>
          <span className="font-semibold text-gray-900">
            {isCorrect ? "Correct!" : "Not quite right"}
          </span>
          {feedback.score !== undefined && (
            <Badge
              variant={isCorrect ? "success" : "danger"}
              className="ml-2"
            >
              Score: {feedback.score}/100
            </Badge>
          )}
        </div>
      </div>

      {feedback.feedback && (
        <p className="text-sm text-gray-700 mb-4">{feedback.feedback}</p>
      )}

      {feedback.strengths?.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-1.5 mb-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-green-700">Strengths</span>
          </div>
          <ul className="space-y-1">
            {feedback.strengths.map((s, i) => (
              <li key={i} className="text-sm text-gray-600 pl-5 relative before:content-['•'] before:absolute before:left-1.5 before:text-green-400">
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {feedback.improvements?.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Lightbulb className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium text-yellow-700">Areas for Improvement</span>
          </div>
          <ul className="space-y-1">
            {feedback.improvements.map((imp, i) => (
              <li key={i} className="text-sm text-gray-600 pl-5 relative before:content-['•'] before:absolute before:left-1.5 before:text-yellow-400">
                {imp}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
