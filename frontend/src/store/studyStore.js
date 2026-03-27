import { create } from "zustand";
import api from "@/lib/api";

const useStudyStore = create((set, get) => ({
  subjects: [],
  currentSession: null,
  currentQuestion: null,
  questions: [],
  isLoadingSubjects: false,
  isLoadingQuestion: false,
  isSubmitting: false,
  feedback: null,
  hints: [],

  fetchSubjects: async () => {
    set({ isLoadingSubjects: true });
    try {
      const data = await api.get("/subjects");
      set({ subjects: data.subjects || data, isLoadingSubjects: false });
    } catch {
      set({ isLoadingSubjects: false });
    }
  },

  // Study mode
  startStudy: async ({ subjectId, topicId, difficulty }) => {
    const data = await api.post("/study/start", {
      subjectId,
      topicId,
      difficulty,
    });
    set({
      currentSession: data.session,
      currentQuestion: data.question,
      questions: data.question ? [data.question] : [],
      feedback: null,
      hints: [],
    });
    return data;
  },

  getNextQuestion: async (sessionId) => {
    set({ isLoadingQuestion: true, feedback: null, hints: [] });
    try {
      const data = await api.post(`/study/${sessionId}/next`);
      const question = data.question;
      set((state) => ({
        currentQuestion: question,
        questions: [...state.questions, question],
        isLoadingQuestion: false,
      }));
      return data;
    } catch (error) {
      set({ isLoadingQuestion: false });
      throw error;
    }
  },

  submitStudyAnswer: async (sessionId, { questionId, answer, timeSpentSec }) => {
    set({ isSubmitting: true });
    try {
      const data = await api.post(`/study/${sessionId}/answer`, {
        questionId,
        answer,
        timeSpentSec,
      });
      set({ feedback: data.evaluation || data, isSubmitting: false });
      return data;
    } catch (error) {
      set({ isSubmitting: false });
      throw error;
    }
  },

  endStudy: async (sessionId) => {
    const data = await api.post(`/study/${sessionId}/end`);
    set({ currentSession: null, currentQuestion: null, feedback: null, hints: [] });
    return data;
  },

  // Quiz mode
  startQuiz: async ({ subjectId, topicId, difficulty, questionCount }) => {
    const data = await api.post("/quiz/start", {
      subjectId,
      topicId,
      difficulty,
      questionCount,
    });
    set({
      currentSession: data.session,
      questions: data.questions || [],
      currentQuestion: data.questions?.[0] || null,
      feedback: null,
    });
    return data;
  },

  submitQuizAnswer: async (sessionId, { questionId, answer, timeSpentSec }) => {
    const data = await api.post(`/quiz/${sessionId}/answer`, {
      questionId,
      answer,
      timeSpentSec,
    });
    return data;
  },

  submitQuiz: async (sessionId, answersMap) => {
    // Convert {questionId: answer} object to [{questionId, answer}] array
    const answers = Object.entries(answersMap).map(([questionId, answer]) => ({
      questionId,
      answer,
    }));
    const data = await api.post(`/quiz/${sessionId}/submit`, { answers });
    set({ currentSession: data.session || data });
    return data;
  },

  getQuizResults: async (sessionId) => {
    const data = await api.get(`/quiz/${sessionId}/results`);
    return data;
  },

  // Exam mode
  startExam: async ({ subjectId, topicIds, difficulty, questionCount, timeLimitMin }) => {
    const data = await api.post("/exam/start", {
      subjectId,
      topicIds,
      difficulty,
      questionCount,
      timeLimitMin,
    });
    set({
      currentSession: data.session,
      questions: data.questions || [],
      currentQuestion: data.questions?.[0] || null,
      feedback: null,
    });
    return data;
  },

  getExamState: async (sessionId) => {
    const data = await api.get(`/exam/${sessionId}`);
    set({
      currentSession: data.session,
      questions: data.questions || [],
    });
    return data;
  },

  submitExamAnswer: async (sessionId, { questionId, answer, timeSpentSec }) => {
    const data = await api.post(`/exam/${sessionId}/answer`, {
      questionId,
      answer,
      timeSpentSec,
    });
    return data;
  },

  submitExam: async (sessionId, answersMap) => {
    // Convert {questionId: answer} object to [{questionId, answer}] array
    const answers = Object.entries(answersMap).map(([questionId, answer]) => ({
      questionId,
      answer,
    }));
    const data = await api.post(`/exam/${sessionId}/submit`, { answers });
    set({ currentSession: data.session || data });
    return data;
  },

  getExamResults: async (sessionId) => {
    const data = await api.get(`/exam/${sessionId}/results`);
    return data;
  },

  clearSession: () => {
    set({
      currentSession: null,
      currentQuestion: null,
      questions: [],
      feedback: null,
      hints: [],
    });
  },
}));

export default useStudyStore;
