import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";

import { useEntrenamientos } from "@/context/EntrenamientosContext";
import { useEjercicios } from "@/context/EjerciciosContext";
import { useImagesMap } from "@/context/ImagesMapContext";

interface DescansoScreenProps {
  etapaCompleta: () => void;
  indiceDeEjercicio: number;
  tiempo: number;
}

export default function DescansoScreen({
  etapaCompleta,
  indiceDeEjercicio,
  tiempo,
}: DescansoScreenProps) {
  const { selectedEntrenamiento } = useEntrenamientos();
  const { ejercicioActual } = useEjercicios();
  const { imagesMap } = useImagesMap();

  const siguienteEjercicio =
    selectedEntrenamiento?.ejercicios[indiceDeEjercicio + 1];

  if (!ejercicioActual || !siguienteEjercicio) {
    return (
      <View className="flex-1 items-center justify-center w-full h-full bg-[#121212]">
        <Text className="text-white">No hay datos de entrenamiento o ejercicio.</Text>
      </View>
    );
  }

  // Formatear el tiempo para mostrarlo como mm:ss
  const minutes = Math.floor(tiempo / 60);
  const seconds = tiempo % 60;
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");

  return (
    <View className="flex-1 items-center justify-between bg-[#121212] py-5">
      {/* Encabezado */}
      <View className="flex-col items-center justify-around py-5 mt-12">
        <Text className="text-[#6842FF] text-3xl font-semibold">Toma un descanso</Text>
        <Text className="text-white text-5xl font-extrabold mt-6">
          {formattedMinutes}:{formattedSeconds}
        </Text>
        <View className="mt-4 border-b border-gray-700 w-72"/>
      </View>

      {/* Sección Intermedia */}
      <View className="flex-1 items-left justify-around w-full px-8 mb-10">
        <Text className="text-gray-400 text-base">
          Siguiente ronda ({indiceDeEjercicio + 2} de {selectedEntrenamiento?.ejercicios.length})
        </Text>
        <Text className="text-white text-2xl font-semibold mb-4">
          {siguienteEjercicio.ejercicioId.nombre}
        </Text>
        <View className="items-center">
          <View className="w-[275px] h-[275px] overflow-hidden rounded-3xl">
            <Image
              source={imagesMap[siguienteEjercicio.ejercicioId.imagen]}
              className="w-full h-full"
              resizeMode="contain"
              />
          </View>
        </View>
      </View>

      {/* Botón Quitar Descanso */}
      <TouchableOpacity
        onPress={etapaCompleta}
        className="bg-[#6842FF] py-4 px-8 rounded-full w-full"
        style={{ maxWidth: 300, alignSelf: "center" }}
      >
        <Text className="text-white text-center font-semibold">Quitar descanso</Text>
      </TouchableOpacity>
    </View>
  );
}
