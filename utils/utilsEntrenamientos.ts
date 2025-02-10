// utilsEntrenamientos.ts

import { useState, useRef, useEffect } from "react";

/** */
export function useTimer(
  tiempoTotal: number,
  pausa: boolean,
  tiempoAgotado: () => void,
) {
  const [tiempoTranscurrido, setTiempoTranscurrido] = useState<number>(0);

  // timerRef almacena el ID del intervalo para poder cancelarlo cuando sea necesario
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Si está pausado o si no hay totalTime, no iniciamos el temporizador
    if (pausa || tiempoTotal <= 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    // Iniciar el temporizador
    timerRef.current = setInterval(() => {
      setTiempoTranscurrido((prev) => {
        if (prev + 1 >= tiempoTotal) {
          clearInterval(timerRef.current!);
          tiempoAgotado();
          return tiempoTotal;
        }
        return prev + 1;
      });
    }, 100); // 1 segundo

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [pausa, tiempoTotal, tiempoAgotado]);

  // Función para reiniciar el temporizador (por ejemplo, al cambiar de ejercicio)
  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTiempoTranscurrido(0);
  };

  return { tiempoTranscurrido, resetTimer, timerRef };
}

export function calcularTiempo(tiempoTotal: number) {
  const m = Math.floor(tiempoTotal / 60);
  const s = tiempoTotal % 60;
  return `${m}:${s < 10 ? `0${s}` : s}`;
}
