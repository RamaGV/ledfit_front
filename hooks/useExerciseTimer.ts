import { useRef, useState, useEffect, useCallback } from "react";

type TimerOptions = {
  initialTimeMs: number;
  onTimeComplete?: () => void;
  autoStart?: boolean;
  shouldPause?: boolean;
};

/**
 * Hook personalizado para gestionar un temporizador de ejercicios
 * con capacidades de pausa, reanudación y reinicio.
 */
export function useExerciseTimer({
  initialTimeMs,
  onTimeComplete,
  autoStart = false,
  shouldPause = false,
}: TimerOptions) {
  // Estados
  const [timeRemainingMs, setTimeRemainingMs] = useState<number>(initialTimeMs);
  const [isRunning, setIsRunning] = useState<boolean>(autoStart);

  // Referencias
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const initialTimeRef = useRef<number>(initialTimeMs);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRemainingRef = useRef<number>(0);

  // Calcula el progreso (0 a 1)
  const progress =
    initialTimeRef.current > 0
      ? 1 - timeRemainingMs / initialTimeRef.current
      : 0;

  // Limpia el intervalo actual
  const clearCurrentInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Inicia el temporizador
  const startTimer = useCallback(
    (newDurationMs?: number) => {
      clearCurrentInterval();

      if (newDurationMs !== undefined) {
        initialTimeRef.current = newDurationMs;
        setTimeRemainingMs(newDurationMs);
      }

      startTimeRef.current = Date.now();
      setIsRunning(true);
    },
    [clearCurrentInterval],
  );

  // Pausa el temporizador
  const pauseTimer = useCallback(() => {
    pausedTimeRemainingRef.current = timeRemainingMs;
    setIsRunning(false);
  }, [timeRemainingMs]);

  // Reanuda el temporizador desde el tiempo pausado
  const resumeTimer = useCallback(() => {
    initialTimeRef.current = pausedTimeRemainingRef.current;
    startTimeRef.current = Date.now();
    setIsRunning(true);
  }, []);

  // Reinicia el temporizador
  const resetTimer = useCallback(
    (newDurationMs?: number, shouldStart = false) => {
      clearCurrentInterval();
      const newTime =
        newDurationMs !== undefined ? newDurationMs : initialTimeRef.current;

      initialTimeRef.current = newTime;
      setTimeRemainingMs(newTime);

      if (shouldStart) {
        startTimeRef.current = Date.now();
        setIsRunning(true);
      } else {
        setIsRunning(false);
      }
    },
    [clearCurrentInterval],
  );

  // Controla la pausa y reanudación basado en la prop shouldPause
  useEffect(() => {
    if (shouldPause && isRunning) {
      pauseTimer();
    } else if (
      !shouldPause &&
      !isRunning &&
      pausedTimeRemainingRef.current > 0
    ) {
      resumeTimer();
    }
  }, [shouldPause, isRunning, pauseTimer, resumeTimer]);

  // Efecto principal para el temporizador
  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const timeElapsed = now - startTimeRef.current;
      const newRemainingTime = initialTimeRef.current - timeElapsed;

      if (newRemainingTime <= 0) {
        setTimeRemainingMs(0);
        clearCurrentInterval();
        onTimeComplete?.();
      } else {
        setTimeRemainingMs(newRemainingTime);
      }
    }, 50);

    return clearCurrentInterval;
  }, [isRunning, onTimeComplete, clearCurrentInterval]);

  // Limpia los recursos al desmontar
  useEffect(() => {
    return clearCurrentInterval;
  }, [clearCurrentInterval]);

  return {
    timeRemainingMs,
    isRunning,
    progress,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
  };
}
