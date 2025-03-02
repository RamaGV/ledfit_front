import React, { useState, useEffect, useCallback } from "react";
import { useUser } from "@/context/UsersContext";
import { View } from "react-native";

import { useEntrenamientos } from "@/context/EntrenamientosContext";
import { useEjercicios } from "@/context/EjerciciosContext";

import EjercicioScreen from "./screens/EjercicioScreen";
import DescansoScreen from "./screens/DescansoScreen";
import InicioScreen from "./screens/InicioScreen";
import FinScreen from "./screens/FinScreen";

type Etapa = "INICIO" | "ACTIVO" | "DESCANSO" | "FIN";

export default function Entrenamiento() {
  const { updateCaloriasQuemadas, updateTiempoEntrenado, updateEntrenamientosCompletos } = useUser();
  const { selectedEntrenamiento } = useEntrenamientos();
  const { setEjercicioActual } = useEjercicios();

  // Estados
  const [indiceEjercicio, setIndiceEjercicio] = useState<number>(0);
  const [etapaActual, setEtapaActual] = useState<Etapa>("INICIO");
  // Guardamos el tiempo en milisegundos para una transición más fluida.
  const [tiempoMs, setTiempoMs] = useState(2000); // Ejemplo: 2 segundos iniciales
  const [pausa, setPausa] = useState<boolean>(false);

  // Actualiza el ejercicio actual cuando cambia el índice
  useEffect(() => {
    if (selectedEntrenamiento && indiceEjercicio >= 0) {
      const ejercicio = selectedEntrenamiento.ejercicios[indiceEjercicio];
      setEjercicioActual(ejercicio.ejercicioId);
    }
  }, [indiceEjercicio, selectedEntrenamiento, setEjercicioActual]);

  // Función para cambiar de etapa cuando se agota el tiempo.
  // Se usa useCallback para evitar recrear la función en cada render.
  const onTiempoAgotado = useCallback(async () => {
    if (etapaActual === "INICIO") {
      const nuevoTiempo = selectedEntrenamiento!.ejercicios[indiceEjercicio].tiempo * 1000;
      setTiempoMs(nuevoTiempo);

      setEtapaActual("ACTIVO");
    } else if (etapaActual === "ACTIVO") { // Si es el último ejercicio
      if (indiceEjercicio === selectedEntrenamiento!.ejercicios.length - 1) {
        setEtapaActual("FIN");

        await updateCaloriasQuemadas(selectedEntrenamiento!.calorias);
        await updateTiempoEntrenado(selectedEntrenamiento!.tiempoTotal);
        await updateEntrenamientosCompletos();
      } else { // Si quedan ejercicios, pasamos a descanso
        const tiempoDescanso = selectedEntrenamiento!.ejercicios[indiceEjercicio].tiempo * 1000;
        setTiempoMs(tiempoDescanso);
        setIndiceEjercicio(prev => prev + 1);

        setEtapaActual("DESCANSO");
      }
    } else if (etapaActual === "DESCANSO") {
      if (indiceEjercicio < selectedEntrenamiento!.ejercicios.length - 1) {
        const nuevoTiempo = selectedEntrenamiento!.ejercicios[indiceEjercicio].tiempo * 1000;
        setTiempoMs(nuevoTiempo);
        setIndiceEjercicio(prev => prev + 1);

        setEtapaActual("ACTIVO");
      }
    }
  }, [etapaActual, indiceEjercicio, selectedEntrenamiento, updateCaloriasQuemadas, updateTiempoEntrenado, updateEntrenamientosCompletos]);

  const cambioPausa = () => {
    setPausa(prev => !prev);
  };

  // useEffect con intervalo de 50ms para una transición más detallada
  useEffect(() => {
    if (pausa) return;
    const interval = setInterval(() => {
      setTiempoMs(prev => {
        if (prev <= 50) {
          onTiempoAgotado();
          return 0;
        }
        return prev - 50;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [pausa, onTiempoAgotado]);

  return (
    <View className="flex-1 bg-[#121212]">
      {etapaActual === "INICIO" ? (
        <InicioScreen 
          etapaCompleta={onTiempoAgotado} 
          tiempoRestante={tiempoMs / 1000} // Convertido a segundos
        />
      ) : etapaActual === "ACTIVO" ? (
        <EjercicioScreen
          tiempoMaximo={selectedEntrenamiento!.ejercicios[indiceEjercicio].tiempo}
          tiempoTranscurrido={tiempoMs / 1000} // Se pasa en segundos
          pausa={pausa}
          cambioPausa={cambioPausa}
          etapaCompleta={onTiempoAgotado}
        />
      ) : etapaActual === "DESCANSO" ? (
        <DescansoScreen
          tiempoRestante={tiempoMs / 1000}
          indiceDeEjercicio={indiceEjercicio}
          etapaCompleta={onTiempoAgotado}
        />
      ) : etapaActual === "FIN" ? (
        <FinScreen />
      ) : null}
    </View>
  );
}
