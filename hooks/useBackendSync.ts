import { useCallback, useState } from "react";
import { ToastAndroid, Alert, Platform } from "react-native";
import axiosInstance from "../api/axiosInstance";

type Etapa = "INICIO" | "ACTIVO" | "DESCANSO" | "FIN";

interface SyncOptions {
  showToasts?: boolean;
}

/**
 * Hook para manejar la sincronización con el backend
 * Proporciona funciones para sincronizar tiempo y estado de pausa
 */
export function useBackendSync(options: SyncOptions = {}) {
  const { showToasts = false } = options;
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Sincroniza la duración del ejercicio/descanso con el backend
   */
  const syncTimeWithBackend = useCallback(
    async (durationSeconds: number, etapa: Etapa | null) => {
      // No sincronizar etapas inválidas o fin
      if (durationSeconds <= 0 || !etapa || etapa === "FIN") {
        return false;
      }

      try {
        const clientTimestamp = Date.now();

        const response = await axiosInstance.post("/boards/sync-time", {
          duration: Math.round(durationSeconds),
          clientTimestamp,
          etapa,
        });
        console.log(response);

        return true;
      } catch (error: any) {
        console.log(error);
        // Manejo silencioso del error, solo devolvemos false para indicar fallo
        return false;
      }
    },
    [],
  );

  /**
   * Sincroniza el estado de pausa con el backend
   */
  const syncPauseState = useCallback(
    async (isPaused: boolean) => {
      setIsLoading(true);

      try {
        const clientTimestamp = Date.now();

        const response = await axiosInstance.post("/workout/state", {
          paused: isPaused,
          clientTimestamp,
        });
        console.log(response);
        if (showToasts && Platform.OS === "android") {
          ToastAndroid.show(
            `Entrenamiento ${isPaused ? "pausado" : "reanudado"}`,
            ToastAndroid.SHORT,
          );
        }

        setIsLoading(false);
        return true;
      } catch (error: any) {
        // Manejo de errores más detallado
        let errorMsg = error.message;

        if (error.response) {
          errorMsg =
            error.response.data?.message || `Error ${error.response.status}`;
        } else if (error.request) {
          errorMsg = "No se pudo conectar con el servidor.";
        }

        if (showToasts) {
          Alert.alert(
            "Error de sincronización",
            `No se pudo actualizar el estado. ${errorMsg}`,
          );
        }

        setIsLoading(false);
        return false;
      }
    },
    [showToasts],
  );

  return {
    syncTimeWithBackend,
    syncPauseState,
    isLoading,
  };
}
