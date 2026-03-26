"use client";

import { useState, useCallback } from "react";
import api from "@/lib/api";

export default function useAnalytics() {
  const [overview, setOverview] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [progress, setProgress] = useState([]);
  const [weakAreas, setWeakAreas] = useState([]);
  const [history, setHistory] = useState({ sessions: [], total: 0 });
  const [daily, setDaily] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchOverview = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.get("/analytics/overview");
      setOverview(data);
      return data;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchSubjects = useCallback(async () => {
    const data = await api.get("/analytics/subjects");
    setSubjects(data.subjects || data);
    return data;
  }, []);

  const fetchProgress = useCallback(async () => {
    const data = await api.get("/analytics/progress");
    setProgress(data.progress || data);
    return data;
  }, []);

  const fetchWeakAreas = useCallback(async () => {
    const data = await api.get("/analytics/weak-areas");
    setWeakAreas(data.weakAreas || data);
    return data;
  }, []);

  const fetchHistory = useCallback(async (page = 1, limit = 20) => {
    const data = await api.get(`/analytics/history?page=${page}&limit=${limit}`);
    setHistory(data);
    return data;
  }, []);

  const fetchDaily = useCallback(async () => {
    const data = await api.get("/analytics/daily");
    setDaily(data.daily || data);
    return data;
  }, []);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchOverview(),
        fetchSubjects(),
        fetchProgress(),
        fetchWeakAreas(),
        fetchDaily(),
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [fetchOverview, fetchSubjects, fetchProgress, fetchWeakAreas, fetchDaily]);

  return {
    overview,
    subjects,
    progress,
    weakAreas,
    history,
    daily,
    isLoading,
    fetchOverview,
    fetchSubjects,
    fetchProgress,
    fetchWeakAreas,
    fetchHistory,
    fetchDaily,
    fetchAll,
  };
}
