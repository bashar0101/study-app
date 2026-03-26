"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  HelpCircle, 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Send,
  Clock
} from "lucide-react";
import useStudyStore from "@/store/studyStore";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import QuizConfig from "@/components/quiz/QuizConfig";
import QuizQuestion from "@/components/quiz/QuizQuestion";
import QuizProgress from "@/components/quiz/QuizProgress";
import QuizResults from "@/components/quiz/QuizResults";
import toast from "react-hot-toast";

export default function QuizPage() {
  const { 
    currentSession, 
    questions, 
    startQuiz, 
    submitQuizAnswer, 
    submitQuiz,
    isSubmitting,
    clearSession
  } = useStudyStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [startTime, setStartTime] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const [isStarting, setIsStarting] = useState(false);

  // Clear session on unmount
  useEffect(() => {
    return () => clearSession();
  }, [clearSession]);

  const handleStart = async (config) => {
    setIsStarting(true);
    try {
      await startQuiz(config);
      setStartTime(Date.now());
      setCurrentIndex(0);
      setAnswers({});
      setShowResults(false);
    } catch (error) {
      console.error("Failed to start quiz", error);
      toast.error("Failed to generate quiz questions. Please try again.");
    } finally {
      setIsStarting(false);
    }
  };

  const handleAnswer = useCallback(async (questionId, answer) => {
    if (!currentSession) return;
    
    const timeSpentSec = Math.round((Date.now() - startTime) / 1000);
    
    // Optimistic update
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
    
    try {
      await submitQuizAnswer(currentSession.id, {
        questionId,
        answer,
        timeSpentSec
      });
      // Reset start time for the next question or the next action
      setStartTime(Date.now());
    } catch (error) {
      console.error("Failed to save answer", error);
    }
  }, [currentSession, startTime, submitQuizAnswer]);

  const handleSubmit = async () => {
    if (!currentSession) return;
    
    const unansweredCount = questions.length - Object.keys(answers).length;
    if (unansweredCount > 0) {
      if (!confirm(`You have ${unansweredCount} unanswered questions. Are you sure you want to submit?`)) {
        return;
      }
    }

    try {
      const data = await submitQuiz(currentSession.id, answers);
      setResults(data);
      setShowResults(true);
    } catch (error) {
      console.error("Failed to submit quiz", error);
      toast.error("Failed to submit quiz. Please try again.");
    }
  };

  const handleNavigate = (index) => {
    setCurrentIndex(index);
    setStartTime(Date.now());
  };

  // If results are available, show the results view
  if (showResults) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
            <HelpCircle className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Quiz Results</h1>
        </div>
        <QuizResults results={results} onRetry={() => setShowResults(false)} />
      </div>
    );
  }

  // If no session is active, show the configuration view
  if (!currentSession) {
    return (
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
            <HelpCircle className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quiz Mode</h1>
            <p className="text-gray-500">Test your knowledge with multiple-choice, true/false, and short questions.</p>
          </div>
        </div>

        <Card className="p-6">
          <QuizConfig onStart={handleStart} isStarting={isStarting} />
        </Card>
      </div>
    );
  }

  // Active Quiz View
  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
      {/* Left Column: Progress & Nav */}
      <div className="lg:col-span-1 space-y-6">
        <Button variant="ghost" size="sm" onClick={clearSession} className="text-gray-500">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Cancel Quiz
        </Button>

        <Card className="p-5 sticky top-24">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-indigo-500" />
            Progress
          </h3>
          <QuizProgress
            total={questions.length}
            answered={Object.keys(answers).length}
            currentIndex={currentIndex}
            onNavigate={handleNavigate}
            answers={answers}
            questions={questions}
          />
          
          <div className="mt-8">
            <Button 
              className="w-full" 
              onClick={handleSubmit} 
              loading={isSubmitting}
              variant={Object.keys(answers).length === questions.length ? "primary" : "outline"}
            >
              <Send className="h-4 w-4 mr-2" />
              Submit Quiz
            </Button>
          </div>
        </Card>
      </div>

      {/* Right Column: Active Question */}
      <div className="lg:col-span-2 space-y-6">
        <QuizQuestion
          question={questions[currentIndex]}
          questionNumber={currentIndex + 1}
          savedAnswer={answers[questions[currentIndex]?.id]}
          onAnswer={handleAnswer}
          disabled={isSubmitting}
        />

        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <Button
            variant="ghost"
            onClick={() => handleNavigate(currentIndex - 1)}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          <span className="text-sm font-medium text-gray-400">
            Question {currentIndex + 1} of {questions.length}
          </span>

          {currentIndex === questions.length - 1 ? (
            <Button onClick={handleSubmit} loading={isSubmitting}>
              Submit Quiz
            </Button>
          ) : (
            <Button
              variant="ghost"
              onClick={() => handleNavigate(currentIndex + 1)}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
