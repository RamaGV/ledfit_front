import React, { useState, useEffect } from "react";
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

type Props = {
  tiempoMaximo: number; // en segundos
  containerWidth: number;
  containerHeight: number;
  colores: string[];
};

export default function ProgressCircular({
  tiempoMaximo,
  containerWidth,
  containerHeight,
  colores,
}: Props) {
  // Define el radio según el tamaño del contenedor
  const RADIO = Math.min(containerWidth, containerHeight) / 2 - 45;
  const CX = containerWidth / 2;
  const CY = containerHeight / 2;

  const tiempoMaximoMs = tiempoMaximo * 1000;
  const [tiempoMs, setTiempoMs] = useState(tiempoMaximoMs);

  // Actualiza cada 50ms
  useEffect(() => {
    const interval = setInterval(() => {
      setTiempoMs((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 50;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [tiempoMaximoMs]);

  // Cálculo del arco
  const FULL_DEGREES = 360;
  const sweepAngle = ((tiempoMaximoMs - tiempoMs) / tiempoMaximoMs) * FULL_DEGREES;
  const boundingRect = Skia.XYWHRect(CX - RADIO, CY - RADIO, RADIO * 2, RADIO * 2);
  const arcPath = Skia.Path.Make();
  arcPath.addArc(boundingRect, -90, sweepAngle);

  // Formateo del tiempo
  const minutes = Math.floor(tiempoMs / 60000);
  const seconds = Math.floor((tiempoMs % 60000) / 1000);
  const centiseconds = Math.floor((tiempoMs % 1000) / 10);

  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");
  const formattedCentiseconds = centiseconds.toString().padStart(2, "0");

  // Convertir colores a Skia.Color
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
      }}>
        <Text style={{ color: "#FFF", fontSize: 24, fontWeight: "bold", marginLeft: 4 }}>
          {formattedMinutes} : {formattedSeconds}
          <Text style={{ color: "#FFD700", fontSize: 16 }}>  {formattedCentiseconds}</Text>
        </Text>
      </View>
    </View>
  );
}
