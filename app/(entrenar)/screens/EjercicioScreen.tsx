// app/(entrenar)/screens/EjercicioScreen.tsx

import CirculasProgress from "react-native-circular-progress-indicator";
import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";

import { useEjercicios } from "@/context/EjerciciosContext";
import { useImagesMap } from "@/context/ImagesMapContext";

type EjercicioScreenProps = {
  tiempoTranscurrido: number;
  onPause: () => void;
};

export default function EjercicioScreen({
  tiempoTranscurrido,
  onPause,
}: EjercicioScreenProps) {
  const { ejercicioActual } = useEjercicios();
  const { imagesMap } = useImagesMap();

  if (!ejercicioActual) {
    return null;
  }

  return (
    <View className="flex-1 items-center justify-between bg-[#121212]">
      <Image
        source={imagesMap[ejercicioActual.imagen]}
        className="w-full h-1/2 mb-4"
        resizeMode="cover"
      />
      <View className="flex-col items-center justify-around h-1/2">
        <Text className="text-white text-2xl font-bold">
          {ejercicioActual.nombre}
        </Text>

        <CirculasProgress
          radius={75}
          value={tiempoTranscurrido}
          maxValue={ejercicioActual.tiempo}
          inActiveStrokeColor="#2ecc71"
          inActiveStrokeOpacity={0.2}
          inActiveStrokeWidth={6}
        />

        <TouchableOpacity
          onPress={onPause}
          activeOpacity={0.7}
          className="bg-[#7B61FF] py-2 px-6 rounded-full mt-4"
        >
          <Text className="text-white text-lg font-semibold">Pausar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
