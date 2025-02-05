// app/(entrenar)/ejercicios.tsx

import { View, ScrollView } from "react-native";
import React, { useContext } from "react";

import { EntrenamientosContext } from "@/context/EntrenamientosContext";

import EjercicioCard from "@/components/entrenar/EjercicioCard";

import TopNavbar from "@/components/TopNavbar";

export default function DetallesDeEjercicios() {
  const { selectedEntrenamiento } = useContext(EntrenamientosContext);

  return (
    <View className="flex-1 bg-[#121212] pt-2 px-6">
      <TopNavbar iconBack={true} titulo="Ejercicios" />

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 pt-4">
        {selectedEntrenamiento?.ejercicios.map((ejercicio, idx) => {
          const imagen = `@/assets/ejercicios/${ejercicio.imagen}.webp`;
          console.log(imagen);

          return (
            <EjercicioCard
              key={idx}
              imagen={require(imagen)}
              label={ejercicio.nombre}
              tiempoTotal={ejercicio.tiempo}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}
// "@/assets/exercises/defaultExercise.png"
// imagen={require(`@/assets/ejercicios/${ejercicio.imagen}.webp`)}
