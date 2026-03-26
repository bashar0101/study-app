"use client";

import { useEffect, useState } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Award, 
  Clock, 
  Calendar,
  Filter
} from "lucide-react";
import api from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import ScoreChart from "@/components/analytics/ScoreChart";
import SubjectBreakdown from "@/components/analytics/SubjectBreakdown";
import ProgressTimeline from "@/components/analytics/ProgressTimeline";
import WeakAreasCard from "@/components/analytics/WeakAreasCard";
import StreakTracker from "@/components/analytics/StreakTracker";

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7d");

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/analytics/dashboard?range=${timeRange}`);
        setData(res.data || res);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center space-y-4">
        <Spinner size="lg" />
        <p className="text-gray-500 animate-pulse">Analyzing your performance data...</p>
      </div>
    );
  }

  const {
    stats = {
      avgScore: 0,
      sessionsCount: 0,
      totalTimeSpent: 0,
      streak: 0
    },
    performanceHistory = [],
    subjectBreakdown = [],
    activityHistory = [],
    weakAreas = []
  } = data || {};

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Performance Analytics</h1>
          <p className="text-gray-500">Track your progress and identify areas for improvement.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-gray-100 shadow-sm">
          {["7d", "30d", "all"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                timeRange === range
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "All Time"}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{Math.round(stats.avgScore)}%</p>
              <p className="text-sm text-gray-500">Average Score</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center">
              <Award className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.sessionsCount}</p>
              <p className="text-sm text-gray-500">Sessions Finished</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-green-50 flex items-center justify-center">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(stats.totalTimeSpent / 3600)}h
              </p>
              <p className="text-sm text-gray-500">Total Study Time</p>
            </div>
          </div>
        </Card>

        <StreakTracker streak={stats.streak} />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ScoreChart data={performanceHistory} />
        <SubjectBreakdown data={subjectBreakdown} />
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ProgressTimeline data={activityHistory} />
        </div>
        <div className="lg:col-span-1">
          <WeakAreasCard weakAreas={weakAreas} />
        </div>
      </div>
    </div>
  );
}
