// app/(dashboard)/index.tsx

import React, { useState, useEffect } from "react";
import { router } from "expo-router";
import {
  TouchableOpacity,
  ScrollView,
  View,
  Text,
  RefreshControl,
  ActivityIndicator,
  StatusBar,
  Dimensions,
} from "react-native";
import { Image } from 'expo-image';

import { useEntrenamientos, IEntrenamiento } from "@/context/EntrenamientosContext";
import { useUser } from "@/context/UsersContext";
import { useTheme } from "@/context/ThemeContext";

import EntrenamientoCard from "@/components/dashboard/EntrenamientoCard";
import NivelButton from "@/components/dashboard/NivelButton";
import TopNavbar from "@/components/TopNavbar";

export default function HomeScreen() {
  const { entrenamientos, setSelectedEntrenamiento } = useEntrenamientos();
  const { user } = useUser();
  const { isDarkMode } = useTheme();
  const [filtroPorNivel, setFiltroPorNivel] = useState("Principiante");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const screenHeight = Dimensions.get('window').height;

  const niveles = ["Principiante", "Intermedio", "Avanzado"];

  // Simulación de carga inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Aquí podrías recargar los datos si tuvieras una función para ello
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const entrenamientoSeleccionado = (entrenamiento: IEntrenamiento) => {
    setSelectedEntrenamiento(entrenamiento);
    router.push("/(entrenar)/entrenamientos");
  };

  // Filtrado por nivel
  const entrenamientosFiltrados = entrenamientos.filter(
    (entrenamiento) => entrenamiento.nivel === filtroPorNivel
  );

  // Destacados (usando algún criterio para destacar, como entrenamientos con más calorías)
  const entrenamientosDestacados = entrenamientos
    .sort((a, b) => b.calorias - a.calorias)
    .slice(0, 3); // Los 3 con más calorías

  if (loading) {
    return (
      <View className={`flex-1 items-center justify-center ${isDarkMode ? 'bg-[#121212]' : 'bg-[#EFEEE9]'}`}>
        <ActivityIndicator size="large" color="#6842FF" />
      </View>
    );
  }

  return (
    <View className={`flex-1 ${isDarkMode ? 'bg-[#121212]' : 'bg-[#EFEEE9]'}`}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      
      {/* TopNavbar ahora incluye cálculos de padding automáticos */}
      <TopNavbar logo={true} iconNotif={true} iconFav={true} />

      {/* CONTENIDO FIJO - Fuera del ScrollView */}
      <View>
        {/* Encabezado con saludo */}
        <View className="px-5 pb-2">
          <Text className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-[#333333]'}`}>
            ¡Hola, {user?.name || "Usuario"}!
          </Text>
          <Text className={`text-base mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            ¿Listo para tu entrenamiento de hoy?
          </Text>
        </View>

        {/* Destacados */}
        <Text className={`text-lg font-bold px-5 mt-2 mb-3 ${isDarkMode ? 'text-white' : 'text-[#333333]'}`}>
          Destacados
        </Text>
        
        {/* ScrollView HORIZONTAL (se mantiene) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="pl-5"
          contentContainerStyle={{ gap: 16, paddingRight: 20 }}
        >
          {entrenamientosDestacados.map((entrenamiento) => (
            <TouchableOpacity
              key={entrenamiento._id}
              onPress={() => entrenamientoSeleccionado(entrenamiento)}
            >
              <EntrenamientoCard
                entrenamiento={entrenamiento}
                tipo="Card Grande"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Botones de nivel */}
        <View className="flex-row justify-around items-center py-3 mt-1">
          {niveles.map((nivel) => (
            <NivelButton
              key={nivel}
              label={nivel}
              isActive={nivel === filtroPorNivel}
              onPress={() => setFiltroPorNivel(nivel)}
            />
          ))}
        </View>
      </View>

      {/* ÁREA SCROLLABLE - SÓLO para los entrenamientos filtrados */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#6842FF"
            colors={["#6842FF"]} 
          />
        }
      >
        {/* Lista de entrenamientos por nivel - ÚNICO contenido scrollable vertical */}
        <View className="px-5 pb-10 pt-2">
          {entrenamientosFiltrados.length === 0 ? (
            <View className="items-center justify-center py-8">
              <Text className={`text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                No hay entrenamientos disponibles para este nivel
              </Text>
            </View>
          ) : (
            entrenamientosFiltrados.map((entrenamiento) => (
              <View key={entrenamiento._id} className="mb-4">
                <TouchableOpacity
                  onPress={() => entrenamientoSeleccionado(entrenamiento)}
                >
                  <EntrenamientoCard
                    entrenamiento={entrenamiento}
                    tipo="Card Chica"
                  />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
