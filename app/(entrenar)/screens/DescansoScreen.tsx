// app/(entrenar)/screens/DescansoScreen.tsx

import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";

import { useEntrenamientos } from "@/context/EntrenamientosContext";
import { useEjercicios } from "@/context/EjerciciosContext";
import { useImagesMap } from "@/context/ImagesMapContext";

interface DescansoScreenProps {
  tiempoTranscurrido: number;
  indiceDeEjercicio: number;
}

export default function DescansoScreen({
  tiempoTranscurrido,
  indiceDeEjercicio,
}: DescansoScreenProps) {
  const { selectedEntrenamiento } = useEntrenamientos();
  const { ejercicioActual } = useEjercicios();
  const { imagesMap } = useImagesMap();

  const siguienteEjercicio =
    selectedEntrenamiento?.ejercicios[indiceDeEjercicio + 1];

  if (!ejercicioActual || !siguienteEjercicio) {
    return (
      <View className="flex-1 bg-[#121212] items-center justify-center">
        <Text className="text-white">
          No hay datos de entrenamiento o ejercicio.
        </Text>
      </View>
    );
  }

  const handleSkipRest = () => {
    tiempoTranscurrido = 0;
  };

  return (
    <View className="flex-1 bg-[#121212] p-4 items-center justify-center">
      <Text className="text-[#7B61FF] text-xl font-semibold mb-2">
        TAKE A REST
      </Text>

      {/* Temporizador estilo mm:ss, aquí "00:XX" */}
      <Text className="text-white text-5xl font-extrabold mb-8">
        00:{tiempoTranscurrido}
      </Text>

      <>
        <Text className="text-white text-base mb-1">Siguiente ejercicio</Text>
        <Text className="text-white text-xl font-semibold mb-6">
          {siguienteEjercicio.nombre}
        </Text>
        <Image
          source={imagesMap[siguienteEjercicio.imagen]}
          style={{ width: 200, height: 200, marginBottom: 30 }}
          resizeMode="contain"
        />
      </>

      <TouchableOpacity
        onPress={handleSkipRest}
        className="bg-[#7B61FF] py-4 px-8 rounded-full mt-auto w-full"
        style={{ maxWidth: 340 }}
      >
        <Text className="text-white text-center font-semibold">Skip Rest</Text>
      </TouchableOpacity>
    </View>
  );
}
