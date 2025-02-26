// app/(entrenar)/entrenamientosFav.tsx

import { View, TouchableOpacity, ScrollView } from "react-native";
import React from "react";

import { IEntrenamiento, useEntrenamientos } from "@/context/EntrenamientosContext";
import { useUser } from "@/context/UsersContext";

import EntrenamientoCard from "@/components/dashboard/EntrenamientoCard";
import TopNavbar from "@/components/TopNavbar";
import { router } from "expo-router";

export default function EntrenamientosFav() {
  const { entrenamientos, setSelectedEntrenamiento } = useEntrenamientos();
  const { user } = useUser();

  const entrenamientosFav = entrenamientos.filter((entrenamiento) =>
    user?.favs.includes(entrenamiento._id),
  );

  const entrenamientoSeleccionado = (entrenamiento: IEntrenamiento) => {
    setSelectedEntrenamiento(entrenamiento);
    router.push("/(entrenar)/detallesDeEntrenamiento");
  };

  return (
    <View className="flex-col items-center justify-around h-full bg-[#121212] pt-4">
      <View className="w-full px-2">
        <TopNavbar iconBack={true} titulo="Entrenamientos favoritos" />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-row flex-wrap h-full justify-start mx-1">
          {entrenamientosFav.map((item, idx) => (
            <TouchableOpacity
              key={idx} 
              className="w-1/2 p-3 items-center"
              onPress={() => entrenamientoSeleccionado(item)}
            >
              <EntrenamientoCard tipo="Card Grid" entrenamiento={item} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
