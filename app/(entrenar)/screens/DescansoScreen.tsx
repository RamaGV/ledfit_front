import { View, Text, Image, TouchableOpacity, Animated } from "react-native";
import React, { useEffect, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import { useEntrenamientos } from "@/context/EntrenamientosContext";
import { useImagesMap } from "@/context/ImagesMapContext";
import { useTheme } from "@/context/ThemeContext";

// ID del ejercicio de descanso en la base de datos
const DESCANSO_ID = "67bc1a7372e1e0091651e944";

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
  
  const { selectedEntrenamiento } = useEntrenamientos();
  const { imagesMap } = useImagesMap();
  const { isDarkMode } = useTheme();
  const tiempo = Math.ceil(tiempoRestante);
  
  // Referencias para animaciones
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // Función para encontrar el próximo ejercicio real (no descanso)
  const encontrarProximoEjercicioReal = () => {
    if (!selectedEntrenamiento || !selectedEntrenamiento.ejercicios) {
      return null;
    }
    
    // Comenzar desde el índice actual
    let indice = indiceDeEjercicio - 1;
    
    // Buscar hacia adelante hasta encontrar un ejercicio que no sea descanso
    while (indice < selectedEntrenamiento.ejercicios.length) {
      const ejercicio = selectedEntrenamiento.ejercicios[indice];
      // Verificar si no es un descanso
      if (ejercicio.ejercicioId.toString() !== DESCANSO_ID) {
        return {
          ejercicio: ejercicio,
          indiceReal: indice + 1 // +1 porque los índices en UI comienzan desde 1
        };
      }
      indice++;
    }
    
    // Si no encontramos, volver al primero que no sea descanso
    for (let i = 0; i < selectedEntrenamiento.ejercicios.length; i++) {
      const ejercicio = selectedEntrenamiento.ejercicios[i];
      if (ejercicio.ejercicioId.toString() !== DESCANSO_ID) {
        return {
          ejercicio: ejercicio,
          indiceReal: i + 1
        };
      }
    }
    
    return null;
  };
  
  // Obtener información sobre el siguiente ejercicio real (no descanso)
  const proximoEjercicioInfo = encontrarProximoEjercicioReal();
  const siguienteEjercicio = proximoEjercicioInfo?.ejercicio || null;
  const ejercicioInfo = siguienteEjercicio?.ejercicioId || null;
  const indiceRealEjercicio = proximoEjercicioInfo?.indiceReal || 1;

  // Cálculos para mostrar calorías estimadas
  const caloriasEstimadas = ejercicioInfo && siguienteEjercicio
    ? (ejercicioInfo.caloriasPorSegundo 
      ? Math.round(siguienteEjercicio.tiempo * ejercicioInfo.caloriasPorSegundo) 
      : Math.round(siguienteEjercicio.tiempo * 0.15)) // Valor estimado
    : 0;  
  
  // Efecto para la animación pulsante del contador
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

  // No mostrar nada si no hay información del ejercicio o del entrenamiento
  if (!ejercicioInfo || !siguienteEjercicio) {
    return (
      <View className={`flex-1 items-center justify-center ${isDarkMode ? 'bg-[#121212]' : 'bg-white'}`}>
        <Text className={`text-xl ${isDarkMode ? 'text-white' : 'text-black'}`}>
          Cargando información...
        </Text>
      </View>
    );
  }

  // Formatear tiempo para mostrar minutos:segundos si es necesario
  const formatTime = (seconds: number): string => {
    if (seconds < 60) return seconds.toString();
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <View className={`flex-1 ${isDarkMode ? 'bg-[#121212]' : 'bg-white'}`}>
      {/* Contador de descanso en la parte superior */}
      <View className="w-full items-center pt-12 pb-6">
        <Text className={`text-xl mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Descanso
        </Text>
        
        <Animated.View 
          className="transform" 
          style={{ transform: [{ scale: pulseAnim }] }}
        >
          <Text className={`text-5xl font-bold text-[#6842FF]`}>
            {formatTime(tiempo)}
          </Text>
        </Animated.View>
      </View>

      <View className="flex-1 px-5">
        {/* Título "Próximo ejercicio" */}
        <View className="flex-row items-center mb-4">
          <Ionicons name="arrow-forward-circle" size={22} color="#6842FF" />
          <Text className={`text-xl font-bold ml-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Próximo ejercicio
          </Text>
        </View>
        
        {/* Imagen del próximo ejercicio */}
        <View className="w-full mb-6 rounded-2xl overflow-hidden">
          <Image
            source={imagesMap[ejercicioInfo.imagen]}
            className="w-full h-64"
            resizeMode="cover"
          />
          
          <LinearGradient
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']}
            className="absolute bottom-0 left-0 right-0 p-4"
          >
            <Text className="text-white text-2xl font-bold mb-1">
              {ejercicioInfo.nombre}
            </Text>
            
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <Ionicons name="fitness" size={16} color="white" />
                <Text className="text-white ml-1">
                  {ejercicioInfo.grupo || "General"}
                </Text>
              </View>
              
              <View className="bg-white/30 rounded-full px-3 py-1">
                <Text className="text-white font-medium text-sm">
                  {indiceRealEjercicio} de {totalEjercicios}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>
        
        {/* Detalles del ejercicio */}
        <View className={`p-4 rounded-xl mb-6 ${isDarkMode ? 'bg-[#1E1E1E]' : 'bg-gray-100'}`}>
          <Text className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
            Detalles del ejercicio
          </Text>
          
          <Text className={`mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {ejercicioInfo.descripcion || "Prepárate para realizar este ejercicio manteniendo la postura correcta para maximizar los resultados."}
          </Text>
          
          <View className="flex-row justify-between">
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={18} color="#6842FF" />
              <Text className={`ml-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {siguienteEjercicio.tiempo}s
              </Text>
            </View>
            
            <View className="flex-row items-center">
              <Ionicons name="flame-outline" size={18} color="#FF5757" />
              <Text className={`ml-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {caloriasEstimadas} cal
              </Text>
            </View>
          </View>
        </View>
      </View>
      
      {/* Botón para saltar descanso */}
      <View className="px-5 pb-8">
        <TouchableOpacity
          onPress={etapaCompleta}
          className="bg-[#6842FF] py-4 rounded-full w-full items-center"
          activeOpacity={0.8}
        >
          <Text className="text-white font-bold">
            Saltar descanso
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
