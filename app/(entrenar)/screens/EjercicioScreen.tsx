import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import ProgressCircular from "@/components/entrenar/ProgressCircular";
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

  const [size, setSize] = useState({ width: 0, height: 0 });

  if (!ejercicioActual) return null;

  return (
    <View className="flex-1 bg-[#121212]">
      {/* Parte superior con la imagen */}
      <Image
        source={imagesMap[ejercicioActual.imagen]}
        className="w-full h-1/2"
        resizeMode="cover"
      />

      {/* Parte inferior */}
      <View className="w-full h-1/2 items-center justify-around py-5">
        <Text className="text-white text-3xl font-bold">
          {ejercicioActual.nombre}
        </Text>

        {/* Contenedor que mediremos con onLayout */}
        <View
          className="w-full flex-1"
          onLayout={(e) => {
            const { width, height } = e.nativeEvent.layout;
            setSize({ width, height });
          }}
        >
          {/* Solo renderiza el ProgressCircular cuando tenemos las dimensiones */}
          {size.width > 0 && size.height > 0 && (
            <ProgressCircular
              tiempoMaximo={ejercicioActual.tiempo}
              containerWidth={size.width}
              containerHeight={size.height}
              colores={["#0CF25D", "#038C3E", "#025951", "#02735E"]}
            />
          )}
        </View>

        <TouchableOpacity
          onPress={onPause}
          activeOpacity={0.7}
          className="bg-[#6842FF] px-8 py-2 rounded-full"
        >
          <Text className="text-whit">Pausa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
