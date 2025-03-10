// app/(entrenar)/screens/InicioScreen.tsx

import { View, Text, TouchableOpacity, Animated } from "react-native";
import React, { useEffect, useRef, useMemo } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useEntrenamientos } from "@/context/EntrenamientosContext";
import { Image } from 'expo-image';
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useImagesMap } from "@/context/ImagesMapContext";

// ID del ejercicio de descanso en la base de datos
const DESCANSO_ID = "67bc1a7372e1e0091651e944";

interface InicioScreenProps {
  etapaCompleta: () => void;
  tiempoRestante: number; // Recibido en segundos (puede ser decimal)
}

export default function InicioScreen({ etapaCompleta, tiempoRestante }: InicioScreenProps) {
  // Redondea el tiempo restante para que se muestre solo como un entero.
  const tiempo = Math.ceil(tiempoRestante);
  const { isDarkMode } = useTheme();
  const { selectedEntrenamiento } = useEntrenamientos();
  const { imagesMap } = useImagesMap();
  
  // Referencia para la animación pulsante
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // Calcular estadísticas del entrenamiento (filtrando descansos)
  const { ejerciciosReales, tiempoRealTotal, caloriasTotal } = useMemo(() => {
    if (!selectedEntrenamiento) {
      return { ejerciciosReales: [], tiempoRealTotal: 0, caloriasTotal: 0 };
    }

    // Filtrar ejercicios reales (sin descansos)
    const reales = selectedEntrenamiento.ejercicios.filter(
      ejercicio => ejercicio.ejercicioId.toString() !== DESCANSO_ID
    );

    // Calcular tiempo total solo de ejercicios reales
    const tiempoTotal = reales.reduce((sum, ejercicio) => sum + ejercicio.tiempo, 0);

    return {
      ejerciciosReales: reales,
      tiempoRealTotal: tiempoTotal,
      caloriasTotal: selectedEntrenamiento.calorias,
    };
  }, [selectedEntrenamiento]);
  
  // Crear animación pulsante
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Determinar la imagen del entrenamiento
  const getEntrenamientoImage = () => {
    if (!selectedEntrenamiento) return require('@/assets/entrenamientos/yogaIntermedioImage.webp');
    
    if (selectedEntrenamiento.imagen && imagesMap[selectedEntrenamiento.imagen]) {
      return imagesMap[selectedEntrenamiento.imagen];
    }
    
    return require('@/assets/entrenamientos/yogaIntermedioImage.webp');
  };

  return (
    <View className={`flex-1 px-5 pt-8 ${isDarkMode ? 'bg-[#121212]' : 'bg-white'}`}>
      {/* Encabezado con nombre del entrenamiento */}
      <LinearGradient
        colors={['#8C6EFF', '#6842FF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="w-full rounded-2xl p-6 mb-6"
      >
        <Text className="text-white font-bold text-2xl text-center">
          {selectedEntrenamiento?.nombre || "Entrenamiento"}
        </Text>
        
        <Text className="text-white text-center mt-1 opacity-80">
          Prepárate para comenzar
        </Text>
      </LinearGradient>
      
      {/* Imagen representativa del entrenamiento */}
      {selectedEntrenamiento && (
        <View className="w-full mb-6">
          <Image
            source={getEntrenamientoImage()}
            className="w-full h-48 rounded-2xl"
            contentFit="cover"
          />
          
          <View className="absolute bottom-0 left-0 right-0 bg-black/60 rounded-b-2xl p-4">
            <Text className="text-white font-bold text-lg">
              {selectedEntrenamiento.nivel} · {selectedEntrenamiento.grupo}
            </Text>
          </View>
        </View>
      )}
      
      {/* Contador central */}
      <View className="w-full items-center mb-8">
        <Text className="text-gray-500 mb-2">Comenzando en</Text>
        
        <Animated.View className="transform" style={{ transform: [{ scale: pulseAnim }] }}>
          <Text className={`text-6xl font-bold text-[#6842FF]`}>
            {tiempo}
          </Text>
        </Animated.View>
      </View>
      
      {/* Estadísticas del entrenamiento */}
      <View className="flex-row justify-between w-full mb-10">
        <View className={`items-center p-4 rounded-xl flex-1 mx-1 ${isDarkMode ? 'bg-[#1E1E1E]' : 'bg-gray-100'}`}>
          <Ionicons name="time-outline" size={22} color="#6842FF" />
          <Text className={`font-bold text-lg mt-1 ${isDarkMode ? 'text-white' : 'text-black'}`}>
            {tiempoRealTotal}s
          </Text>
          <Text className="text-gray-500 text-xs">Duración</Text>
        </View>
        
        <View className={`items-center p-4 rounded-xl flex-1 mx-1 ${isDarkMode ? 'bg-[#1E1E1E]' : 'bg-gray-100'}`}>
          <Ionicons name="fitness-outline" size={22} color="#6842FF" />
          <Text className={`font-bold text-lg mt-1 ${isDarkMode ? 'text-white' : 'text-black'}`}>
            {ejerciciosReales.length}
          </Text>
          <Text className="text-gray-500 text-xs">Ejercicios</Text>
        </View>
        
        <View className={`items-center p-4 rounded-xl flex-1 mx-1 ${isDarkMode ? 'bg-[#1E1E1E]' : 'bg-gray-100'}`}>
          <Ionicons name="flame-outline" size={22} color="#FF5757" />
          <Text className={`font-bold text-lg mt-1 ${isDarkMode ? 'text-white' : 'text-black'}`}>
            {caloriasTotal}
          </Text>
          <Text className="text-gray-500 text-xs">Calorías</Text>
        </View>
      </View>
      
      {/* Botón de acción */}
      <TouchableOpacity
        onPress={etapaCompleta}
        className="bg-[#6842FF] py-4 px-6 rounded-full w-full items-center"
        activeOpacity={0.8}
      >
        <Text className="text-white font-bold text-base">Comenzar ahora</Text>
      </TouchableOpacity>
    </View>
  );
}
