// app/(entrenar)/detallesDeEjercicios.tsx

import { View, ScrollView } from "react-native";
import React from "react";

import { useEntrenamientos } from "@/context/EntrenamientosContext";
import { useImagesMap } from "@/context/ImagesMapContext";

import EjercicioCard from "@/components/entrenar/EjercicioCard";

import TopNavbar from "@/components/TopNavbar";

export default function DetallesDeEjercicios() {
  const { selectedEntrenamiento } = useEntrenamientos();
  const { imagesMap } = useImagesMap();

  return (
    <View className="flex-1 bg-[#121212] pt-4 h-full">
      <TopNavbar iconBack={true} titulo="Rondas" />

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
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
