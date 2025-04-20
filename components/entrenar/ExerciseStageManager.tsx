import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";

import { Etapa } from "../../utils/exerciseUtils";
import EjercicioScreen from "../../app/(entrenar)/screens/EjercicioScreen";
import DescansoScreen from "../../app/(entrenar)/screens/DescansoScreen";
import InicioScreen from "../../app/(entrenar)/screens/InicioScreen";
import FinScreen from "../../app/(entrenar)/screens/FinScreen";
import ProgressCircular from "./ProgressCircular";
import PauseButton from "./PauseButton";
import { isRestExercise } from "../../utils/exerciseUtils";

interface ExerciseStageManagerProps {
  etapaActual: Etapa;
  selectedEntrenamiento: any;
  indiceEjercicio: number;
  indiceReal: number;
  totalEjerciciosReales: number;
  siguienteIndiceReal: number;
  tiempoMs: number;
  tiempoMaximoActual: number;
  pausa: boolean;
  layoutSize: { width: number; height: number };
  isLoadingApi: boolean;
  onIniciarEntrenamiento: () => void;
  onTiempoAgotado: () => void;
  onTogglePausa: () => void;
  onVolver: () => void;
}

/**
 * Componente que gestiona las diferentes etapas de un entrenamiento
 * (inicio, ejercicio activo, descanso, fin)
 */
export default function ExerciseStageManager({
  etapaActual,
  selectedEntrenamiento,
  indiceEjercicio,
  indiceReal,
  totalEjerciciosReales,
  siguienteIndiceReal,
  tiempoMs,
  tiempoMaximoActual,
  pausa,
  layoutSize,
  isLoadingApi,
  onIniciarEntrenamiento,
  onTiempoAgotado,
  onTogglePausa,
  onVolver,
}: ExerciseStageManagerProps) {
  // Obtenemos los datos del ejercicio actual y el próximo
  const ejercicioActualData = useMemo(
    () => selectedEntrenamiento?.ejercicios[indiceEjercicio],
    [selectedEntrenamiento, indiceEjercicio],
  );

  const proximoEjercicioData = useMemo(
    () =>
      indiceEjercicio + 1 < selectedEntrenamiento?.ejercicios.length
        ? selectedEntrenamiento.ejercicios[indiceEjercicio + 1]
        : null,
    [selectedEntrenamiento, indiceEjercicio],
  );

  const tiempoTotal = useMemo(
    () =>
      selectedEntrenamiento?.ejercicios.reduce(
        (acc: number, curr: any) => acc + curr.tiempo,
        0,
      ) || 0,
    [selectedEntrenamiento],
  );

  const caloriasTotales = useMemo(
    () =>
      selectedEntrenamiento?.ejercicios.reduce((acc: number, curr: any) => {
        if (!isRestExercise(curr)) {
          const cals = curr.ejercicioId.caloriasPorSegundo
            ? Math.round(curr.tiempo * curr.ejercicioId.caloriasPorSegundo)
            : Math.round(curr.tiempo * 0.15);
          return acc + cals;
        }
        return acc;
      }, 0) || 0,
    [selectedEntrenamiento],
  );

  switch (etapaActual) {
    case "INICIO":
      return (
        <InicioScreen
          onIniciar={onIniciarEntrenamiento}
          nombreEntrenamiento={selectedEntrenamiento.nombre}
          totalEjercicios={totalEjerciciosReales}
          tiempoEstimado={tiempoTotal}
        />
      );

    case "ACTIVO":
      // Si no tenemos dimensiones válidas, no renderizar
      if (layoutSize.width <= 0 || layoutSize.height <= 0) {
        return null;
      }

      return (
        <View style={styles.container}>
          {/* Ejercicio screen primero en la jerarquía para que la imagen y el nombre tengan prioridad */}
          <EjercicioScreen
            ejercicio={ejercicioActualData.ejercicioId}
            imagen={ejercicioActualData.ejercicioId.imagen}
            showGroupInfo={false}
          />

          {/* Progress circular ahora se muestra en la parte inferior, con margen superior */}
          <View
            style={[
              styles.progressContainer,
              {
                width: layoutSize.width,
                height: layoutSize.height * 0.5, // Reducir la altura para que no ocupe toda la pantalla
                top: layoutSize.height * 0.3425, // Posicionar en la mitad inferior
                // Esto crea una superposición parcial
              },
            ]}
          >
            <ProgressCircular
              tiempoMaximo={tiempoMaximoActual}
              tiempoTranscurrido={tiempoMaximoActual - tiempoMs / 1000}
              containerWidth={layoutSize.width}
              containerHeight={layoutSize.height * 0.5} // Ajustar la altura
              colores={["#00FF87", "#60EFFF"]}
              pausa={pausa}
              onTiempoAgotado={onTiempoAgotado}
              esDescanso={false}
              totalEjercicios={totalEjerciciosReales}
              indiceEjercicio={indiceReal}
              reducedTextSize={true} // Nuevo prop para texto más pequeño
            />
          </View>

          {/* Botón de pausa */}
          <PauseButton
            isPaused={pausa}
            isDisabled={isLoadingApi}
            onToggle={onTogglePausa}
            bottomPosition={50} // Posicionar más abajo
          />
        </View>
      );

    case "DESCANSO":
      return (
        <DescansoScreen
          tiempoRestanteMs={tiempoMs}
          onSaltar={onTiempoAgotado}
          proximoEjercicio={proximoEjercicioData}
          totalEjercicios={totalEjerciciosReales}
          indiceEjercicio={siguienteIndiceReal}
        />
      );

    case "FIN":
      return (
        <FinScreen
          nombreEntrenamiento={selectedEntrenamiento.nombre}
          tiempoTotal={tiempoTotal}
          caloriasTotales={caloriasTotales}
          onVolver={onVolver}
        />
      );

    default:
      return null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressContainer: {
    position: "absolute",
    // Ahora no definimos top, left, right, bottom aquí
    // ya que lo configuramos dinámicamente arriba
    zIndex: 5, // Asegurarnos que esté por encima pero no tanto como el botón
  },
});
