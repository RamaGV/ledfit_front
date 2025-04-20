// app/(usuario)/informacion.tsx

import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useUser } from "../../context/UsersContext";
import { LinearGradient } from "expo-linear-gradient";

import TopNavbar from "../../components/TopNavbar";

export default function InformacionScreen() {
  const router = useRouter();
  const { user } = useUser();

  // Función para formatear el tiempo (de segundos a formato horas:minutos)
  const formatTiempo = (seconds: number) => {
    const horas = Math.floor(seconds / 3600);
    const minutos = Math.floor((seconds % 3600) / 60);
    return `${horas}h ${minutos}m`;
  };

  // Función para calcular el porcentaje de logros obtenidos
  const calcularPorcentajeLogros = () => {
    if (!user?.logros || user.logros.length === 0) return 0;

    const logrosObtenidos = user.logros.filter(
      (logro) => logro.obtenido,
    ).length;
    return Math.round((logrosObtenidos / user.logros.length) * 100);
  };

  return (
    <View className="flex-1 bg-[#121212]">
      <TopNavbar titulo="Información" />

      <ScrollView className="flex-1 px-4 pt-4">
        {/* Sección de estadísticas principales */}
        <View className="bg-[#1E1E1E] rounded-2xl p-5 mb-6">
          <Text className="text-white text-xl font-bold mb-4">
            Tus estadísticas
          </Text>

          <View className="flex-row justify-between mb-4">
            <View className="items-center">
              <View className="w-14 h-14 rounded-full bg-[#6842FF30] items-center justify-center mb-2">
                <Ionicons name="flame-outline" size={24} color="#FF4D4D" />
              </View>
              <Text className="text-white font-bold">
                {user?.caloriasQuemadas?.toLocaleString() || 0}
              </Text>
              <Text className="text-gray-400 text-xs">Calorías</Text>
            </View>

            <View className="items-center">
              <View className="w-14 h-14 rounded-full bg-[#6842FF30] items-center justify-center mb-2">
                <Ionicons name="time-outline" size={24} color="#6842FF" />
              </View>
              <Text className="text-white font-bold">
                {formatTiempo(user?.tiempoEntrenado || 0)}
              </Text>
              <Text className="text-gray-400 text-xs">Tiempo total</Text>
            </View>

            <View className="items-center">
              <View className="w-14 h-14 rounded-full bg-[#6842FF30] items-center justify-center mb-2">
                <Ionicons name="barbell-outline" size={24} color="#6842FF" />
              </View>
              <Text className="text-white font-bold">
                {user?.entrenamientosCompletos || 0}
              </Text>
              <Text className="text-gray-400 text-xs">Entrenamientos</Text>
            </View>
          </View>

          {/* Barra de progreso de logros */}
          <View className="mt-4">
            <View className="flex-row justify-between mb-2">
              <Text className="text-white font-semibold">
                Progreso de logros
              </Text>
              <Text className="text-white">{calcularPorcentajeLogros()}%</Text>
            </View>
            <View className="h-3 bg-[#1A1A1A] rounded-full overflow-hidden">
              <View
                className="h-3 bg-[#6842FF]"
                style={{ width: `${calcularPorcentajeLogros()}%` }}
              />
            </View>
          </View>
        </View>

        {/* Sección "Sobre Ledfit" */}
        <View className="bg-[#1E1E1E] rounded-2xl p-5 mb-6">
          <Text className="text-white text-xl font-bold mb-4">
            Sobre Ledfit
          </Text>

          <View className="items-center mb-6">
            <Image
              source={require("@/assets/vector.png")}
              style={{ width: 80, height: 80, marginBottom: 10 }}
            />
            <Text className="text-white text-lg font-bold">Ledfit</Text>
            <Text className="text-gray-400 text-sm">Versión 1.0.0</Text>
          </View>

          <Text className="text-gray-300 leading-5 mb-4">
            Ledfit es tu asistente personal de entrenamiento, diseñado para
            ayudarte a alcanzar tus metas fitness con entrenamientos
            personalizados, seguimiento de progreso y un sistema de logros para
            mantenerte motivado.
          </Text>

          <View className="bg-[#6842FF20] p-4 rounded-xl">
            <Text className="text-white font-semibold mb-2">¿Sabías que?</Text>
            <Text className="text-gray-300 leading-5">
              El ejercicio regular no solo mejora tu condición física, sino
              también tu salud mental, reduciendo el estrés y mejorando la
              calidad del sueño.
            </Text>
          </View>
        </View>

        {/* Sección de funcionalidades */}
        <View className="bg-[#1E1E1E] rounded-2xl p-5 mb-6">
          <Text className="text-white text-xl font-bold mb-4">
            Funcionalidades
          </Text>

          <FuncionalidadItem
            icono="barbell-outline"
            titulo="Entrenamientos personalizados"
            descripcion="Accede a entrenamientos diseñados para diferentes niveles y grupos musculares."
          />

          <FuncionalidadItem
            icono="heart-outline"
            titulo="Favoritos"
            descripcion="Guarda tus entrenamientos favoritos para acceder rápidamente a ellos."
          />

          <FuncionalidadItem
            icono="trophy-outline"
            titulo="Sistema de logros"
            descripcion="Desbloquea logros a medida que alcanzas nuevas metas de entrenamiento."
          />

          <FuncionalidadItem
            icono="analytics-outline"
            titulo="Seguimiento de progreso"
            descripcion="Visualiza tu avance con estadísticas de calorías quemadas y tiempo entrenado."
            ultimoItem
          />
        </View>

        {/* Botón para ir a logros */}
        <TouchableOpacity
          onPress={() => router.push("/(usuario)/logros")}
          className="mb-6"
        >
          <LinearGradient
            colors={["#6842FF", "#8A6FFF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="py-4 px-6 rounded-xl flex-row items-center justify-center"
          >
            <Ionicons name="medal" size={20} color="white" className="mr-2" />
            <Text className="text-white font-bold ml-2">Ver mis logros</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Información de contacto */}
        <View className="items-center mb-10">
          <Text className="text-gray-400 text-sm">© 2025 Ledfit</Text>
          <Text className="text-gray-500 text-xs mt-1">
            Desarrollado con ❤️ para ayudarte a mejorar
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

// Componente para cada item de funcionalidad
function FuncionalidadItem({
  icono,
  titulo,
  descripcion,
  ultimoItem = false,
}: {
  icono: string;
  titulo: string;
  descripcion: string;
  ultimoItem?: boolean;
}) {
  return (
    <View
      className={`flex-row mb-4 ${ultimoItem ? "" : "border-b border-[#ffffff10] pb-4"}`}
    >
      <View className="w-10 h-10 rounded-full bg-[#6842FF30] items-center justify-center mr-3">
        <Ionicons name={icono as any} size={20} color="#6842FF" />
      </View>
      <View className="flex-1">
        <Text className="text-white font-semibold mb-1">{titulo}</Text>
        <Text className="text-gray-400 text-sm">{descripcion}</Text>
      </View>
    </View>
  );
}
