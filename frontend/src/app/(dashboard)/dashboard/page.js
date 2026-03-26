"use client";

import { useEffect, useState } from "react";
import { 
  Rocket, 
  BarChart3, 
  Clock, 
  Trophy, 
  ArrowRight,
  BookOpen,
  HelpCircle,
  ClipboardCheck
} from "lucide-react";
import Link from "next/link";
import useAuthStore from "@/store/authStore";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constants/routes";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    totalSessions: 0,
    questionsAnswered: 0,
    avgScore: 0,
    streak: 0
  });

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <section>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name || "Student"}! 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Continue your learning journey with AI-powered study sessions.
        </p>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Sessions" 
          value={stats.totalSessions} 
          icon={Clock} 
          color="bg-blue-50 text-blue-600" 
        />
        <StatCard 
          title="Questions" 
          value={stats.questionsAnswered} 
          icon={Rocket} 
          color="bg-purple-50 text-purple-600" 
        />
        <StatCard 
          title="Avg. Score" 
          value={`${stats.avgScore}%`} 
          icon={BarChart3} 
          color="bg-green-50 text-green-600" 
        />
        <StatCard 
          title="Current Streak" 
          value={`${stats.streak} days`} 
          icon={Trophy} 
          color="bg-orange-50 text-orange-600" 
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ActionCard
          title="Study Mode"
          description="Learn at your own pace with AI-generated questions and instant feedback."
          icon={BookOpen}
          href={ROUTES.STUDY}
          buttonText="Start Studying"
          color="border-blue-100 hover:border-blue-200"
          iconColor="bg-blue-50 text-blue-600"
        />
        <ActionCard
          title="Quiz Mode"
          description="Test your knowledge with timed quizzes and get detailed performance reports."
          icon={HelpCircle}
          href={ROUTES.QUIZ}
          buttonText="Take a Quiz"
          color="border-purple-100 hover:border-purple-200"
          iconColor="bg-purple-50 text-purple-600"
        />
        <ActionCard
          title="Exam Mode"
          description="Simulate real exam conditions with full-length assessments and essays."
          icon={ClipboardCheck}
          href={ROUTES.EXAM}
          buttonText="Start Exam"
          color="border-green-100 hover:border-green-200"
          iconColor="bg-green-50 text-green-600"
        />
      </div>

      {/* Recent Activity placeholder */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href={ROUTES.HISTORY} className="text-indigo-600 flex items-center gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-gray-100 rounded-xl">
          <Clock className="h-10 w-10 text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No recent activity found</p>
          <p className="text-sm text-gray-400 mt-1">Start a session to see your progress here.</p>
        </div>
      </Card>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <Card className="p-5 flex items-center gap-4 border-none shadow-sm bg-white">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </Card>
  );
}

function ActionCard({ title, description, icon: Icon, href, buttonText, color, iconColor }) {
  return (
    <Card className={`p-6 border-2 transition-all ${color}`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${iconColor}`}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-6 leading-relaxed">
        {description}
      </p>
      <Button asChild className="w-full justify-between items-center group">
        <Link href={href}>
          {buttonText}
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </Button>
    </Card>
  );
}
