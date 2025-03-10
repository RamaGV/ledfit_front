// app/(entrenar)/detallesDeEjercicios.tsx

import { View, ScrollView } from "react-native";
import React from "react";

import { useEntrenamientos } from "@/context/EntrenamientosContext";
import { useImagesMap } from "@/context/ImagesMapContext";
import { useTheme } from "@/context/ThemeContext";

import EjercicioCard from "@/components/entrenar/EjercicioCard";
import TopNavbar from "@/components/TopNavbar";

export default function DetallesDeEjercicios() {
  const { selectedEntrenamiento } = useEntrenamientos();
  const { imagesMap } = useImagesMap();
  const { isDarkMode } = useTheme();

  return (
    <View className={`flex-1 ${isDarkMode ? 'bg-[#121212]' : 'bg-[#EFEEE9]'}`}>
      <TopNavbar iconBack={true} titulo="Rondas" />

      <ScrollView 
        className="flex-1 px-6" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {selectedEntrenamiento?.ejercicios.map((ejercicio, idx) => (
          <EjercicioCard
            key={idx}
            imagen={imagesMap[ejercicio.ejercicioId.imagen]}
            label={ejercicio.ejercicioId.nombre}
            tiempoTotal={ejercicio.tiempo}
          />
        ))}
      </ScrollView>
    </View>
  );
}
