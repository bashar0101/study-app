"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle, XCircle, Trophy, Clock, Target } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import AIFeedback from "@/components/study/AIFeedback";
import api from "@/lib/api";
import { ROUTES } from "@/constants/routes";
import { formatDate, formatDuration, getScoreColor, getScoreBg } from "@/lib/utils";

export default function ResultsPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // Try quiz results first, then exam, then generic session
        let result;
        try {
          result = await api.get(`/quiz/${id}/results`);
        } catch {
          try {
            result = await api.get(`/exam/${id}/results`);
          } catch {
            result = await api.get(`/analytics/history/${id}`);
          }
        }
        setData(result);
      } catch {
        // Could not fetch results
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <p className="text-gray-500 mb-4">Session results not found</p>
        <Link href={ROUTES.HISTORY}>
          <Button variant="outline">Back to History</Button>
        </Link>
      </div>
    );
  }

  const session = data.session || data;
  const questions = data.questions || [];
  const score = session.score ?? 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href={ROUTES.HISTORY}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
      </div>

      {/* Score card */}
      <Card className="text-center">
        <Trophy className="h-10 w-10 text-indigo-500 mx-auto mb-3" />
        <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${getScoreBg(score)} mb-4`}>
          <span className={`text-3xl font-bold ${getScoreColor(score)}`}>
            {Math.round(score)}%
          </span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          {session.mode} Session Complete
        </h2>
        <div className="flex items-center justify-center gap-4 text-sm text-gray-500 mt-2">
          <Badge variant={
            session.mode === "STUDY" ? "primary" :
            session.mode === "QUIZ" ? "info" : "warning"
          }>
            {session.mode}
          </Badge>
          <span>{session.subjectName}</span>
          <span>{formatDate(session.createdAt)}</span>
        </div>
        <div className="flex justify-center gap-6 text-sm text-gray-500 mt-4">
          <div className="flex items-center gap-1.5">
            <Target className="h-4 w-4" />
            {session.correctAnswers ?? 0}/{session.totalQuestions} correct
          </div>
          {session.completedAt && session.startedAt && (
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {formatDuration(
                Math.round((new Date(session.completedAt) - new Date(session.startedAt)) / 1000)
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Questions review */}
      {questions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Question Review</h3>
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

              {q.aiEvaluation && <AIFeedback feedback={q.aiEvaluation} />}
            </Card>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Link href={ROUTES.HISTORY} className="flex-1">
          <Button variant="outline" className="w-full">View History</Button>
        </Link>
        <Link href={ROUTES.DASHBOARD} className="flex-1">
          <Button className="w-full">Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
