import React from "react";
import { View, Text, AccessibilityInfo } from "react-native";
import { LinearGradient, Canvas, Circle, Shadow, Path, Skia, vec } from "@shopify/react-native-skia";

type Props = {
  tiempoMaximo: number;       // Tiempo total en segundos
  tiempoTranscurrido: number; // Tiempo transcurrido en segundos (tiempo restante = tiempoMaximo - tiempoTranscurrido)
  containerWidth: number;     // Ancho del contenedor
  containerHeight: number;    // Alto del contenedor
  colores: string[];          // Colores para el gradiente
  pausa: boolean;             // Indica si el temporizador está en pausa
  onTiempoAgotado: () => void;// Función a llamar cuando se agota el tiempo
};

export default function ProgressCircular({
  tiempoMaximo,
  tiempoTranscurrido,
  containerWidth,
  containerHeight,
  colores,
  pausa,
  onTiempoAgotado,
}: Props) {
  // Añadimos un log para verificar si este componente se usa durante el descanso
  console.log("=== PROGRESSCIRCULAR SIENDO RENDERIZADO ===", {
    tiempoMaximo,
    tiempoTranscurrido,
    containerWidth,
    containerHeight,
    pausa
  });

  // Dimensiones y centro del canvas
  const RADIO = Math.min(containerWidth, containerHeight) / 2 - 45;
  const CX = containerWidth / 2;
  const CY = containerHeight / 2;

  // Convertir tiempos de segundos a milisegundos
  const totalTimeMs = tiempoMaximo * 1000;
  
  // Calcular el tiempo restante
  const elapsedTimeMs = tiempoTranscurrido * 1000;
  const remainingTimeMs = totalTimeMs - elapsedTimeMs;

  // Calcular el ángulo del arco (360° representa el total del tiempo)
  const FULL_DEGREES = 360;
  const progress = elapsedTimeMs / totalTimeMs;
  const sweepAngle = progress * FULL_DEGREES;

  // Si ya se agotó el tiempo y no está en pausa, se invoca la función para pasar a la siguiente etapa
  if (remainingTimeMs <= 0 && !pausa) {
    onTiempoAgotado();
  }

  // Formatear el tiempo restante para mostrar (mm:ss:cc)
  const minutes = Math.floor(remainingTimeMs / 60000);
  const seconds = Math.floor((remainingTimeMs % 60000) / 1000);
  const centiseconds = Math.floor((remainingTimeMs % 1000) / 10);

  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");
  const formattedCentiseconds = centiseconds.toString().padStart(2, "0");

  // Formato para lectores de pantalla
  const accessibilityLabel = `Temporizador: ${minutes} minutos y ${seconds} segundos restantes`;
  const timeString = `${formattedMinutes}:${formattedSeconds}:${formattedCentiseconds}`;

  // Crear el arco usando Skia
  const boundingRect = Skia.XYWHRect(CX - RADIO, CY - RADIO, RADIO * 2, RADIO * 2);
  const arcPath = Skia.Path.Make();
  arcPath.addArc(boundingRect, -90, sweepAngle);

  // Convertir los colores a formato Skia
  const skiaColors = colores.map((c) => Skia.Color(c));

  return (
    <View
      style={{
        width: containerWidth,
        height: containerHeight,
        justifyContent: "center",
        alignItems: "center",
      }}
      accessible={true}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint="Muestra el tiempo restante para el ejercicio actual"
      accessibilityRole="timer"
    >
      {/* Banner de prueba */}
      <View 
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: "red",
          padding: 5,
          zIndex: 999,
          alignItems: "center"
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          COMPONENTE PROGRESSCIRCULAR
        </Text>
      </View>

      <Canvas style={{ width: containerWidth, height: containerHeight }}>
        {/* Círculo de fondo */}
        <Circle
          cx={CX}
          cy={CY}
          r={RADIO}
          color="#333"
          style="stroke"
          strokeWidth={13}
        >
          <Shadow dx={0} dy={0} blur={10} color="#000" />
        </Circle>

        {/* Arco de progreso */}
        <Path
          path={arcPath}
          style="stroke"
          strokeWidth={15}
          strokeCap="round"
        >
          <Shadow dx={0} dy={0} blur={4} color="#038C3E" />
          <LinearGradient
            start={vec(CX - RADIO, CY)}
            end={vec(CX + RADIO, CY)}
            colors={skiaColors}
          />
        </Path>
      </Canvas>

      {/* Texto del tiempo */}
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
      >
        <Text style={{ color: "#FFF", fontSize: 24, fontWeight: "bold", marginLeft: 4 }}>
          {formattedMinutes} : {formattedSeconds}
          <Text style={{ color: "#FFD700", fontSize: 16 }}> {formattedCentiseconds}</Text>
        </Text>
        
        {/* Indicador de pausa */}
        {pausa && (
          <Text style={{ color: "#FF5252", fontSize: 14, marginTop: 8 }}>PAUSADO</Text>
        )}
      </View>
    </View>
  );
}
