// app/(entrenar)/screens/EjercicioScreen.tsx

import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";

import { useEjercicios } from "@/context/EjerciciosContext";
import { useImagesMap } from "@/context/ImagesMapContext";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

import ProgressCircular from "@/components/entrenar/ProgressCircular";

interface EjercicioScreenProps {
  etapaCompleta: () => void;
  tiempoTranscurrido: number;
  tiempoMaximo: number;
  pausa: boolean;
  cambioPausa: () => void;
  numeroEjercicio?: number; // Nuevo: número de ejercicio actual (sin contar descansos)
  totalEjercicios?: number; // Nuevo: total de ejercicios (sin contar descansos)
}

export default function EjercicioScreen({
  etapaCompleta, 
  tiempoTranscurrido, 
  tiempoMaximo, 
  pausa, 
  cambioPausa,
  numeroEjercicio = 1,
  totalEjercicios = 1
}: EjercicioScreenProps) {
  const { ejercicioActual } = useEjercicios();
  const { imagesMap } = useImagesMap();
  const { isDarkMode } = useTheme();

  const [size, setSize] = useState({ width: 0, height: 0 });
  
  // Calcular calorías estimadas
  const caloriasEstimadas = ejercicioActual?.caloriasPorSegundo 
    ? Math.round(tiempoMaximo * ejercicioActual.caloriasPorSegundo) 
    : Math.round(tiempoMaximo * 0.15);

  if (!ejercicioActual) return null;

  return (
    <View className={`flex-1 ${isDarkMode ? 'bg-[#121212]' : 'bg-white'}`}>
      {/* Barra de progreso superior */}
      <View className="h-1 w-full bg-gray-200">
        <View 
          className="h-full bg-[#6842FF]"
          style={{ width: `${(tiempoTranscurrido / tiempoMaximo) * 100}%` }}
        />
      </View>
      
      {/* Parte superior con la imagen y badge de progreso */}
      <View className="relative w-full h-2/5">
        <Image
          source={imagesMap[ejercicioActual.imagen]}
          className="w-full h-full"
          resizeMode="cover"
        />
        
        {/* Badge de progreso del ejercicio */}
        <View className="absolute top-5 right-5 bg-[#00000080] px-3 py-1 rounded-full">
          <Text className="text-white font-medium">
            {numeroEjercicio} / {totalEjercicios}
          </Text>
        </View>
      </View>

      {/* Parte inferior */}
      <View className="w-full h-3/5 items-center justify-center py-2">
        <Text className={`text-2xl font-bold text-center mb-2 ${isDarkMode ? 'text-white' : 'text-[#333333]'}`}>
          {ejercicioActual.nombre}
        </Text>
        
        {/* Contenedor para el ProgressCircular (más grande) */}
        <View
          className="w-full flex-1 px-4 justify-center items-center"
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
              tiempoMaximo={tiempoMaximo}
              tiempoTranscurrido={tiempoTranscurrido}
              pausa={pausa}
              onTiempoAgotado={etapaCompleta}
            />
          )}
        </View>

        {/* Botón de pausa/reanudar */}
        <TouchableOpacity
          onPress={cambioPausa}
          className={`py-4 px-10 rounded-full mb-6 ${pausa ? 'bg-[#6842FF]' : 'border-2 border-[#6842FF]'}`}
          activeOpacity={0.7}
        >
          <Text className={`font-bold ${pausa ? 'text-white' : 'text-[#6842FF]'}`}>
            {pausa ? "Reanudar" : "Pausa"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
