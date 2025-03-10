import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useUser } from "@/context/UsersContext";
import { View, BackHandler, ToastAndroid, Alert, AppState, Text } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { router } from "expo-router";

import { useEntrenamientos } from "@/context/EntrenamientosContext";
import { useEjercicios } from "@/context/EjerciciosContext";
import { useImagesMap } from "@/context/ImagesMapContext";

import EjercicioScreen from "./screens/EjercicioScreen";
import DescansoScreen from "./screens/DescansoScreen";
import InicioScreen from "./screens/InicioScreen";
import FinScreen from "./screens/FinScreen";
import ProgressCircular from "@/components/entrenar/ProgressCircular";

type Etapa = "INICIO" | "ACTIVO" | "DESCANSO" | "FIN";

// ID del ejercicio de descanso en la base de datos
// Asegurarnos de que es exactamente igual, incluyendo espacios
const DESCANSO_ID = "67bc1a7372e1e0091651e944";

// Utility function para comparar IDs de MongoDB de forma segura
const compareMongoIds = (id1: any, id2: any): boolean => {
  // Nos aseguramos de comparar strings limpios
  const str1 = id1 ? id1.toString().trim() : "";
  const str2 = id2 ? id2.toString().trim() : "";
  const result = str1 === str2;
  console.log("=== COMPARANDO IDS ===", { id1: str1, id2: str2, result });
  return result;
};

export default function Entrenamiento() {
  const { updateMetricas, updateLogros } = useUser();
  const { selectedEntrenamiento } = useEntrenamientos();
  const { setEjercicioActual } = useEjercicios();
  const { isDarkMode } = useTheme();
  const { imagesMap } = useImagesMap();

  // Estados
  const [indiceEjercicio, setIndiceEjercicio] = useState<number>(0);
  const [etapaActual, setEtapaActual] = useState<Etapa>("INICIO");
  const [tiempoMs, setTiempoMs] = useState(2000); // 2 segundos para la pantalla de inicio
  const [pausa, setPausa] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Referencias
  const intervalRef = useRef<number | null>(null);
  const appState = useRef(AppState.currentState);

  // Preprocesamos los ejercicios para separar ejercicios reales de descansos
  const { 
    ejerciciosReales, 
    indiceReal,
    totalEjerciciosReales,
    siguienteEsDescanso,
    siguienteIndiceReal
  } = useMemo(() => {
    if (!selectedEntrenamiento) {
      return { 
        ejerciciosReales: [], 
        indiceReal: 0,
        totalEjerciciosReales: 0,
        siguienteEsDescanso: false,
        siguienteIndiceReal: 0
      };
    }

    // Filtrar solo los ejercicios reales (no descansos)
    const reales = selectedEntrenamiento.ejercicios.filter(
      ejercicio => ejercicio.ejercicioId.toString() !== DESCANSO_ID
    );

    // Determinar el índice real (contando solo ejercicios, no descansos)
    let realIndex = 0;
    let nextRealIndex = 0;
    let isNextRestPeriod = false;

    // Contar cuántos ejercicios reales han pasado hasta el índice actual
    for (let i = 0; i < indiceEjercicio; i++) {
      if (selectedEntrenamiento.ejercicios[i].ejercicioId.toString() !== DESCANSO_ID) {
        realIndex++;
      }
    }

    // Verificar si el siguiente es un descanso
    if (indiceEjercicio + 1 < selectedEntrenamiento.ejercicios.length) {
      isNextRestPeriod = 
        selectedEntrenamiento.ejercicios[indiceEjercicio + 1].ejercicioId.toString() === DESCANSO_ID;
      
      // Calcular el siguiente índice real
      nextRealIndex = realIndex;
      if (!isNextRestPeriod && 
          selectedEntrenamiento.ejercicios[indiceEjercicio].ejercicioId.toString() !== DESCANSO_ID) {
        nextRealIndex = realIndex + 1;
      } else if (selectedEntrenamiento.ejercicios[indiceEjercicio].ejercicioId.toString() === DESCANSO_ID) {
        nextRealIndex = realIndex + 1;
      }
    }

    return { 
      ejerciciosReales: reales, 
      indiceReal: realIndex,
      totalEjerciciosReales: reales.length,
      siguienteEsDescanso: isNextRestPeriod,
      siguienteIndiceReal: nextRealIndex
    };
  }, [selectedEntrenamiento, indiceEjercicio]);

  // Verificar si el ejercicio actual es un descanso
  const esDescanso = useMemo(() => {
    if (!selectedEntrenamiento || indiceEjercicio >= selectedEntrenamiento.ejercicios.length) {
      return false;
    }
    return selectedEntrenamiento.ejercicios[indiceEjercicio].ejercicioId.toString() === DESCANSO_ID;
  }, [selectedEntrenamiento, indiceEjercicio]);

  // Definimos colores basados en el tema
  const backgroundColor = isDarkMode ? "#121212" : "#FFFFFF";

  // Verificamos que tengamos un entrenamiento seleccionado
  useEffect(() => {
    if (!selectedEntrenamiento) {
      setError("No se ha seleccionado un entrenamiento");
      Alert.alert(
        "Error",
        "No se ha seleccionado un entrenamiento. Por favor, vuelve atrás y selecciona uno.",
        [{ text: "Volver", onPress: () => router.back() }]
      );
    }
  }, [selectedEntrenamiento]);

  // Manejo del botón de retroceso
  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        "¿Salir del entrenamiento?",
        "Si sales ahora, perderás el progreso de este entrenamiento.",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Salir", style: "destructive", onPress: () => router.back() }
        ]
      );
      return true; // Evita que el comportamiento por defecto se ejecute
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, []);

  // Manejo del cambio de estado de la app (background/foreground)
  useEffect(() => {
    const handleAppStateChange = (nextAppState: any) => {
      if (appState.current.match(/active/) && nextAppState.match(/inactive|background/)) {
        // App va a background
        if (!pausa && etapaActual !== "INICIO" && etapaActual !== "FIN") {
          setPausa(true);
          ToastAndroid.show("Entrenamiento pausado", ToastAndroid.SHORT);
        }
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener("change", handleAppStateChange);
    return () => subscription.remove();
  }, [pausa, etapaActual]);

  // Actualiza el ejercicio actual cuando cambia el índice
  useEffect(() => {
    if (selectedEntrenamiento && indiceEjercicio >= 0 && !esDescanso) {
      try {
        const ejercicio = selectedEntrenamiento.ejercicios[indiceEjercicio];
        setEjercicioActual(ejercicio.ejercicioId);
      } catch (err) {
        console.error("Error al actualizar ejercicio actual:", err);
        setError("Error al cargar el ejercicio");
      }
    }
  }, [indiceEjercicio, selectedEntrenamiento, setEjercicioActual, esDescanso]);

  // Función para ir al siguiente ejercicio (manejando descansos automáticamente)
  const avanzarEjercicio = useCallback(() => {
    if (!selectedEntrenamiento) return;
    
    // Si quedan más ejercicios
    if (indiceEjercicio < selectedEntrenamiento.ejercicios.length - 1) {
      const nextIndex = indiceEjercicio + 1;
      const nextEjercicio = selectedEntrenamiento.ejercicios[nextIndex];
      
      // Si el siguiente ejercicio es un descanso, lo manejamos automáticamente
      if (nextEjercicio.ejercicioId.toString() === DESCANSO_ID) {
        setIndiceEjercicio(nextIndex); // Avanzar al descanso
        setEtapaActual("DESCANSO");
        setTiempoMs(nextEjercicio.tiempo * 1000);
      } else {
        // Si es un ejercicio normal
        setIndiceEjercicio(nextIndex);
        setEtapaActual("ACTIVO");
        setTiempoMs(nextEjercicio.tiempo * 1000);
      }
    } else {
      // Si ya no hay más ejercicios, terminar entrenamiento
      setEtapaActual("FIN");
    }
  }, [selectedEntrenamiento, indiceEjercicio]);

  // Función para cambiar de etapa cuando se agota el tiempo.
  const onTiempoAgotado = useCallback(async () => {
    try {
      if (!selectedEntrenamiento) return;

      if (etapaActual === "INICIO") {
        // Si el primer ejercicio es un descanso (raramente ocurriría), manejarlo
        if (selectedEntrenamiento.ejercicios[0].ejercicioId.toString() === DESCANSO_ID) {
          setEtapaActual("DESCANSO");
        } else {
          setEtapaActual("ACTIVO");
        }
        
        const nuevoTiempo = selectedEntrenamiento.ejercicios[0].tiempo * 1000;
        setTiempoMs(nuevoTiempo);
      } 
      else if (etapaActual === "ACTIVO") {
        const ejercicioActual = selectedEntrenamiento.ejercicios[indiceEjercicio];
        
        // Verificar si el ejercicio actual es un descanso por su ID
        console.log("=== VERIFICANDO SI ES DESCANSO ===", {
          id: ejercicioActual.ejercicioId,
          idToString: ejercicioActual.ejercicioId.toString(),
          DESCANSO_ID: DESCANSO_ID,
          ejercicioActual: JSON.stringify(ejercicioActual)
        });
        
        // En MongoDB los ObjectId deben compararse como strings, usando nuestra función segura
        const esDescansoActual = compareMongoIds(ejercicioActual.ejercicioId, DESCANSO_ID);
        
        console.log("=== RESULTADO COMPARACIÓN ===", {
          esDescansoActual,
          // Intentamos obtener el nombre para debug
          nombre: typeof ejercicioActual.ejercicioId === 'object' && ejercicioActual.ejercicioId.nombre 
            ? ejercicioActual.ejercicioId.nombre 
            : "Sin nombre disponible"
        });
        
        if (esDescansoActual) {
          setEtapaActual("DESCANSO");
        } else {
          // Verificar si es el último ejercicio
          if (indiceEjercicio === selectedEntrenamiento.ejercicios.length - 1) {
            setEtapaActual("FIN");

            // Actualizar métricas y logros
            try {
              await updateMetricas(
                selectedEntrenamiento.tiempoTotal,
                selectedEntrenamiento.calorias,
              );
              await updateLogros();
            } catch (err) {
              console.error("Error al actualizar métricas:", err);
              ToastAndroid.show("Error al guardar progreso", ToastAndroid.SHORT);
            }
          } else {
            // Avanzar al siguiente ejercicio o descanso
            avanzarEjercicio();
          }
        }
      } 
      else if (etapaActual === "DESCANSO") {
        // Al terminar el descanso, avanzar al siguiente ejercicio
        avanzarEjercicio();
      }
    } catch (err) {
      console.error("Error en cambio de etapa:", err);
      setError("Error al cambiar de ejercicio");
    }
  }, [etapaActual, indiceEjercicio, selectedEntrenamiento, updateMetricas, updateLogros, avanzarEjercicio]);

  // Función para cambiar el estado de pausa
  const cambioPausa = useCallback(() => {
    setPausa((prev) => !prev);
  }, []);

  // Efecto para gestionar el temporizador
  useEffect(() => {
    // Limpia el intervalo anterior si existe
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Si está en pausa o hay error, no hacer nada
    if (pausa || error) return;

    // Crear nuevo intervalo
    intervalRef.current = setInterval(() => {
      setTiempoMs((prev) => {
        if (prev <= 100) { // 100ms para mejorar la precisión
          if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          onTiempoAgotado();
          return 0;
        }
        return prev - 100; // Actualizar cada 100ms para mejor rendimiento
      });
    }, 100) as unknown as number;

    // Limpiar intervalo al desmontar
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [pausa, error, onTiempoAgotado]);

  // Si hay error, el usuario será redirigido con el Alert
  if (error || !selectedEntrenamiento) {
    return <View style={{ flex: 1, backgroundColor }} />;
  }

  // Determinar qué pantalla mostrar
  const renderPantalla = () => {
    if (etapaActual === "INICIO") {
      return (
        <InicioScreen
          etapaCompleta={onTiempoAgotado}
          tiempoRestante={tiempoMs / 1000} // Convertido a segundos
        />
      );
    }
    
    if (etapaActual === "ACTIVO") {
      const ejercicioActual = selectedEntrenamiento.ejercicios[indiceEjercicio];
      
      // Verificar si el ejercicio actual es un descanso por su ID
      console.log("=== VERIFICANDO SI ES DESCANSO ===", {
        id: ejercicioActual.ejercicioId,
        idToString: ejercicioActual.ejercicioId.toString(),
        DESCANSO_ID: DESCANSO_ID,
        ejercicioActual: JSON.stringify(ejercicioActual)
      });
      
      // En MongoDB los ObjectId deben compararse como strings, usando nuestra función segura
      const esDescansoActual = compareMongoIds(ejercicioActual.ejercicioId, DESCANSO_ID);
      
      console.log("=== RESULTADO COMPARACIÓN ===", {
        esDescansoActual,
        // Intentamos obtener el nombre para debug
        nombre: typeof ejercicioActual.ejercicioId === 'object' && ejercicioActual.ejercicioId.nombre 
          ? ejercicioActual.ejercicioId.nombre 
          : "Sin nombre disponible"
      });
      
      // Si es un descanso, mostrar la pantalla de descanso con información del próximo ejercicio
      if (esDescansoActual) {
        console.log("=== DETECTADO EJERCICIO DE TIPO DESCANSO ===", { 
          id: ejercicioActual.ejercicioId.toString(), 
          DESCANSO_ID 
        });
        
        // Buscamos el próximo ejercicio real (no descanso)
        const encontrarProximoEjercicioReal = () => {
          if (!selectedEntrenamiento || !selectedEntrenamiento.ejercicios) {
            console.log("No hay entrenamiento seleccionado o no tiene ejercicios");
            return null;
          }
          
          // Comenzamos desde el siguiente al índice actual
          let indice = indiceEjercicio + 1;
          
          // Si estamos al final, devolvemos null
          if (indice >= selectedEntrenamiento.ejercicios.length) {
            console.log("Estamos en el último ejercicio, no hay próximo");
            return null;
          }
          
          // Buscar hacia adelante hasta encontrar un ejercicio que no sea descanso
          while (indice < selectedEntrenamiento.ejercicios.length) {
            const ejercicio = selectedEntrenamiento.ejercicios[indice];
            console.log(`Analizando ejercicio índice ${indice}:`, ejercicio);
            
            // Verificar si no es un descanso
            const esDescanso = compareMongoIds(ejercicio.ejercicioId, DESCANSO_ID);
            if (!esDescanso) {
              console.log(`Encontrado próximo ejercicio en índice ${indice}`);
              return {
                ejercicio: ejercicio,
                indiceReal: indice + 1 // +1 porque los índices en UI comienzan desde 1
              };
            }
            indice++;
          }
          
          console.log("No se encontró ningún ejercicio no-descanso hacia adelante");
          
          // Si no encontramos, volver al primero que no sea descanso
          for (let i = 0; i < selectedEntrenamiento.ejercicios.length; i++) {
            const ejercicio = selectedEntrenamiento.ejercicios[i];
            const esDescanso = compareMongoIds(ejercicio.ejercicioId, DESCANSO_ID);
            if (!esDescanso) {
              console.log(`Encontrado primer ejercicio no-descanso en índice ${i}`);
              return {
                ejercicio: ejercicio,
                indiceReal: i + 1
              };
            }
          }
          
          console.log("No se encontró ningún ejercicio no-descanso en todo el entrenamiento");
          return null;
        };
        
        // Obtener el próximo ejercicio real
        const proximoEjercicioInfo = encontrarProximoEjercicioReal();
        
        console.log("=== USANDO DESCANSOSCREEN CON PRÓXIMO EJERCICIO ===", {
          proximoEjercicio: proximoEjercicioInfo?.ejercicio,
          tiempoDescanso: tiempoMs / 1000
        });
        
        return (
          <DescansoScreen
            tiempoRestante={tiempoMs / 1000}
            indiceDeEjercicio={proximoEjercicioInfo?.indiceReal || 0}
            totalEjercicios={totalEjerciciosReales}
            etapaCompleta={onTiempoAgotado}
            proximoEjercicio={proximoEjercicioInfo?.ejercicio || null}
            imagesMap={imagesMap}
          />
        );
      }
      
      // Si no es un descanso, mostrar la pantalla de ejercicio normal
      return (
        <EjercicioScreen
          tiempoMaximo={ejercicioActual.tiempo}
          tiempoTranscurrido={ejercicioActual.tiempo - tiempoMs / 1000}
          pausa={pausa}
          cambioPausa={cambioPausa}
          etapaCompleta={onTiempoAgotado}
          numeroEjercicio={indiceReal + 1}
          totalEjercicios={totalEjerciciosReales}
        />
      );
    }
    
    if (etapaActual === "DESCANSO") {
      console.log("=== RENDERIZANDO DESCANSO DESDE ENTRENAR.TSX (ETAPA DESCANSO) ===", new Date().toISOString());
      
      // IMPORTANTE: Este bloque no parece ejecutarse nunca según los logs
      // porque los descansos se manejan como ejercicios normales pero con ID especial
      // Por eso hemos movido la lógica al bloque de ACTIVO arriba
      
      return (
        <DescansoScreen
          tiempoRestante={tiempoMs / 1000}
          indiceDeEjercicio={siguienteIndiceReal + 1}
          totalEjercicios={totalEjerciciosReales}
          etapaCompleta={onTiempoAgotado}
        />
      );
    }
    
    if (etapaActual === "FIN") {
      return <FinScreen />;
    }
    
    return null;
  };

  return (
    <View style={{ flex: 1, backgroundColor }}>
      {renderPantalla()}
    </View>
  );
}
