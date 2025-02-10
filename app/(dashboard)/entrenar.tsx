// app/(entrenar)/index.tsx
import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { useEntrenamientos } from "@/context/EntrenamientosContext";
import { useEjercicios } from "@/context/EjerciciosContext";

import { useTimer } from "@/utils/utilsEntrenamientos";

import EjercicioScreen from "../(entrenar)/screens/EjercicioScreen";
import InicioScreen from "../(entrenar)/screens/InicioScreen";
import FinScreen from "../(entrenar)/screens/FinScreen";
import DescansoScreen from "../(entrenar)/screens/DescansoScreen";

type Etapa = "INICIO" | "ACTIVO" | "DESCANSO" | "FIN";

export default function Entrenamiento() {
  const { selectedEntrenamiento } = useEntrenamientos();
  const { setEjercicioActual } = useEjercicios();

  // Estados
  const [indiceEjercicio, setIndiceEjercicio] = useState<number>(-1);
  const [etapaActual, setEtapaActual] = useState<Etapa>("INICIO");
  const [pausa, setPausa] = useState<boolean>(false);
  const [tiempo, setTiempo] = useState<number>(10);

  // Cuando cambia el índice, actualizamos el ejercicio actual y el tiempo
  useEffect(() => {
    if (selectedEntrenamiento && indiceEjercicio >= 0) {
      const ejercicio = selectedEntrenamiento.ejercicios[indiceEjercicio];
      setEjercicioActual(ejercicio);
      setTiempo(ejercicio.tiempo);
      resetTimer();
    }
  }, [indiceEjercicio]);

  const onTiempoAgotado = () => {
    if (etapaActual === "INICIO") {
      setIndiceEjercicio(0);
      setEtapaActual("ACTIVO");
    } else if (etapaActual === "ACTIVO") {
      if (indiceEjercicio === selectedEntrenamiento!.ejercicios.length - 1) {
        setEtapaActual("FIN");
      } else {
        setEtapaActual("DESCANSO");
        setTiempo(10);
      }
    } else if (etapaActual === "DESCANSO") {
      if (indiceEjercicio < selectedEntrenamiento!.ejercicios.length - 1) {
        const sigIndice = indiceEjercicio + 1;
        setIndiceEjercicio(sigIndice);
        setEtapaActual("ACTIVO");
      }
    }
  };

  const { tiempoTranscurrido, resetTimer } = useTimer(
    tiempo,
    pausa,
    onTiempoAgotado,
  );

  return (
    <View className="flex-1 bg-[#121212]">
      {etapaActual === "INICIO" ? (
        <InicioScreen
          tiempoRestante={tiempo - tiempoTranscurrido}
          onReset={resetTimer}
        />
      ) : etapaActual === "ACTIVO" ? (
        <EjercicioScreen
          tiempoTranscurrido={tiempoTranscurrido}
          onPause={() => setPausa((prev) => !prev)}
        />
      ) : etapaActual === "DESCANSO" ? (
        <DescansoScreen
          tiempoTranscurrido={tiempoTranscurrido}
          indiceDeEjercicio={indiceEjercicio}
        />
      ) : etapaActual === "FIN" ? (
        <FinScreen />
      ) : null}
    </View>
  );
}
