import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  LinearGradient,
  Canvas,
  Circle,
  Shadow,
  Path,
  Skia,
  vec,
} from "@shopify/react-native-skia";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
console.log(
  "!!!!!!!!!! ProgressCircular.tsx MODULE START (Step 1: Background Circle) !!!!!!!!!!",
);

// ID del ejercicio de descanso en la base de datos
const DESCANSO_ID = "67bc1a7372e1e0091651e944";

// Definir los estilos fuera del componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  canvas: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});

type Props = {
  tiempoMaximo: number; // Tiempo total en segundos
  tiempoTranscurrido: number; // Tiempo transcurrido en segundos (tiempo restante = tiempoMaximo - tiempoTranscurrido)
  containerWidth: number; // Ancho del contenedor
  containerHeight: number; // Alto del contenedor
  colores: string[]; // Colores para el gradiente
  pausa: boolean; // Indica si el temporizador está en pausa
  onTiempoAgotado: () => void; // Función a llamar cuando se agota el tiempo
  esDescanso?: boolean; // Indica si estamos en un período de descanso
  proximoEjercicio?: any; // Información sobre el próximo ejercicio (si esDescanso es true)
  totalEjercicios?: number; // Total de ejercicios en el entrenamiento
  indiceEjercicio?: number; // Índice del ejercicio actual
  reducedTextSize?: boolean; // Si true, reduce el tamaño del texto del temporizador
};

export default function ProgressCircular({
  tiempoMaximo,
  tiempoTranscurrido,
  containerWidth,
  containerHeight,
  colores,
  pausa,
  onTiempoAgotado,
  esDescanso = false,
  proximoEjercicio = null,
  totalEjercicios = 0,
  indiceEjercicio = 0,
  reducedTextSize = false,
}: Props) {
  const { colors, isDarkMode } = useTheme();

  // URL de la imagen por defecto en caso de que no exista
  const placeholderImageUrl =
    "https://ledfit.s3.sa-east-1.amazonaws.com/images/ejercicios/placeholder_workout.webp";

  // Basic log
  console.log(
    "=== PROGRESSCIRCULAR RENDERIZADO (Step 1: Background Circle) ===",
    {
      tiempoMaximo,
      tiempoTranscurrido,
      containerWidth,
      containerHeight,
      pausa,
      esDescanso,
    },
  );

  // Time calculations (kept for potential future use, but not used in this minimal example)
  const totalTimeMs = tiempoMaximo * 1000;
  const elapsedTimeMs = tiempoTranscurrido * 1000;
  const remainingTimeMs = totalTimeMs - elapsedTimeMs;

  if (remainingTimeMs <= 0 && !pausa) {
    onTiempoAgotado();
  }

  const minutes = Math.floor(remainingTimeMs / 60000);
  const seconds = Math.floor((remainingTimeMs % 60000) / 1000);
  const centiseconds = Math.floor((remainingTimeMs % 1000) / 10);

  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");
  const formattedCentiseconds = centiseconds.toString().padStart(2, "0");

  const accessibilityLabel = `Temporizador: ${minutes} minutos y ${seconds} segundos restantes`;
  const timeString = `${formattedMinutes}:${formattedSeconds}:${formattedCentiseconds}`;

  // Uncomment calculations needed for the background circle
  const RADIO = Math.min(containerWidth, containerHeight) / 2 - 60;
  const CX = containerWidth / 2;
  const CY = containerHeight / 2;

  // Uncomment calculations for progress arc
  const FULL_DEGREES = 360;
  // Handle division by zero or invalid times gracefully
  const progress =
    totalTimeMs > 0 ? Math.min(1, Math.max(0, elapsedTimeMs / totalTimeMs)) : 0;
  const sweepAngle = progress * FULL_DEGREES;
  const boundingRect = Skia.XYWHRect(
    CX - RADIO,
    CY - RADIO,
    RADIO * 2,
    RADIO * 2,
  );
  const arcPath = Skia.Path.Make();
  // Add arc only if dimensions and angle are valid
  if (RADIO > 0 && typeof sweepAngle === "number" && !isNaN(sweepAngle)) {
    try {
      arcPath.addArc(boundingRect, -90, sweepAngle);
    } catch (e) {
      console.error("Error adding arc to path:", e);
      // Potentially return a fallback UI or log error
    }
  }

  // Uncomment Skia colors calculation
  const skiaColors = colores.map((c) => Skia.Color(c));

  // ========= HANDLE DESCANSO VIEW (No Skia needed here) =========
  if (esDescanso) {
    console.log(
      "--- Renderizando Vista de Descanso (Step 1 - No Skia Here) ---",
    );
    // Return the simplified non-Skia view for descanso
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
          backgroundColor: colors.background,
        }}
      >
        <Text
          style={{
            color: colors.text,
            fontSize: 20,
            fontWeight: "bold",
            marginBottom: 10,
          }}
        >
          Descanso
        </Text>
        <Text style={{ color: "#6842FF", fontSize: 48, fontWeight: "bold" }}>
          {formattedMinutes}:{formattedSeconds}
          <Text style={{ color: "#FFD700", fontSize: 24 }}>
            {formattedCentiseconds}
          </Text>
        </Text>
        {proximoEjercicio && (
          <Text style={{ color: colors.text, marginTop: 15 }}>
            Próximo: {proximoEjercicio.ejercicioId.nombre}
          </Text>
        )}
        <View style={{ position: "absolute", bottom: 20, left: 20, right: 20 }}>
          <View
            style={{
              backgroundColor: "#6842FF",
              padding: 15,
              borderRadius: 30,
              alignItems: "center",
            }}
          >
            <Text
              style={{ color: "white", fontWeight: "bold" }}
              onPress={onTiempoAgotado}
            >
              Saltar descanso
            </Text>
          </View>
        </View>
      </View>
    );
  }

  // ========= STEP 1: Render Background Circle and Inner Text =========
  console.log("--- Renderizando Step 1: Background Circle & Text ---");

  if (containerWidth <= 0 || containerHeight <= 0 || RADIO <= 0) {
    console.warn(
      "Container dimensions invalid or RADIO invalid, skipping Skia render.",
      {
        containerWidth,
        containerHeight,
        RADIO,
      },
    );
    // Return a placeholder or null if dimensions aren't ready
    return (
      <View style={styles.container}>
        <Text style={{ color: colors.text }}>Esperando dimensiones...</Text>
      </View>
    );
  }

  // Determine font sizes based on reducedTextSize prop
  const mainFontSize = reducedTextSize ? 36 : 48; // Reduced from 48
  const secondaryFontSize = reducedTextSize ? 18 : 24; // Reduced from 24

  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="timer"
    >
      <Canvas
        style={[
          styles.canvas,
          { width: containerWidth, height: containerHeight },
        ]}
      >
        {/* Original Background Circle with Shadow */}
        <Circle
          cx={CX}
          cy={CY}
          r={RADIO}
          color={isDarkMode ? "#333" : "#D8D6D2"}
          style="stroke"
          strokeWidth={13}
        >
          <Shadow
            dx={0}
            dy={0}
            blur={10}
            color={isDarkMode ? "#000" : "rgba(0,0,0,0.1)"}
          />
        </Circle>

        {/* Progress Arc Path with Gradient (Step 3) */}
        <Path
          path={arcPath}
          style="stroke"
          strokeWidth={15}
          strokeCap="round"
          antiAlias={true}
        >
          {/* Uncomment Shadow for the arc */}
          <Shadow dx={0} dy={0} blur={4} color="#038C3E" />

          <LinearGradient
            start={vec(CX - RADIO, CY)} // Use original start/end vectors
            end={vec(CX + RADIO, CY)}
            colors={skiaColors} // Pass the converted Skia colors
          />
        </Path>
      </Canvas>
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: containerWidth,
          height: containerHeight,
          justifyContent: "center",
          alignItems: "center",
        }}
        pointerEvents="none"
      >
        <Text
          style={{
            fontSize: mainFontSize,
            fontWeight: "bold",
            color: colors.text,
          }}
        >
          {formattedMinutes}:{formattedSeconds}
          <Text
            style={{
              fontSize: secondaryFontSize,
              color: isDarkMode ? "#FFD700" : "#6842FF",
            }}
          >
            {formattedCentiseconds}
          </Text>
        </Text>

        {/* Indicadores de pausa o de reproducción */}
        {pausa ? (
          <View
            style={{
              marginTop: 10,
              padding: 10,
              borderRadius: 30,
              backgroundColor: "#6842FF",
            }}
          >
            <Ionicons name="play" color="white" size={24} />
          </View>
        ) : (
          <Text
            style={{
              marginTop: 10,
              fontSize: 16,
              color: colors.secondaryText,
            }}
          >
            {esDescanso ? "Descanso" : "Ejercicio en curso"}
          </Text>
        )}
      </View>
    </View>
  );
}
