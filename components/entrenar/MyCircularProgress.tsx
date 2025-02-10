// Ejemplo: app/components/MyCircularProgress.tsx
import React from "react";
import { View, Text } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";

type MyCircularProgressProps = {
  progress: number; // Progreso en porcentaje (0 a 100)
  totalTime: number; // Tiempo total del ejercicio en segundos
};

const MyCircularProgress: React.FC<MyCircularProgressProps> = ({
  progress,
  totalTime,
}) => {
  const segundosRestantes =
    totalTime - Math.round((totalTime * progress) / 100);

  return (
    <View>
      <AnimatedCircularProgress
        size={150}
        width={10}
        fill={progress}
        tintColor="#2ecc71"
        backgroundColor="#3d5875"
      >
        {(fill: number) => (
          <Text style={{ fontSize: 20, color: "white" }}>
            {segundosRestantes}s
          </Text>
        )}
      </AnimatedCircularProgress>
    </View>
  );
};

export default MyCircularProgress;
