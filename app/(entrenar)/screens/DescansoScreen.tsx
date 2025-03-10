import { View, Text } from "react-native";
import React from "react";
import { useTheme } from "@/context/ThemeContext";

interface DescansoScreenProps {
  etapaCompleta: () => void;
  tiempoRestante: number;
  indiceDeEjercicio: number;
  totalEjercicios: number;
}

export default function DescansoScreen({
  tiempoRestante,
  indiceDeEjercicio,
  totalEjercicios,
  etapaCompleta,
}: DescansoScreenProps) {
  
  console.log("=== PANTALLA DE DESCANSO SIMPLIFICADA ===", new Date().toISOString());
  
  const { isDarkMode } = useTheme();
  const tiempo = Math.ceil(tiempoRestante);

  return (
    <View className={`flex-1 justify-center items-center ${isDarkMode ? 'bg-[#121212]' : 'bg-white'}`}>
      <View className="w-full bg-red-500 py-4 items-center mb-8">
        <Text className="text-white font-bold text-xl">PANTALLA DE DESCANSO SIMPLIFICADA</Text>
      </View>
      
      <Text className={`text-6xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
        {tiempo}
      </Text>
      
      <Text className={`text-2xl mt-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        Descanso
      </Text>
      
      <Text className={`mt-8 text-lg ${isDarkMode ? 'text-white' : 'text-black'}`}>
        Próximo ejercicio: {indiceDeEjercicio} de {totalEjercicios}
      </Text>
      
      <View className="mt-12 bg-blue-500 px-6 py-3 rounded-full">
        <Text 
          className="text-white font-bold" 
          onPress={etapaCompleta}
        >
          SALTAR DESCANSO
        </Text>
      </View>
    </View>
  );
}
