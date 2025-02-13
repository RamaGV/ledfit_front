// app/(dashboard)/entrenar.tsx

import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { Image } from "expo-image";

import { useEntrenamientos } from "@/context/EntrenamientosContext";
import { useImagesMap } from "@/context/ImagesMapContext";

export default function TrainingSelector() {
  const router = useRouter();

  const { entrenamientos } = useEntrenamientos();
  const { imagesMap } = useImagesMap();

  const [index, setIndex] = useState(0);

  // Si hay entrenamientos, selecciona uno aleatorio al iniciar
  useEffect(() => {
    if (entrenamientos.length > 0) {
      const randomIndex = Math.floor(Math.random() * entrenamientos.length);
      setIndex(randomIndex);
    }
  }, [entrenamientos]);

  const sigEntrenamiento = () => {
    setIndex((prev) => (prev + 1) % entrenamientos.length);
  };

  const antEntrenamiento = () => {
    setIndex((prev) => (prev === 0 ? entrenamientos.length - 1 : prev - 1));
  };

  const handleSelect = () => {
    router.push("/(entrenar)/detallesDeEntrenamiento");
  };

  const minutos = Math.floor(entrenamientos[index].tiempoTotal / 60);
  const segundos = (entrenamientos[index].tiempoTotal % 60)
    .toString()
    .padStart(2, "0");

  return (
    <View className="flex-col h-full items-center justify-around bg-[#121212] p-4 py-8">
      <Text className="text-[#7B61FF] text-4xl font-semibold">
        Elije un entrenamiento
      </Text>

      <View className="flex-row w-full items-center justify-around">
        <TouchableOpacity onPress={antEntrenamiento}>
          <ChevronLeft size={50} color="#7B61FF" />
        </TouchableOpacity>
        <Image
          className="w-60 h-60 rounded-2xl"
          source={imagesMap[entrenamientos[index].imagen]}
        />
        <TouchableOpacity onPress={sigEntrenamiento}>
          <ChevronRight size={50} color="#7B61FF" />
        </TouchableOpacity>
      </View>

      <View className="w-full px-2">
        <Text className="text-white text-2xl font-bold mb-2">
          {entrenamientos[index].nombre}
        </Text>
        <View className="border-b border-gray-700 m-2" />
        <View className="flex-row items-center justify-between ">
          <Text className="text-gray-400 text-base px-3 mb-4">
            Nivel: {entrenamientos[index].nivel}
          </Text>
          <Text className="text-gray-400 text-base px-3 mb-4">
            {entrenamientos[index].ejercicios.length} ejercicios
          </Text>
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="text-gray-400 text-base px-3 mb-4">
            Grupo: {entrenamientos[index].grupo}
          </Text>
          <Text className="text-gray-400 text-base px-3 mb-4">
            {minutos}:{segundos} min
          </Text>
        </View>
        <Text className="text-gray-400 text-sm px-6">
          {entrenamientos[index].descripcion}
        </Text>
        <View className="border-b border-gray-700 m-2" />
      </View>

      <TouchableOpacity
        onPress={handleSelect}
        className="bg-[#7B61FF] py-3 px-6 rounded-2xl"
      >
        <Text className="text-white text-lg font-bold">Entrenar</Text>
      </TouchableOpacity>
    </View>
  );
}
