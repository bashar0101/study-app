"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export default function useTimer({ initialSeconds = 0, countDown = false, autoStart = false, onExpire } = {}) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);
  const intervalRef = useRef(null);
  const onExpireRef = useRef(onExpire);

  onExpireRef.current = onExpire;

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (countDown) {
          const next = prev - 1;
          if (next <= 0) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            onExpireRef.current?.();
            return 0;
          }
          return next;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isRunning, countDown]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback((newSeconds) => {
    setSeconds(newSeconds ?? initialSeconds);
    setIsRunning(false);
  }, [initialSeconds]);

  return { seconds, isRunning, start, pause, reset };
}
