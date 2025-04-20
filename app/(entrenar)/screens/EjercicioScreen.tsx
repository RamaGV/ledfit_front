// app/(entrenar)/screens/EjercicioScreen.tsx

import { View, Text } from "react-native";
import React from "react";
import { Image } from "expo-image";

import { useTheme } from "../../../context/ThemeContext";

interface IEjercicio {
  _id: string;
  nombre: string;
  grupo: string;
  imagen: string;
  caloriasPorSegundo?: number;
}

interface EjercicioScreenProps {
  ejercicio: IEjercicio;
  imagen: string | null;
  onLayout?: (event: any) => void;
  showGroupInfo?: boolean;
}

export default function EjercicioScreen({
  ejercicio,
  imagen,
  onLayout,
  showGroupInfo = true, // Por defecto mostramos el grupo
}: EjercicioScreenProps) {
  const { isDarkMode } = useTheme();

  if (!ejercicio) return null;

  // Usar directamente la imagen del ejercicio o un placeholder
  const placeholderImageUrl =
    "https://ledfit.s3.sa-east-1.amazonaws.com/images/ejercicios/placeholder_workout.webp";
  const imageSource = imagen ? { uri: imagen } : { uri: placeholderImageUrl };

  return (
    <View
      className={`flex-1 ${isDarkMode ? "bg-[#121212]" : "bg-white"}`}
      onLayout={onLayout}
    >
      <View className="relative w-full h-3/5">
        <Image
          source={imageSource}
          className="w-full h-2/3"
          contentFit="cover"
          placeholder={{ uri: placeholderImageUrl }}
          transition={300}
        />
      </View>

      <View className="w-full h-2/5 items-center justify-center p-4">
        <Text
          className={`text-xl font-bold text-center mb-2 ${isDarkMode ? "text-white" : "text-[#333333]"}`}
        >
          {ejercicio.nombre}
        </Text>
        {showGroupInfo && (
          <Text
            className={`text-sm text-center ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            {ejercicio.grupo}
          </Text>
        )}
      </View>
    </View>
  );
}
