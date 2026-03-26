"use client";

import Link from "next/link";
import { GraduationCap, BookOpen, HelpCircle, ClipboardCheck, BarChart3, ArrowRight, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";
import { ROUTES } from "@/constants/routes";

const features = [
  {
    icon: BookOpen,
    title: "Free Study",
    description: "Learn at your own pace with AI-generated questions and instant feedback.",
  },
  {
    icon: HelpCircle,
    title: "Quiz Mode",
    description: "Test your knowledge with timed quizzes and detailed scoring.",
  },
  {
    icon: ClipboardCheck,
    title: "Exam Simulation",
    description: "Practice under real exam conditions with hard timers and question navigation.",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    description: "Track your progress, identify weak areas, and get AI-powered study tips.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white">
      {/* Header */}
      <header className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-indigo-500" />
          <span className="text-2xl font-bold text-gray-900">StudyAI</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href={ROUTES.LOGIN}>
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href={ROUTES.REGISTER}>
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-6">
          <Sparkles className="h-4 w-4" />
          Powered by AI
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Study Smarter,
          <br />
          <span className="text-indigo-500">Not Harder</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          StudyAI generates personalized questions, evaluates your answers in real-time,
          and tracks your progress — all powered by advanced AI.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href={ROUTES.REGISTER}>
            <Button size="lg">
              Start Learning Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href={ROUTES.LOGIN}>
            <Button variant="outline" size="lg">
              Sign In
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Everything you need to excel
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="h-12 w-12 rounded-lg bg-indigo-100 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-indigo-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-indigo-500 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to boost your grades?</h2>
          <p className="text-indigo-100 mb-8 max-w-md mx-auto">
            Join thousands of students using AI to study more effectively.
          </p>
          <Link href={ROUTES.REGISTER}>
            <Button
              variant="secondary"
              size="lg"
              className="bg-white text-indigo-600 hover:bg-indigo-50"
            >
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 py-8 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-400">StudyAI — AI-Powered Learning Platform</p>
      </footer>
    </div>
  );
}
