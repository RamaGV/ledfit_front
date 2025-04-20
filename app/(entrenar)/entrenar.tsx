import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { View, BackHandler, Alert, AppState } from "react-native";
import { router } from "expo-router";
import { useEntrenamientos } from "../../context/EntrenamientosContext";
import { useEjercicios } from "../../context/EjerciciosContext";
import { useTheme } from "../../context/ThemeContext";

// Hooks personalizados
import { useExerciseTimer } from "../../hooks/useExerciseTimer";
import { useBackendSync } from "../../hooks/useBackendSync";

// Utilidades
import {
  Etapa,
  isRestExercise,
  calculateRealExercises,
} from "../../utils/exerciseUtils";

// Componentes
import ExerciseStageManager from "../../components/entrenar/ExerciseStageManager";

/**
 * Pantalla principal de entrenamiento
 * Gestiona el flujo entre las diferentes etapas (inicio, ejercicio, descanso, fin)
 */
export default function Entrenamiento() {
  const { selectedEntrenamiento } = useEntrenamientos();
  const { setEjercicioActual } = useEjercicios();
  const { isDarkMode } = useTheme();

  // Estados básicos
  const [indiceEjercicio, setIndiceEjercicio] = useState<number>(0);
  const [etapaActual, setEtapaActual] = useState<Etapa>("INICIO");
  const [pausa, setPausa] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [layoutSize, setLayoutSize] = useState({ width: 0, height: 0 });

  // Referencias
  const appState = useRef(AppState.currentState);
  const inicioTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Hooks personalizados
  const {
    syncTimeWithBackend,
    syncPauseState,
    isLoading: isLoadingApi,
  } = useBackendSync({ showToasts: true });

  // Detectar dimensiones del layout
  const onLayout = useCallback(
    (event: any) => {
      const { width, height } = event.nativeEvent.layout;
      if (width !== layoutSize.width || height !== layoutSize.height) {
        setLayoutSize({ width, height });
      }
    },
    [layoutSize],
  );

  // Calcular información de ejercicios reales (no descansos)
  const { indiceReal, totalEjerciciosReales, siguienteIndiceReal } = useMemo(
    () => calculateRealExercises(selectedEntrenamiento, indiceEjercicio),
    [selectedEntrenamiento, indiceEjercicio],
  );

  // Verificar si el ejercicio actual es un descanso
  const esDescanso = useMemo(() => {
    if (
      !selectedEntrenamiento ||
      indiceEjercicio >= selectedEntrenamiento.ejercicios.length
    ) {
      return false;
    }
    return isRestExercise(selectedEntrenamiento.ejercicios[indiceEjercicio]);
  }, [selectedEntrenamiento, indiceEjercicio]);

  // Obtener la duración del ejercicio actual
  const tiempoMaximoActual = useMemo(() => {
    if (
      !selectedEntrenamiento ||
      indiceEjercicio >= selectedEntrenamiento.ejercicios.length
    ) {
      return 0;
    }
    return selectedEntrenamiento.ejercicios[indiceEjercicio].tiempo || 0;
  }, [selectedEntrenamiento, indiceEjercicio]);

  // Temporizador de ejercicio con el hook personalizado
  const { timeRemainingMs: tiempoMs, resetTimer } = useExerciseTimer({
    initialTimeMs: 5000, // Tiempo inicial por defecto (para la cuenta atrás de inicio)
    onTimeComplete: handleTiempoAgotado,
    shouldPause: pausa,
  });

  // --- Finalizar la etapa de INICIO ---
  const finalizarInicio = useCallback(() => {
    if (!selectedEntrenamiento) return;

    // Configurar primera etapa real
    const primerEjercicio = selectedEntrenamiento.ejercicios[0];
    const nextDurationSeconds = primerEjercicio.tiempo;
    const nextTiempoMs = nextDurationSeconds * 1000;
    const nextEtapa: Etapa = isRestExercise(primerEjercicio)
      ? "DESCANSO"
      : "ACTIVO";

    // Sincronizar con backend
    syncTimeWithBackend(nextDurationSeconds, nextEtapa);

    // Actualizar estado para la primera etapa real
    resetTimer(nextTiempoMs, true);
    setEtapaActual(nextEtapa);
    setEjercicioActual(primerEjercicio.ejercicioId);
  }, [
    selectedEntrenamiento,
    setEjercicioActual,
    syncTimeWithBackend,
    resetTimer,
  ]);

  // --- Iniciar entrenamiento ---
  const handleIniciarEntrenamiento = useCallback(() => {
    if (!selectedEntrenamiento) return;

    // Limpiar timeout anterior si existe
    if (inicioTimeoutRef.current) {
      clearTimeout(inicioTimeoutRef.current);
    }

    const inicioDurationSeconds = 5;
    const inicioTiempoMs = 5000;

    // Sincronizar con backend
    syncTimeWithBackend(inicioDurationSeconds, "INICIO");

    setEtapaActual("INICIO");
    resetTimer(inicioTiempoMs, true);
    setPausa(false);

    // Programar la finalización de la etapa INICIO
    inicioTimeoutRef.current = setTimeout(finalizarInicio, inicioTiempoMs);
  }, [selectedEntrenamiento, syncTimeWithBackend, finalizarInicio, resetTimer]);

  // --- Manejar cuando se agota el tiempo ---
  function handleTiempoAgotado() {
    try {
      if (
        !selectedEntrenamiento ||
        (etapaActual !== "ACTIVO" && etapaActual !== "DESCANSO")
      ) {
        return;
      }

      const proximoIndice = indiceEjercicio + 1;

      // Si quedan más ejercicios
      if (proximoIndice < selectedEntrenamiento.ejercicios.length) {
        const proximoEjercicioData =
          selectedEntrenamiento.ejercicios[proximoIndice];
        const nextDurationSeconds = proximoEjercicioData.tiempo;
        const nextTiempoMs = nextDurationSeconds * 1000;
        const nextEtapa: Etapa = isRestExercise(proximoEjercicioData)
          ? "DESCANSO"
          : "ACTIVO";

        // Actualizar índice y tiempo
        setIndiceEjercicio(proximoIndice);
        resetTimer(nextTiempoMs, true);
        setEtapaActual(nextEtapa);

        // Si es un ejercicio (no descanso), actualizar el ejercicio actual
        if (nextEtapa === "ACTIVO") {
          setEjercicioActual(proximoEjercicioData.ejercicioId);
        }

        // Sincronizar con backend
        syncTimeWithBackend(nextDurationSeconds, nextEtapa);
      } else {
        // Finalizar entrenamiento
        setEtapaActual("FIN");
      }
    } catch (err) {
      console.log(err);
      setError("Error al cambiar de ejercicio");
    }
  }

  // --- Manejar toggle de pausa ---
  const togglePausa = useCallback(async () => {
    const nuevoEstadoPausa = !pausa;

    // Limpiar timeout de inicio si pausamos durante INICIO
    if (
      nuevoEstadoPausa &&
      etapaActual === "INICIO" &&
      inicioTimeoutRef.current
    ) {
      clearTimeout(inicioTimeoutRef.current);
      inicioTimeoutRef.current = null;
    }

    // Actualizar el estado de pausa local
    setPausa(nuevoEstadoPausa);

    // Sincronizar con backend
    await syncPauseState(nuevoEstadoPausa);
  }, [pausa, etapaActual, syncPauseState]);

  // Verificar entrenamiento seleccionado al cargar
  useEffect(() => {
    if (!selectedEntrenamiento) {
      setError("No se ha seleccionado un entrenamiento");
      Alert.alert(
        "Error",
        "No se ha seleccionado un entrenamiento. Por favor, vuelve atrás y selecciona uno.",
        [{ text: "Volver", onPress: () => router.back() }],
      );
    }
  }, [selectedEntrenamiento]);

  // Gestionar botón de retroceso
  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        "¿Salir del entrenamiento?",
        "Si sales ahora, perderás el progreso de este entrenamiento.",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Salir", style: "destructive", onPress: () => router.back() },
        ],
      );
      return true; // Evita comportamiento por defecto
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  // Gestionar cambio de estado de la app (background/foreground)
  useEffect(() => {
    const handleAppStateChange = (nextAppState: any) => {
      if (
        appState.current.match(/active/) &&
        nextAppState.match(/inactive|background/)
      ) {
        // App va a background - pausar automáticamente
        if (!pausa && etapaActual !== "INICIO" && etapaActual !== "FIN") {
          setPausa(true);
        }
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );
    return () => subscription.remove();
  }, [pausa, etapaActual]);

  // Actualizar ejercicio actual cuando cambia el índice
  useEffect(() => {
    if (selectedEntrenamiento && indiceEjercicio >= 0 && !esDescanso) {
      try {
        const ejercicio = selectedEntrenamiento.ejercicios[indiceEjercicio];
        setEjercicioActual(ejercicio.ejercicioId);
      } catch (err) {
        console.log(err);
        setError("Error al cargar el ejercicio");
      }
    }
  }, [indiceEjercicio, selectedEntrenamiento, setEjercicioActual, esDescanso]);

  // Limpieza de recursos al desmontar
  useEffect(() => {
    return () => {
      if (inicioTimeoutRef.current) {
        clearTimeout(inicioTimeoutRef.current);
      }
    };
  }, []);

  // Si hay error o no hay entrenamiento, mostrar pantalla vacía
  if (error || !selectedEntrenamiento) {
    return (
      <View
        style={{ flex: 1, backgroundColor: isDarkMode ? "#121212" : "#FFFFFF" }}
      />
    );
  }

  // Renderizar la etapa actual
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDarkMode ? "#121212" : "#FFFFFF",
      }}
      onLayout={onLayout}
    >
      <ExerciseStageManager
        etapaActual={etapaActual}
        selectedEntrenamiento={selectedEntrenamiento}
        indiceEjercicio={indiceEjercicio}
        indiceReal={indiceReal}
        totalEjerciciosReales={totalEjerciciosReales}
        siguienteIndiceReal={siguienteIndiceReal}
        tiempoMs={tiempoMs}
        tiempoMaximoActual={tiempoMaximoActual}
        pausa={pausa}
        layoutSize={layoutSize}
        isLoadingApi={isLoadingApi}
        onIniciarEntrenamiento={handleIniciarEntrenamiento}
        onTiempoAgotado={handleTiempoAgotado}
        onTogglePausa={togglePausa}
        onVolver={() => router.replace("/entrenar")}
      />
    </View>
  );
}
