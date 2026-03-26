"use client";

import { useState, useCallback } from "react";
import useStudyStore from "@/store/studyStore";
import toast from "react-hot-toast";

export default function useQuiz() {
  const [isStarting, setIsStarting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const store = useStudyStore();

  const startQuiz = useCallback(async (config) => {
    setIsStarting(true);
    setResults(null);
    setCurrentIndex(0);
    setAnswers({});
    try {
      const data = await store.startQuiz(config);
      toast.success("Quiz started!");
      return data;
    } catch {
      toast.error("Failed to start quiz");
    } finally {
      setIsStarting(false);
    }
  }, [store]);

  const saveAnswer = useCallback((questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  }, []);

  const goToQuestion = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  const submitQuiz = useCallback(async (sessionId) => {
    setIsSubmitting(true);
    try {
      const answerArray = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer,
      }));
      const data = await store.submitQuiz(sessionId, answerArray);
      const resultData = await store.getQuizResults(sessionId);
      setResults(resultData);
      toast.success("Quiz submitted!");
      return resultData;
    } catch {
      toast.error("Failed to submit quiz");
    } finally {
      setIsSubmitting(false);
    }
  }, [store, answers]);

  return {
    ...store,
    isStarting,
    isSubmitting,
    results,
    currentIndex,
    answers,
    startQuiz,
    saveAnswer,
    goToQuestion,
    submitQuiz,
  };
}
