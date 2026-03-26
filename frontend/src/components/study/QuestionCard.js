"use client";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { getDifficultyColor } from "@/lib/utils";
import { QUESTION_TYPES } from "@/constants/subjects";

export default function QuestionCard({ question, questionNumber }) {
  if (!question) return null;

  const typeLabels = {
    [QUESTION_TYPES.MCQ]: "Multiple Choice",
    [QUESTION_TYPES.TRUE_FALSE]: "True / False",
    [QUESTION_TYPES.SHORT_ANSWER]: "Short Answer",
    [QUESTION_TYPES.ESSAY]: "Essay",
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-500">
          Question {questionNumber}
        </span>
        <div className="flex items-center gap-2">
          <Badge variant="primary">{typeLabels[question.type] || question.type}</Badge>
          <Badge
            variant={
              question.difficulty === "EASY"
                ? "success"
                : question.difficulty === "HARD"
                ? "danger"
                : "warning"
            }
          >
            {question.difficulty}
          </Badge>
        </div>
      </div>

      <p className="text-gray-900 text-base leading-relaxed">
        {question.questionText}
      </p>
    </Card>
  );
}
