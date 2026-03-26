"use client";

import { useState, useCallback } from "react";
import useStudyStore from "@/store/studyStore";
import toast from "react-hot-toast";

export default function useStudySession() {
  const [isStarting, setIsStarting] = useState(false);
  const store = useStudyStore();

  const startSession = useCallback(async (config) => {
    setIsStarting(true);
    try {
      const data = await store.startStudy(config);
      toast.success("Study session started!");
      return data;
    } catch {
      toast.error("Failed to start study session");
    } finally {
      setIsStarting(false);
    }
  }, [store]);

  const submitAnswer = useCallback(async (sessionId, answerData) => {
    try {
      const data = await store.submitStudyAnswer(sessionId, answerData);
      return data;
    } catch {
      toast.error("Failed to submit answer");
    }
  }, [store]);

  const nextQuestion = useCallback(async (sessionId) => {
    try {
      const data = await store.getNextQuestion(sessionId);
      return data;
    } catch {
      toast.error("Failed to get next question");
    }
  }, [store]);

  const endSession = useCallback(async (sessionId) => {
    try {
      const data = await store.endStudy(sessionId);
      toast.success("Study session ended");
      return data;
    } catch {
      toast.error("Failed to end session");
    }
  }, [store]);

  return {
    ...store,
    isStarting,
    startSession,
    submitAnswer,
    nextQuestion,
    endSession,
  };
}
