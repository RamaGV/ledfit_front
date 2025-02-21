// app/(entrenar)/screens/FinScreen.tsx
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import React from "react";

import { useEntrenamientos } from "@/context/EntrenamientosContext";
import { useEjercicios } from "@/context/EjerciciosContext";
import { calcularTiempo } from "@/utils/utilsEntrenamientos";

export default function FinScreen() {
  const router = useRouter();
  const { selectedEntrenamiento } = useEntrenamientos();
  const { ejercicioActual } = useEjercicios();

  if (!ejercicioActual || !selectedEntrenamiento) {
    return null;
  }

  return (
    <View className="flex-col items-center justify-around p-6 bg-[#121212]">
      <View className="mt-10">
        <Image
          source={require("@/assets/ejercicios/trofeo.png")}
          style={{ width: 300, height: 300 }}
          resizeMode="contain"
        />
      </View>

      <View className="items-center">
        <Text className="text-[#FFD700] text-3xl font-bold mb-2">
          ¡Felicidades!
        </Text>
        <Text className="text-white text-base mb-6">
          ¡Has completado el entrenamiento!
        </Text>
      </View>

      <View className="w-full border-b border-gray-700 mb-6" />

      <View className="flex-row w-full justify-around mb-6">
        <View className="items-center ">
          <Text className="text-white text-xl font-bold">
            {selectedEntrenamiento.ejercicios.length}
          </Text>
          <Text className="text-gray-400 text-sm">Rondas</Text>
        </View>
        <View className="border-r border-gray-700" />
        <View className="items-center">
          <Text className="text-white text-xl font-bold">
            {ejercicioActual.calorias}
          </Text>
          <Text className="text-gray-400 text-sm">Cal</Text>
        </View>
        <View className="border-r border-gray-700" />
        <View className="items-center">
          <Text className="text-white text-xl font-bold">
            {calcularTiempo(selectedEntrenamiento.tiempoTotal)}
          </Text>
          <Text className="text-gray-400 text-sm">Minutos</Text>
        </View>
      </View>

      <View className="w-full mt-12">
        <TouchableOpacity
          onPress={() => router.push("/(dashboard)/entrenar")}
          className="bg-[#6842FF] py-4 mb-6 rounded-full"
        >
          <Text className="text-white text-center font-semibold">
            Iniciar otro entrenamiento
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(dashboard)")}
          className="bg-[#1E1E1E] py-4 rounded-full"
        >
          <Text className="text-white text-center font-semibold">
            Volver al Inicio
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
