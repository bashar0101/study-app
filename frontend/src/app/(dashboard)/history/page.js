"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { History, ChevronLeft, ChevronRight } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import useAnalytics from "@/hooks/useAnalytics";
import { ROUTES } from "@/constants/routes";
import { formatDateTime, getScoreColor } from "@/lib/utils";

export default function HistoryPage() {
  const { history, isLoading, fetchHistory } = useAnalytics();
  const [page, setPage] = useState(1);
  const limit = 20;

  useEffect(() => {
    fetchHistory(page, limit);
  }, [fetchHistory, page]);

  const sessions = history?.sessions || [];
  const total = history?.total || 0;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gray-100 text-gray-600">
          <History className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Session History</h1>
          <p className="text-gray-500 text-sm">Review your past study sessions</p>
        </div>
      </div>

      {isLoading && sessions.length === 0 ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : sessions.length === 0 ? (
        <Card className="text-center py-16">
          <History className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No sessions yet</p>
          <p className="text-sm text-gray-400 mt-1">Start studying to build your history</p>
        </Card>
      ) : (
        <>
          <Card padding={false}>
            {/* Table header */}
            <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="col-span-1">Mode</div>
              <div className="col-span-3">Subject</div>
              <div className="col-span-2">Topic</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-1">Questions</div>
              <div className="col-span-1">Score</div>
              <div className="col-span-2">Status</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-gray-100">
              {sessions.map((session) => (
                <Link
                  key={session.id}
                  href={ROUTES.RESULTS(session.id)}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-6 py-4 hover:bg-gray-50 transition-colors items-center"
                >
                  <div className="col-span-1">
                    <Badge
                      variant={
                        session.mode === "STUDY" ? "primary" :
                        session.mode === "QUIZ" ? "info" : "warning"
                      }
                    >
                      {session.mode}
                    </Badge>
                  </div>
                  <div className="col-span-3 text-sm font-medium text-gray-900">
                    {session.subjectName}
                  </div>
                  <div className="col-span-2 text-sm text-gray-500">
                    {session.topicName || "All topics"}
                  </div>
                  <div className="col-span-2 text-sm text-gray-500">
                    {formatDateTime(session.createdAt)}
                  </div>
                  <div className="col-span-1 text-sm text-gray-700">
                    {session.correctAnswers ?? 0}/{session.totalQuestions}
                  </div>
                  <div className="col-span-1">
                    {session.score !== null && session.score !== undefined ? (
                      <span className={`text-sm font-semibold ${getScoreColor(session.score)}`}>
                        {Math.round(session.score)}%
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </div>
                  <div className="col-span-2">
                    <Badge
                      variant={
                        session.status === "COMPLETED" ? "success" :
                        session.status === "IN_PROGRESS" ? "warning" : "default"
                      }
                    >
                      {session.status}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing {(page - 1) * limit + 1}-{Math.min(page * limit, total)} of {total}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-700 px-2">
                  {page} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
