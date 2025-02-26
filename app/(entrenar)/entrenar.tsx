// app/(entrenar)/entrenar.tsx
import { useEntrenamientos } from "@/context/EntrenamientosContext";
import { useEjercicios } from "@/context/EjerciciosContext";
import { useUser } from "@/context/UsersContext";
import React, { useState, useEffect } from "react";
import { View } from "react-native";

import EjercicioScreen from "./screens/EjercicioScreen";
import DescansoScreen from "./screens/DescansoScreen";
import InicioScreen from "./screens/InicioScreen";
import FinScreen from "./screens/FinScreen";

type Etapa = "INICIO" | "ACTIVO" | "DESCANSO" | "FIN";

export default function Entrenamiento() {
  const { selectedEntrenamiento } = useEntrenamientos();
  const { setEjercicioActual } = useEjercicios();
  const { updateCaloriasQuemadas } = useUser();

  // Estados
  const [indiceEjercicio, setIndiceEjercicio] = useState<number>(0);
  const [etapaActual, setEtapaActual] = useState<Etapa>("INICIO");

  // Cuando cambia el índice, actualizamos el ejercicio actual
  useEffect(() => {
    if (selectedEntrenamiento && indiceEjercicio >= 0) {
      const ejercicio = selectedEntrenamiento.ejercicios[indiceEjercicio];
      setEjercicioActual(ejercicio.ejercicioId);
    }
  }, [indiceEjercicio, selectedEntrenamiento, setEjercicioActual]);

  // Al finalizar el entrenamiento, se calcula el total de calorías quemadas y se actualiza el usuario.
  const onTiempoAgotado = async () => {
    if (etapaActual === "INICIO") {
      setEtapaActual("ACTIVO");
    } else if (etapaActual === "ACTIVO") {
      // Si es el último ejercicio
      if (indiceEjercicio === selectedEntrenamiento!.ejercicios.length - 1) {
        await updateCaloriasQuemadas(selectedEntrenamiento!.calorias);
        setEtapaActual("FIN");
      } else {
        // Si aun hay ejercicios, avanzamos y pasamos a la etapa de descanso
        const sigIndice = indiceEjercicio + 1;
        setIndiceEjercicio(sigIndice);
        console.log("Descanso");
        setEtapaActual("DESCANSO");
      }
    } else if (etapaActual === "DESCANSO") {
      if (indiceEjercicio < selectedEntrenamiento!.ejercicios.length - 1) {
        const sigIndice = indiceEjercicio + 1;
        setIndiceEjercicio(sigIndice);
        setEtapaActual("ACTIVO");
      }
    }
  };

  return (
    <View className="flex-1 bg-[#121212]">
      {etapaActual === "INICIO" ? (
        <InicioScreen etapaCompleta={onTiempoAgotado} />
      ) : etapaActual === "ACTIVO" ? (
        <EjercicioScreen 
          tiempo={selectedEntrenamiento!.ejercicios[indiceEjercicio].tiempo} 
          etapaCompleta={onTiempoAgotado} 
        />
      ) : etapaActual === "DESCANSO" ? (
        <DescansoScreen
          tiempo={selectedEntrenamiento!.ejercicios[indiceEjercicio].tiempo} 
          indiceDeEjercicio={indiceEjercicio}
          etapaCompleta={onTiempoAgotado}
        />
      ) : etapaActual === "FIN" ? (
        <FinScreen />
      ) : null}
    </View>
  );
}
