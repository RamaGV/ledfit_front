import { View, Text } from "react-native";
import React from "react";
import { useTheme } from "../../../context/ThemeContext";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity } from "react-native";

interface DescansoScreenProps {
  onSaltar: () => void;
  tiempoRestanteMs: number;
  indiceEjercicio: number;
  totalEjercicios: number;
  proximoEjercicio?: any; // Información sobre el próximo ejercicio
}

export default function DescansoScreen({
  tiempoRestanteMs,
  indiceEjercicio,
  totalEjercicios,
  onSaltar,
  proximoEjercicio = null,
}: DescansoScreenProps) {
  console.log("=== PANTALLA DE DESCANSO ACTUALIZADA ===", {
    proximoEjercicio,
    indiceEjercicio,
    totalEjercicios,
  });

  const { isDarkMode } = useTheme();
  const tiempoSegundos = Math.ceil(tiempoRestanteMs / 1000);

  // URL de la imagen por defecto en caso de que no exista
  const placeholderImageUrl =
    "https://ledfit.s3.sa-east-1.amazonaws.com/images/ejercicios/placeholder_workout.webp";

  // Si no hay información de próximo ejercicio, mostramos una pantalla simple
  if (!proximoEjercicio) {
    return (
      <View
        className={`flex-1 justify-center items-center ${isDarkMode ? "bg-[#121212]" : "bg-white"}`}
      >
        <Text
          className={`text-5xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-black"}`}
        >
          {tiempoSegundos}
        </Text>

        <Text
          className={`text-xl ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
        >
          Descanso
        </Text>

        <View className="mt-10">
          <TouchableOpacity
            className="bg-[#6842FF] px-6 py-3 rounded-full"
            onPress={onSaltar}
            activeOpacity={0.7}
          >
            <Text className="text-white font-bold">SALTAR DESCANSO</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Si hay próximo ejercicio, calculamos calorías estimadas
  const caloriasEstimadas = proximoEjercicio.ejercicioId.caloriasPorSegundo
    ? Math.round(
        proximoEjercicio.tiempo *
          proximoEjercicio.ejercicioId.caloriasPorSegundo,
      )
    : Math.round(proximoEjercicio.tiempo * 0.15);

  return (
    <View className={`flex-1 ${isDarkMode ? "bg-[#121212]" : "bg-white"}`}>
      {/* Encabezado con timer de descanso */}
      <LinearGradient
        colors={["#8C6EFF", "#6842FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="w-full py-6 px-5 items-center"
      >
        <Text className="text-white text-base opacity-80">Descanso</Text>

        <Text className="text-white text-5xl font-bold my-1">
          {tiempoSegundos}
        </Text>

        <Text className="text-white text-sm opacity-70">
          Prepárate para el siguiente ejercicio
        </Text>
      </LinearGradient>

      {/* Próximo ejercicio */}
      <View className="px-5 py-4">
        <View className="flex-row items-center mb-4">
          <Ionicons name="arrow-forward-circle" size={22} color="#6842FF" />
          <Text
            className={`text-xl font-bold ml-2 ${isDarkMode ? "text-white" : "text-black"}`}
          >
            Próximo ejercicio
          </Text>
        </View>

        {/* Imagen y detalles */}
        <View
          className={`rounded-xl overflow-hidden mb-5 ${isDarkMode ? "bg-[#1E1E1E]" : "bg-gray-100"}`}
        >
          {proximoEjercicio.ejercicioId.imagen && (
            <Image
              source={{
                uri: proximoEjercicio.ejercicioId.imagen || placeholderImageUrl,
              }}
              className="w-full h-56"
              contentFit="cover"
            />
          )}

          <View className="p-4">
            <Text
              className={`text-xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-black"}`}
            >
              {proximoEjercicio.ejercicioId.nombre || "Próximo ejercicio"}
            </Text>

            <View className="flex-row items-center mb-3">
              <Ionicons name="barbell-outline" size={16} color="#6842FF" />
              <Text
                className={`ml-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                {proximoEjercicio.ejercicioId.grupo || "General"}
              </Text>
            </View>

            <View className="flex-row justify-between mt-3">
              <View className="flex-row items-center">
                <Ionicons name="time-outline" size={18} color="#6842FF" />
                <Text
                  className={`ml-2 ${isDarkMode ? "text-white" : "text-black"}`}
                >
                  {proximoEjercicio.tiempo}s
                </Text>
              </View>

              <View className="flex-row items-center">
                <Ionicons name="flame-outline" size={18} color="#FF5757" />
                <Text
                  className={`ml-2 ${isDarkMode ? "text-white" : "text-black"}`}
                >
                  {caloriasEstimadas} cal
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Indicador de posición */}
        <View className="bg-[#6842FF20] self-start px-4 py-2 rounded-full mt-5">
          <Text className="text-[#6842FF]">
            {indiceEjercicio} de {totalEjercicios}
          </Text>
        </View>
      </View>

      {/* Botón de saltar descanso */}
      <View className="px-5 mt-auto mb-8">
        <TouchableOpacity
          onPress={onSaltar}
          className="bg-[#6842FF] py-4 rounded-full w-full items-center"
          activeOpacity={0.7}
        >
          <Text className="text-white font-bold">Saltar descanso</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
