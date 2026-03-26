"use client";

import { useState, useEffect } from "react";
import { 
  BookOpen, 
  ArrowLeft, 
  ChevronRight, 
  Lightbulb, 
  CheckCircle2,
  AlertCircle 
} from "lucide-react";
import Link from "next/link";
import useStudyStore from "@/store/studyStore";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import SubjectSelector from "@/components/study/SubjectSelector";
import DifficultySelector from "@/components/study/DifficultySelector";
import QuestionCard from "@/components/study/QuestionCard";
import AnswerInput from "@/components/study/AnswerInput";
import AIFeedback from "@/components/study/AIFeedback";
import { ROUTES } from "@/constants/routes";
import toast from "react-hot-toast";

export default function StudyPage() {
  const { 
    currentSession, 
    currentQuestion, 
    startStudy, 
    getNextQuestion, 
    submitStudyAnswer, 
    isSubmitting,
    isLoadingQuestion,
    feedback,
    clearSession
  } = useStudyStore();

  const [setup, setSetup] = useState({
    subjectId: "",
    topicId: null,
    difficulty: "MEDIUM"
  });
  
  const [startTime, setStartTime] = useState(null);

  // Clear session on unmount or when navigating away
  useEffect(() => {
    return () => clearSession();
  }, [clearSession]);

  const handleStart = async () => {
    if (!setup.subjectId) {
      toast.error("Please select a subject first");
      return;
    }
    try {
      await startStudy(setup);
      setStartTime(Date.now());
    } catch (error) {
      console.error("Failed to start study session", error);
    }
  };

  const handleSubmitAnswer = async (answer) => {
    if (!currentSession || !currentQuestion) return;
    
    const timeSpentSec = Math.round((Date.now() - startTime) / 1000);
    
    try {
      await submitStudyAnswer(currentSession.id, {
        questionId: currentQuestion.id,
        answer,
        timeSpentSec
      });
    } catch (error) {
      console.error("Failed to submit answer", error);
    }
  };

  const handleNext = async () => {
    if (!currentSession) return;
    try {
      await getNextQuestion(currentSession.id);
      setStartTime(Date.now());
    } catch (error) {
      console.error("Failed to get next question", error);
    }
  };

  // If no session is active, show the setup configuration
  if (!currentSession) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Study Mode</h1>
            <p className="text-gray-500">Choose your subject and start learning at your own pace.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <SubjectSelector 
                selectedSubjectId={setup.subjectId}
                selectedTopicId={setup.topicId}
                onSelect={(id) => setSetup({ ...setup, subjectId: id, topicId: null })}
                onTopicSelect={(id) => setSetup({ ...setup, topicId: id })}
              />
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <DifficultySelector 
                value={setup.difficulty}
                onChange={(val) => setSetup({ ...setup, difficulty: val })}
              />
            </Card>

            <Button 
              size="lg" 
              className="w-full h-14 text-lg" 
              onClick={handleStart}
              disabled={!setup.subjectId}
            >
              Start Session
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <div className="flex gap-3">
                <Lightbulb className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Study Tip</p>
                  <p>In Study Mode, AI will evaluate each answer immediately and provide helpful feedback to guide your learning.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active Session view
  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      {/* Session Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={clearSession} className="text-gray-500">
          <ArrowLeft className="h-4 w-4 mr-2" />
          End Session
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-400">Subject:</span>
          <span className="text-sm font-bold text-gray-700">{currentSession.subjectName}</span>
        </div>
      </div>

      {isLoadingQuestion ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-4">
          <Spinner size="lg" />
          <p className="text-gray-500 animate-pulse">AI is generating your next question...</p>
        </div>
      ) : (
        <>
          <QuestionCard 
            question={currentQuestion} 
            questionNumber={currentSession.totalQuestions}
          />

          {!feedback ? (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Your Answer</h3>
              <AnswerInput 
                question={currentQuestion}
                onSubmit={handleSubmitAnswer}
                isSubmitting={isSubmitting}
              />
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <AIFeedback feedback={feedback} />
              
              <div className="flex gap-4">
                <Button variant="outline" className="flex-1 py-6" onClick={clearSession}>
                  Finish Study
                </Button>
                <Button className="flex-1 py-6 shadow-lg shadow-indigo-100" onClick={handleNext}>
                  Next Question
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
