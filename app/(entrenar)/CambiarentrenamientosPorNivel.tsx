// app/(dashboard)/entrenamientosPorNivel.tsx

import React, { useState, useContext } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";

import { EntrenamientosContext } from "@/context/EntrenamientosContext";

import EntrenamientoCard from "@/components/dashboard/EntrenamientoCard";
import NivelButton from "@/components/dashboard/NivelButton";
import TopNavbar from "@/components/TopNavbar";

export default function EntrenamientosPorNivel() {
  const { entrenamientos } = useContext(EntrenamientosContext);

  const [filtroPorNivel, setFiltroPorNivel] = useState("principiante");

  const niveles = ["Principiante", "Intermedio", "Avanzado"];

  return (
    <View className="flex-1 bg-[#121212]">
      <TopNavbar iconBack={true} titulo="Entrenamientos por nivel" />
      <View className="px-3 flex-1">
        <View className="flex-row items-center justify-around py-3">
          {niveles.map((nivel) => {
            const isActive = nivel === filtroPorNivel;

            return (
              <NivelButton
                key={nivel}
                label={nivel}
                onPress={() => setFiltroPorNivel(nivel)}
                isActive={isActive}
              />
            );
          })}
        </View>
        <View className="flex-1 flex-col items-center justify-center">
          <ScrollView showsVerticalScrollIndicator={false}>
            {entrenamientos
              .filter(
                (entrenamientoFiltrado) =>
                  entrenamientoFiltrado.nivel === filtroPorNivel,
              )
              .map((item, idx) => (
                <TouchableOpacity
                  key={item._id || idx}
                  className="py-2"
                  onPress={() => {}}
                >
                  <EntrenamientoCard
                    key={item._id || idx}
                    tipo="Card Chica"
                    entrenamiento={item}
                  />
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}
