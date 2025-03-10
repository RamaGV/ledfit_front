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
const DESCANSO_ID = "67bc1a7372e1e0091651e944";

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
      const esDescansoActual = ejercicioActual.ejercicioId.toString() === DESCANSO_ID;
      
      // Si es un descanso, mostrar la pantalla de descanso con información del próximo ejercicio
      if (esDescansoActual) {
        console.log("=== DETECTADO EJERCICIO DE TIPO DESCANSO ===", { 
          id: ejercicioActual.ejercicioId.toString(), 
          DESCANSO_ID 
        });
        
        // Buscamos el próximo ejercicio real (no descanso)
        const encontrarProximoEjercicioReal = () => {
          if (!selectedEntrenamiento || !selectedEntrenamiento.ejercicios) {
            return null;
          }
          
          // Comenzamos desde el siguiente al índice actual
          let indice = indiceEjercicio + 1;
          
          // Si estamos al final, devolvemos null
          if (indice >= selectedEntrenamiento.ejercicios.length) {
            return null;
          }
          
          // Buscar hacia adelante hasta encontrar un ejercicio que no sea descanso
          while (indice < selectedEntrenamiento.ejercicios.length) {
            const ejercicio = selectedEntrenamiento.ejercicios[indice];
            // Verificar si no es un descanso
            if (ejercicio.ejercicioId.toString() !== DESCANSO_ID) {
              return {
                ejercicio: ejercicio,
                indiceReal: indice + 1 // +1 porque los índices en UI comienzan desde 1
              };
            }
            indice++;
          }
          
          return null;
        };
        
        // Obtener el próximo ejercicio real
        const proximoEjercicioInfo = encontrarProximoEjercicioReal();
        
        // Si tenemos un próximo ejercicio, usamos nuestro ProgressCircular modificado
        if (proximoEjercicioInfo && proximoEjercicioInfo.ejercicio) {
          console.log("=== USANDO PROGRESSCIRCULAR PARA DESCANSO CON PRÓXIMO EJERCICIO ===", {
            proximoEjercicio: proximoEjercicioInfo.ejercicio,
            esDescanso: true
          });
          
          const { containerWidth, containerHeight } = {
            containerWidth: 360,  // Ancho aproximado de la pantalla
            containerHeight: 500, // Altura aproximada para el componente
          };
          
          return (
            <View style={{ flex: 1, backgroundColor: isDarkMode ? '#121212' : 'white' }}>
              <ProgressCircular
                tiempoMaximo={ejercicioActual.tiempo}
                tiempoTranscurrido={ejercicioActual.tiempo - tiempoMs / 1000}
                containerWidth={containerWidth}
                containerHeight={containerHeight}
                colores={["#0CF25D", "#038C3E", "#025951", "#02735E"]}
                pausa={pausa}
                onTiempoAgotado={onTiempoAgotado}
                esDescanso={true}
                proximoEjercicio={proximoEjercicioInfo.ejercicio}
                totalEjercicios={totalEjerciciosReales}
                indiceEjercicio={proximoEjercicioInfo.indiceReal}
                imagesMap={imagesMap}
              />
            </View>
          );
        }
        
        // Si por alguna razón no hay próximo ejercicio, mostramos la versión simplificada
        const tiempo = Math.ceil(tiempoMs / 1000);
        return (
          <View style={{ flex: 1, backgroundColor: isDarkMode ? '#121212' : 'white', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ width: '100%', backgroundColor: 'red', padding: 10, alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>DESCANSO (FIN DEL ENTRENAMIENTO)</Text>
            </View>
            
            <Text style={{ fontSize: 60, fontWeight: 'bold', color: isDarkMode ? 'white' : 'black' }}>
              {tiempo}
            </Text>
            
            <Text style={{ fontSize: 24, marginTop: 10, color: isDarkMode ? '#ccc' : '#666' }}>
              Descanso
            </Text>
            
            <View style={{ 
              marginTop: 40, 
              backgroundColor: '#6842FF', 
              paddingVertical: 12,
              paddingHorizontal: 20,
              borderRadius: 24
            }}>
              <Text 
                style={{ color: 'white', fontWeight: 'bold' }}
                onPress={onTiempoAgotado}
              >
                SALTAR DESCANSO
              </Text>
            </View>
          </View>
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
      console.log("=== RENDERIZANDO DESCANSO DESDE ENTRENAR.TSX MODIFICADO ===", new Date().toISOString());
      
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
