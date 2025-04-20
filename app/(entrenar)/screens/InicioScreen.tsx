// app/(entrenar)/screens/InicioScreen.tsx

import { View, Text, TouchableOpacity, Animated } from "react-native";
import React, { useEffect, useRef, useMemo, useState } from "react";
import { useTheme } from "../../../context/ThemeContext";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface InicioScreenProps {
  onIniciar: () => void;
  nombreEntrenamiento: string;
  totalEjercicios: number;
  tiempoEstimado: number;
}

export default function InicioScreen({
  onIniciar,
  nombreEntrenamiento,
  totalEjercicios,
  tiempoEstimado,
}: InicioScreenProps) {
  const [contador, setContador] = useState(3);
  const { isDarkMode } = useTheme();

  const pulseAnim = useRef(new Animated.Value(1)).current;

  const tiempoTotalFormateado = useMemo(() => {
    const minutes = Math.floor(tiempoEstimado / 60);
    const seconds = tiempoEstimado % 60;
    return `${minutes}m ${seconds}s`;
  }, [tiempoEstimado]);

  const caloriasTotalEstimadas = useMemo(() => {
    return Math.round(tiempoEstimado * 0.15 * totalEjercicios);
  }, [tiempoEstimado, totalEjercicios]);

  useEffect(() => {
    if (contador <= 0) {
      onIniciar();
      return;
    }

    const intervalId = setInterval(() => {
      setContador((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [contador, onIniciar]);

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
      ]),
    ).start();
    return () => pulseAnim.stopAnimation();
  }, [pulseAnim]);

  return (
    <View
      className={`flex-1 px-5 pt-8 ${isDarkMode ? "bg-[#121212]" : "bg-white"}`}
    >
      <LinearGradient
        colors={["#8C6EFF", "#6842FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="w-full rounded-2xl p-6 mb-6"
      >
        <Text className="text-white font-bold text-2xl text-center">
          {nombreEntrenamiento}
        </Text>
        <Text className="text-white text-center mt-1 opacity-80">
          Prepárate para comenzar
        </Text>
      </LinearGradient>

      <View className="w-full items-center my-auto">
        <Text className="text-gray-500 mb-2">Comenzando en</Text>
        <Animated.View
          className="transform"
          style={{ transform: [{ scale: pulseAnim }] }}
        >
          <Text className={`text-8xl font-bold text-[#6842FF]`}>
            {contador}
          </Text>
        </Animated.View>
      </View>

      <View className="flex-row justify-between w-full mb-10">
        <View
          className={`items-center p-4 rounded-xl flex-1 mx-1 ${isDarkMode ? "bg-[#1E1E1E]" : "bg-gray-100"}`}
        >
          <Ionicons name="time-outline" size={22} color="#6842FF" />
          <Text
            className={`font-bold text-lg mt-1 ${isDarkMode ? "text-white" : "text-black"}`}
          >
            {tiempoTotalFormateado}
          </Text>
          <Text className="text-gray-500 text-xs">Duración</Text>
        </View>

        <View
          className={`items-center p-4 rounded-xl flex-1 mx-1 ${isDarkMode ? "bg-[#1E1E1E]" : "bg-gray-100"}`}
        >
          <Ionicons name="fitness-outline" size={22} color="#6842FF" />
          <Text
            className={`font-bold text-lg mt-1 ${isDarkMode ? "text-white" : "text-black"}`}
          >
            {totalEjercicios}
          </Text>
          <Text className="text-gray-500 text-xs">Ejercicios</Text>
        </View>

        <View
          className={`items-center p-4 rounded-xl flex-1 mx-1 ${isDarkMode ? "bg-[#1E1E1E]" : "bg-gray-100"}`}
        >
          <Ionicons name="flame-outline" size={22} color="#FF5757" />
          <Text
            className={`font-bold text-lg mt-1 ${isDarkMode ? "text-white" : "text-black"}`}
          >
            {caloriasTotalEstimadas}
          </Text>
          <Text className="text-gray-500 text-xs">Calorías (est)</Text>
        </View>
      </View>
    </View>
  );
}
