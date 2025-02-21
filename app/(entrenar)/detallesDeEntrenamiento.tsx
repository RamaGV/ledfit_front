// app/(entrenar)/detallesDeEntrenamiento.tsx

import {
  View,
  Text,
  ScrollView,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import React from "react";

import { useEntrenamientos } from "@/context/EntrenamientosContext";
import { useImagesMap } from "@/context/ImagesMapContext";

import EjercicioCard from "@/components/entrenar/EjercicioCard";
import ChipInfo from "@/components/entrenar/ChipInfo";

export default function DetallesDeEntrenamiento() {
  const router = useRouter();

  const { selectedEntrenamiento } = useEntrenamientos();
  const { imagesMap } = useImagesMap();

  const handleStart = () => {
    router.push("/(entrenar)/entrenar");
    console.log("Se envió 'Hola Mundo' a esp32/test");
  };

  const mainImage =
    (selectedEntrenamiento?.imagen &&
      imagesMap[selectedEntrenamiento.imagen]) ||
    require("@/assets/defaultWorkout.png");

  return (
    <View className="flex-1 bg-[#121212]">
      <View className="relative">
        <Image
          source={mainImage}
          className="w-full h-[300px]"
          contentFit="cover"
        />
        <Pressable
          onPress={() => router.back()}
          className="absolute top-8 p-2"
        >
          <Ionicons name="chevron-back" size={30} color="#FFFFFF" />
        </Pressable>
      </View>

      <View className="px-4 flex-1">
        {/* Título */}
        <Text className="text-white text-2xl font-semibold py-4">
          {selectedEntrenamiento?.nombre}
        </Text>

        {/* Chips de info */}
        <View className="flex-row justify-around pb-3">
          <ChipInfo label={selectedEntrenamiento?.nivel} icon="None" />
          <ChipInfo
            totalTime={selectedEntrenamiento?.tiempoTotal}
            icon="Time"
          />
          <ChipInfo
            label={selectedEntrenamiento?.ejercicios.length}
            icon="Play"
          />
        </View>

        {/* Sección de ejercicios (Ver más) */}
        <View className="flex-row items-center justify-between border-t border-gray-700 py-3 px-1">
          <Text className="text-white text-lg font-semibold">Rondas</Text>
          <TouchableOpacity
            onPress={() => router.push("/(entrenar)/detallesDeEjercicios")}
          >
            <Text className="text-[#7B61FF] text-sm">Ver más</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
        >
          {selectedEntrenamiento?.ejercicios.map((ejercicio, idx) => (
            <EjercicioCard
              key={idx}
              imagen={imagesMap[ejercicio.imagen]}
              label={ejercicio.nombre}
              tiempoTotal={ejercicio.tiempo}
            />
          ))}
        </ScrollView>
      </View>

      <View className="px-3 py-2 border-t border-gray-700">
        <TouchableOpacity
          className="bg-[#6842FF] rounded-full py-4 mx-5 my-2"
          onPress={handleStart}
        >
          <Text className="text-white text-center text-base font-semibold">
            INICIAR
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
