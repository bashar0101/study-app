"use client";

import { useState, useCallback } from "react";
import useStudyStore from "@/store/studyStore";
import toast from "react-hot-toast";

export default function useExam() {
  const [isStarting, setIsStarting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState(new Set());
  const store = useStudyStore();

  const startExam = useCallback(async (config) => {
    setIsStarting(true);
    setResults(null);
    setCurrentIndex(0);
    setAnswers({});
    setFlagged(new Set());
    try {
      const data = await store.startExam(config);
      toast.success("Exam started! Good luck!");
      return data;
    } catch {
      toast.error("Failed to start exam");
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

  const toggleFlag = useCallback((questionId) => {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  }, []);

  const submitExam = useCallback(async (sessionId) => {
    setIsSubmitting(true);
    try {
      const answerArray = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer,
      }));
      await store.submitExam(sessionId, answerArray);
      const resultData = await store.getExamResults(sessionId);
      setResults(resultData);
      toast.success("Exam submitted!");
      return resultData;
    } catch {
      toast.error("Failed to submit exam");
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
    flagged,
    startExam,
    saveAnswer,
    goToQuestion,
    toggleFlag,
    submitExam,
  };
}
