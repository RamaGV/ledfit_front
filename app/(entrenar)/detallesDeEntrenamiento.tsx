// app/(entrenar)/detallesDeEntrenamiento.tsx

import {
  View,
  Text,
  ScrollView,
  Pressable,
  TouchableOpacity,
  StatusBar,
  SafeAreaView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import React, { useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";

import { useEntrenamientos } from "@/context/EntrenamientosContext";
import { useImagesMap } from "@/context/ImagesMapContext";
import { useTheme } from "@/context/ThemeContext";

import EjercicioCard from "@/components/entrenar/EjercicioCard";
import ChipInfo from "@/components/entrenar/ChipInfo";

const HEADER_HEIGHT = 300;

export default function DetallesDeEntrenamiento() {
  const router = useRouter();
  const { selectedEntrenamiento } = useEntrenamientos();
  const { imagesMap } = useImagesMap();
  const { isDarkMode } = useTheme();

  // Verificar que existe un entrenamiento seleccionado
  useEffect(() => {
    if (!selectedEntrenamiento) {
      router.replace("/(dashboard)");
    }
  }, [selectedEntrenamiento]);

  const handleStart = () => {
    router.push("/(entrenar)/entrenar");
  };

  const mainImage =
    (selectedEntrenamiento?.imagen &&
      imagesMap[selectedEntrenamiento.imagen]) ||
    require("@/assets/defaultWorkout.png");

  if (!selectedEntrenamiento) {
    return (
      <View className="flex-1 items-center justify-center bg-[#121212]">
        <Text className="text-white">Cargando entrenamiento...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-[#121212]' : 'bg-[#EFEEE9]'}`}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      
      {/* Header con imagen - FIJO */}
      <View className="relative">
        <View className="w-full h-[300px]">
          <Image
            source={mainImage}
            className="w-full h-full"
            contentFit="cover"
          />
          <LinearGradient
            colors={["rgba(0,0,0,0.6)", "transparent", "rgba(0,0,0,0.3)"]}
            className="absolute inset-0"
          />
          <Pressable 
            className="absolute top-12 left-4 bg-black/30 rounded-full p-2 z-10"
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={26} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* Información general - FIJA */}
        <View className={`px-5 pt-4 ${isDarkMode ? 'bg-[#121212]' : 'bg-[#EFEEE9]'}`}>
          {/* Título */}
          <Text className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-[#333333]'}`}>
            {selectedEntrenamiento.nombre}
          </Text>

          {/* Chips de información */}
          <View className="flex-row justify-around mb-5">
            <ChipInfo label={selectedEntrenamiento.nivel} icon="None" />
            <ChipInfo
              totalTime={selectedEntrenamiento.tiempoTotal}
              icon="Time"
            />
            <ChipInfo
              label={selectedEntrenamiento.ejercicios.length}
              icon="Play"
            />
          </View>
        </View>
      </View>

      {/* Encabezado de la sección de ejercicios - FIJO */}
      <View 
        className={`flex-row items-center justify-between py-4 px-5 border-t ${
          isDarkMode 
            ? 'bg-[#121212] border-gray-700' 
            : 'bg-[#EFEEE9] border-gray-300'
        }`}
      >
        <Text className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-[#333333]'}`}>
          Rondas
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/(entrenar)/detallesDeEjercicios")}
        >
          <Text className="text-[#6842FF]">Ver más</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de ejercicios - SCROLLABLE */}
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 90 }}
      >
        {selectedEntrenamiento.ejercicios.map((ejercicio, idx) => (
          <EjercicioCard
            key={idx}
            imagen={imagesMap[ejercicio.ejercicioId.imagen]}
            label={ejercicio.ejercicioId.nombre}
            tiempoTotal={ejercicio.tiempo}
          />
        ))}
      </ScrollView>

      {/* Botón de inicio - FIJO */}
      <View 
        className={`absolute bottom-0 left-0 right-0 py-4 px-6 border-t shadow-lg ${
          isDarkMode 
            ? 'bg-[#121212] border-gray-700' 
            : 'bg-[#EFEEE9] border-gray-300'
        }`}
      >
        <TouchableOpacity
          className="bg-[#6842FF] py-4 rounded-full items-center"
          onPress={handleStart}
          activeOpacity={0.8}
        >
          <Text className="text-white text-base font-semibold">
            INICIAR ENTRENAMIENTO
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
