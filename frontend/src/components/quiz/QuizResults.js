"use client";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { getScoreColor, getScoreBg } from "@/lib/utils";
import { CheckCircle, XCircle, RotateCcw } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default function QuizResults({ results, onRetry }) {
  if (!results) return null;

  const session = results.session || results;
  const questions = results.questions || [];
  const score = session.score ?? 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Score card */}
      <Card className="text-center">
        <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${getScoreBg(score)} mb-4`}>
          <span className={`text-3xl font-bold ${getScoreColor(score)}`}>
            {Math.round(score)}%
          </span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Quiz Complete!</h2>
        <p className="text-sm text-gray-500">
          You got {session.correctAnswers} out of {session.totalQuestions} questions correct
        </p>
      </Card>

      {/* Question review */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Review</h3>
        {questions.map((q, idx) => (
          <Card key={q.id} className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {q.isCorrect ? (
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500 shrink-0" />
                )}
                <span className="text-sm font-medium text-gray-500">Q{idx + 1}</span>
              </div>
              <Badge variant={q.isCorrect ? "success" : "danger"}>
                {q.isCorrect ? "Correct" : "Incorrect"}
              </Badge>
            </div>

            <p className="text-sm text-gray-900">{q.questionText}</p>

            {q.userAnswer && (
              <p className="text-sm">
                <span className="text-gray-500">Your answer: </span>
                <span className={q.isCorrect ? "text-green-600" : "text-red-600"}>
                  {q.userAnswer}
                </span>
              </p>
            )}

            {!q.isCorrect && (
              <p className="text-sm">
                <span className="text-gray-500">Correct answer: </span>
                <span className="text-green-600">{q.correctAnswer}</span>
              </p>
            )}

            {q.explanation && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600">{q.explanation}</p>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onRetry} className="flex-1">
          <RotateCcw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
        <Link href={ROUTES.DASHBOARD} className="flex-1">
          <Button variant="primary" className="w-full">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
