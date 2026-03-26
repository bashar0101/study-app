"use client";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import AIFeedback from "@/components/study/AIFeedback";
import { getScoreColor, getScoreBg, formatDuration } from "@/lib/utils";
import { CheckCircle, XCircle, Trophy, Clock, Target } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default function ExamResults({ results }) {
  if (!results) return null;

  const session = results.session || results;
  const questions = results.questions || [];
  const score = session.score ?? 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Score overview */}
      <Card className="text-center">
        <Trophy className="h-12 w-12 text-indigo-500 mx-auto mb-3" />
        <div className={`inline-flex items-center justify-center w-28 h-28 rounded-full ${getScoreBg(score)} mb-4`}>
          <span className={`text-4xl font-bold ${getScoreColor(score)}`}>
            {Math.round(score)}%
          </span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Exam Complete!</h2>

        <div className="flex justify-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-1.5">
            <Target className="h-4 w-4" />
            {session.correctAnswers}/{session.totalQuestions} correct
          </div>
          {session.completedAt && session.startedAt && (
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {formatDuration(
                Math.round(
                  (new Date(session.completedAt) - new Date(session.startedAt)) / 1000
                )
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Detailed breakdown */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Detailed Review</h3>
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
                <Badge variant="primary" className="text-xs">{q.type}</Badge>
              </div>
              {q.timeSpentSec && (
                <span className="text-xs text-gray-400">
                  {formatDuration(q.timeSpentSec)}
                </span>
              )}
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

            {!q.isCorrect && q.correctAnswer && (
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

            {q.aiEvaluation && (
              <AIFeedback feedback={q.aiEvaluation} />
            )}
          </Card>
        ))}
      </div>

      <div className="flex gap-3">
        <Link href={ROUTES.EXAM} className="flex-1">
          <Button variant="outline" className="w-full">Take Another Exam</Button>
        </Link>
        <Link href={ROUTES.DASHBOARD} className="flex-1">
          <Button className="w-full">Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
