// app/(entrenar)/detallesDeEntrenamiento.tsx

import {
  View,
  Text,
  ScrollView,
  Pressable,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";

import { useEntrenamientos } from "../../context/EntrenamientosContext";
import { useTheme } from "../../context/ThemeContext";

import EjercicioCard from "../../components/entrenar/EjercicioCard";
import NeumorphicButton from "../../components/ui/NeumorphicButton";
import { calcularTiempo } from "../../utils/utilsEntrenamientos";

// ID del ejercicio de descanso en la base de datos
const DESCANSO_ID = "67bc1a7372e1e0091651e944";

export default function DetallesDeEntrenamiento() {
  const router = useRouter();
  const { selectedEntrenamiento } = useEntrenamientos();
  const { isDarkMode, colors } = useTheme();
  const [ejerciciosReales, setEjerciciosReales] = useState<number>(0);

  // Verificar que existe un entrenamiento seleccionado
  useEffect(() => {
    if (!selectedEntrenamiento) {
      router.replace("/(dashboard)");
    } else {
      console.log(
        "[Frontend Log - detallesDeEntrenamiento] Received selectedEntrenamiento:",
        JSON.stringify(selectedEntrenamiento, null, 2),
      );
      // Contar ejercicios reales (no descansos)
      const reales = selectedEntrenamiento.ejercicios.filter(
        (ejercicio) => ejercicio.ejercicioId._id !== DESCANSO_ID,
      ).length;
      setEjerciciosReales(reales);
    }
  }, [selectedEntrenamiento]);

  const handleStart = () => {
    router.push("/(entrenar)/entrenar");
  };

  // Verificar y loguear la URL justo antes de usarla
  const imageUrl = selectedEntrenamiento?.imagen;
  console.log(
    "[Frontend Log - detallesDeEntrenamiento] Image URL to be used:",
    imageUrl,
  );
  const mainImage = imageUrl
    ? { uri: imageUrl }
    : require("@/assets/images/icon.png");

  if (!selectedEntrenamiento) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: colors.background }}
      >
        <Text className="text-base" style={{ color: colors.text }}>
          Cargando entrenamiento...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
    >
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      {/* Header con imagen y gradiente */}
      <View className="h-[300px] w-full relative">
        <Image
          source={mainImage}
          className="w-full h-full"
          contentFit="cover"
          placeholder={require("@/assets/images/icon.png")}
        />
        <LinearGradient
          colors={["rgba(0,0,0,0.7)", "transparent", "rgba(0,0,0,0.5)"]}
          className="absolute inset-0"
        />

        {/* Botón de retroceso */}
        <Pressable
          className="absolute top-4 left-4 bg-black/30 rounded-full p-2 z-10"
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={26} color="#FFFFFF" />
        </Pressable>

        {/* Información superpuesta en la imagen */}
        <View className="absolute bottom-0 left-0 right-0 p-5">
          <Text className="text-2xl font-bold text-white mb-2">
            {selectedEntrenamiento.nombre}
          </Text>

          {/* Nivel de entrenamiento destacado */}
          <View className="mb-3">
            <Text className="text-white text-xs font-bold bg-[#6842FF] py-1 px-3 rounded-full self-start">
              {selectedEntrenamiento.nivel}
            </Text>
          </View>

          {/* Chips de información en una fila */}
          <View className="flex-row items-center space-x-2">
            <View className="flex-row items-center bg-black/50 py-1.5 px-3 rounded-full">
              <MaterialCommunityIcons
                name="dumbbell"
                size={16}
                color="#FFFFFF"
              />
              <Text className="text-white text-xs font-medium ml-1.5">
                {ejerciciosReales} ejercicios
              </Text>
            </View>

            <View className="flex-row items-center bg-black/50 py-1.5 px-3 rounded-full">
              <MaterialCommunityIcons
                name="clock-outline"
                size={16}
                color="#FFFFFF"
              />
              <Text className="text-white text-xs font-medium ml-1.5">
                {calcularTiempo(selectedEntrenamiento.tiempoTotal)} min
              </Text>
            </View>

            <View className="flex-row items-center bg-black/50 py-1.5 px-3 rounded-full">
              <MaterialCommunityIcons name="fire" size={16} color="#FFFFFF" />
              <Text className="text-white text-xs font-medium ml-1.5">
                {selectedEntrenamiento.calorias} cal
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Encabezado de la sección de ejercicios */}
      <View
        className={`flex-row items-center justify-between py-4 px-5 border-b ${
          isDarkMode ? "border-gray-700" : "border-gray-300"
        }`}
      >
        <View>
          <Text
            className="text-lg font-semibold"
            style={{ color: colors.text }}
          >
            Ejercicios
          </Text>
          <Text style={{ color: colors.secondaryText, fontSize: 12 }}>
            {ejerciciosReales} ejercicios y{" "}
            {selectedEntrenamiento.ejercicios.length - ejerciciosReales}{" "}
            descansos
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push("/(entrenar)/detallesDeEjercicios")}
          className="bg-[#6842FF]/10 py-2 px-4 rounded-full flex-row items-center"
        >
          <Text className="text-[#6842FF] font-medium">Ver todos</Text>
          <Ionicons
            name="chevron-forward"
            size={16}
            color="#6842FF"
            style={{ marginLeft: 4 }}
          />
        </TouchableOpacity>
      </View>

      {/* Lista de ejercicios - SCROLLABLE */}
      <ScrollView
        className="flex-1 px-5 pt-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {selectedEntrenamiento.ejercicios.map((ejercicio, idx) => {
          const isDescanso = ejercicio.ejercicioId._id === DESCANSO_ID;

          return (
            <EjercicioCard
              key={idx}
              imagen={
                isDescanso
                  ? undefined
                  : ejercicio.ejercicioId.imagen
                    ? { uri: ejercicio.ejercicioId.imagen }
                    : {
                        uri: "https://ledfit.s3.sa-east-1.amazonaws.com/images/ejercicios/placeholder_workout.webp",
                      }
              }
              label={ejercicio.ejercicioId.nombre}
              tiempoTotal={ejercicio.tiempo}
              grupo={ejercicio.ejercicioId.grupo}
              descripcion={ejercicio.ejercicioId.descripcion}
              calorias={
                isDescanso
                  ? undefined
                  : ejercicio.ejercicioId.caloriasPorSegundo * ejercicio.tiempo
              }
              isDescanso={isDescanso}
              onPress={() => {
                // Navegar a detalles del ejercicio
                router.push({
                  pathname: "/(entrenar)/detallesDeEjercicios",
                  params: { ejercicioId: ejercicio.ejercicioId._id },
                });
              }}
            />
          );
        })}
      </ScrollView>

      {/* Botón de inicio - FIJO */}
      <View
        className={`absolute bottom-0 left-0 right-0 py-4 px-5 border-t shadow-lg ${
          isDarkMode
            ? "bg-[#121212] border-gray-700"
            : "bg-[#EFEEE9] border-gray-300"
        }`}
      >
        <NeumorphicButton
          onPress={handleStart}
          text="INICIAR ENTRENAMIENTO"
          isPrimary={true}
          colors={colors}
          isDarkMode={isDarkMode}
          style={{ width: "100%" }}
        />
      </View>
    </SafeAreaView>
  );
}
