import React from "react";
import { View, Text } from "react-native";
import { LinearGradient, Canvas, Circle, Shadow, Path, Skia, vec } from "@shopify/react-native-skia";

type Props = {
  tiempoMaximo: number;       // Tiempo total en segundos
  tiempoTranscurrido: number; // Tiempo restante en segundos (según tu comentario)
  containerWidth: number;
  containerHeight: number;
  colores: string[];
  pausa: boolean;
  onTiempoAgotado: () => void;
};

export default function ProgressCircular({
  tiempoMaximo,
  tiempoTranscurrido,
  containerWidth,
  containerHeight,
  colores,
  onTiempoAgotado,
}: Props) {
  // Dimensiones y centro del canvas
  const RADIO = Math.min(containerWidth, containerHeight) / 2 - 45;
  const CX = containerWidth / 2;
  const CY = containerHeight / 2;

  // Convertir tiempos de segundos a milisegundos
  const totalTimeMs = tiempoMaximo * 1000;
  // Como 'tiempoTranscurrido' es el tiempo restante, lo usamos directamente:
  const remainingTimeMs = tiempoTranscurrido * 1000;
  // El tiempo que ya ha pasado es la diferencia
  const elapsedTimeMs = totalTimeMs - remainingTimeMs;

  // Calcular el ángulo del arco (360° representa el total del tiempo)
  const FULL_DEGREES = 360;
  const sweepAngle = (elapsedTimeMs / totalTimeMs) * FULL_DEGREES;

  // Si ya se agotó el tiempo, se invoca la función para pasar a la siguiente etapa
  if (remainingTimeMs <= 0) {
    onTiempoAgotado();
  }

  // Formatear el tiempo restante para mostrar (mm:ss:cc)
  const minutes = Math.floor(remainingTimeMs / 60000);
  const seconds = Math.floor((remainingTimeMs % 60000) / 1000);
  const centiseconds = Math.floor((remainingTimeMs % 1000) / 10);

  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");
  const formattedCentiseconds = centiseconds.toString().padStart(2, "0");

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
    >
      <Canvas style={{ width: containerWidth, height: containerHeight }}>
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
      </View>
    </View>
  );
}
