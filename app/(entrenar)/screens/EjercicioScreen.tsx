// app/(entrenar)/screens/EjercicioScreen.tsx

import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";

import { useEjercicios } from "@/context/EjerciciosContext";
import { useImagesMap } from "@/context/ImagesMapContext";

import ProgressCircular from "@/components/entrenar/ProgressCircular";
interface EjercicioScreenProps {
  etapaCompleta: () => void;
  tiempo: number;
}

export default function EjercicioScreen({etapaCompleta, tiempo}: EjercicioScreenProps) {
  const { ejercicioActual } = useEjercicios();
  const { imagesMap } = useImagesMap();

  const [size, setSize] = useState({ width: 0, height: 0 });
  const [pausa, setPausa] = useState<boolean>(false);

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
              colores={["#0CF25D", "#038C3E", "#025951", "#02735E"]}
              containerHeight={size.height}
              containerWidth={size.width}

              tiempoMaximo={tiempo}
              pausa={pausa}
              onTiempoAgotado={etapaCompleta}
            />
          )}
        </View>

        <TouchableOpacity
          onPress={() => setPausa((prev) => !prev)}
          activeOpacity={0.7}
          className="bg-[#6842FF] px-16 py-4 rounded-full"
        >
          <Text className="text-white">{pausa ? "Reanudar" : "Pausa"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
