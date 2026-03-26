"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { 
  Trophy, 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Send,
  Flag,
  AlertCircle
} from "lucide-react";
import useStudyStore from "@/store/studyStore";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import ExamConfig from "@/components/exam/ExamConfig";
import ExamQuestion from "@/components/exam/ExamQuestion";
import ExamNavigation from "@/components/exam/ExamNavigation";
import ExamResults from "@/components/exam/ExamResults";
import ExamTimer from "@/components/exam/ExamTimer";
import toast from "react-hot-toast";

export default function ExamPage() {
  const { 
    currentSession, 
    questions, 
    startExam, 
    submitExamAnswer, 
    submitExam,
    isSubmitting,
    clearSession
  } = useStudyStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState(new Set());
  const [startTime, setStartTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const [isStarting, setIsStarting] = useState(false);
  
  const timerRef = useRef(null);

  // Clear session on unmount
  useEffect(() => {
    return () => {
      clearSession();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [clearSession]);

  // Timer logic
  useEffect(() => {
    if (currentSession?.status === "IN_PROGRESS" && timeLeft > 0 && !showResults) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentSession, timeLeft, showResults]);

  const handleAutoSubmit = useCallback(async () => {
    toast.error("Time is up! Submitting your exam automatically...", { duration: 5000 });
    await forceSubmit();
  }, [currentSession]);

  const handleStart = async (config) => {
    setIsStarting(true);
    try {
      const data = await startExam(config);
      setTimeLeft(config.timeLimitMin * 60);
      setStartTime(Date.now());
      setCurrentIndex(0);
      setAnswers({});
      setFlagged(new Set());
      setShowResults(false);
    } catch (error) {
      console.error("Failed to start exam", error);
      toast.error("Failed to generate exam questions. Please try again.");
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
      await submitExamAnswer(currentSession.id, {
        questionId,
        answer,
        timeSpentSec
      });
      setStartTime(Date.now());
    } catch (error) {
      console.error("Failed to save answer", error);
    }
  }, [currentSession, startTime, submitExamAnswer]);

  const toggleFlag = (questionId) => {
    setFlagged(prev => {
      const next = new Set(prev);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
      return next;
    });
  };

  const forceSubmit = async () => {
    if (!currentSession) return;
    try {
      const data = await submitExam(currentSession.id, answers);
      setResults(data);
      setShowResults(true);
    } catch (error) {
      console.error("Failed to submit exam", error);
      toast.error("An error occurred while submitting your exam.");
    }
  };

  const handleSubmitRequest = async () => {
    const unansweredCount = questions.length - Object.keys(answers).length;
    const flaggedCount = flagged.size;

    let message = "Are you sure you want to submit your exam?";
    if (unansweredCount > 0 || flaggedCount > 0) {
      message = `You have ${unansweredCount} unanswered and ${flaggedCount} flagged questions. Submit anyway?`;
    }

    if (window.confirm(message)) {
      await forceSubmit();
    }
  };

  const handleNavigate = (index) => {
    setCurrentIndex(index);
    setStartTime(Date.now());
  };

  if (showResults) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-yellow-50 text-yellow-600">
            <Trophy className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Exam Results</h1>
        </div>
        <ExamResults results={results} />
      </div>
    );
  }

  if (!currentSession) {
    return (
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-yellow-50 text-yellow-600">
            <Trophy className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Exam Mode</h1>
            <p className="text-gray-500">Formal assessment with strict time limits and detailed performance evaluation.</p>
          </div>
        </div>

        <Card className="p-6">
          <ExamConfig onStart={handleStart} isStarting={isStarting} />
        </Card>
        
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
          <div className="flex gap-4">
            <AlertCircle className="h-6 w-6 text-amber-500 shrink-0" />
            <div className="text-sm text-amber-900">
              <p className="font-bold mb-1">Important Instruction</p>
              <ul className="list-disc list-inside space-y-1 opacity-90">
                <li>The exam is timed. If time runs out, it will be submitted automatically.</li>
                <li>Your answers are saved as you go. You can flag questions to review them later.</li>
                <li>AI will perform a deep evaluation of your answers once you submit.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 pb-20">
      {/* Sidebar: Nav & Timer */}
      <div className="lg:col-span-1 space-y-6">
        <Button variant="ghost" size="sm" onClick={clearSession} className="text-gray-500 group">
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Exit Exam
        </Button>

        <Card className="p-5 sticky top-24 space-y-6">
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Time Remaining</h3>
            <ExamTimer seconds={timeLeft} />
          </div>
          
          <ExamNavigation
            questions={questions}
            currentIndex={currentIndex}
            answers={answers}
            flagged={flagged}
            onNavigate={handleNavigate}
          />
          
          <div className="pt-4 border-t border-gray-100">
            <Button 
              className="w-full shadow-lg shadow-indigo-100" 
              onClick={handleSubmitRequest} 
              loading={isSubmitting}
            >
              <Send className="h-4 w-4 mr-2" />
              Finish Exam
            </Button>
          </div>
        </Card>
      </div>

      {/* Main Content: Question */}
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <ExamQuestion
            question={questions[currentIndex]}
            questionNumber={currentIndex + 1}
            savedAnswer={answers[questions[currentIndex]?.id]}
            onAnswer={handleAnswer}
            isFlagged={flagged.has(questions[currentIndex]?.id)}
            onToggleFlag={toggleFlag}
            disabled={isSubmitting}
          />
        </div>

        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <Button
            variant="ghost"
            onClick={() => handleNavigate(currentIndex - 1)}
            disabled={currentIndex === 0}
            className="px-6"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="hidden sm:block text-sm font-medium text-gray-400">
            Question <span className="text-gray-900">{currentIndex + 1}</span> of <span className="text-gray-900">{questions.length}</span>
          </div>

          {currentIndex === questions.length - 1 ? (
            <Button onClick={handleSubmitRequest} loading={isSubmitting} className="px-8">
              Submit Exam
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => handleNavigate(currentIndex + 1)}
              className="px-6"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
