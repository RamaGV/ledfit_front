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
    <View className="flex-1 bg-[#121212] p-3">
      <TopNavbar iconBack={true} titulo="Rondas" />

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 pt-4">
        {selectedEntrenamiento?.ejercicios.map((ejercicio, idx) => (
          <EjercicioCard
            key={idx}
            imagen={imagesMap[ejercicio.imagen]}
            label={ejercicio.nombre}
            tiempoTotal={ejercicio.tiempo}
          />
        ))}
      </ScrollView>
    </View>
  );
}
