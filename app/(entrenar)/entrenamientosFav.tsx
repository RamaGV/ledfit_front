// app/(entrenar)/entrenamientosFav.tsx

import { View, ScrollView } from "react-native";
import React from "react";

import { useEntrenamientos } from "@/context/EntrenamientosContext";
import { useUser } from "@/context/UsersContext";

import EntrenamientoCard from "@/components/dashboard/EntrenamientoCard";
import TopNavbar from "@/components/TopNavbar";

export default function EntrenamientosFav() {
  const { entrenamientos } = useEntrenamientos();
  const { user } = useUser();

  const entrenamientosFav = entrenamientos.filter((entrenamiento) =>
    user?.favs.includes(entrenamiento._id),
  );

  return (
    <View className="flex-col h-full bg-[#121212] p-3">
      <TopNavbar iconBack={true} titulo="Entrenamientos favoritos" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-row flex-wrap pt-4 justify-start">
          {entrenamientosFav.map((item, idx) => (
            <View key={idx} className="w-1/2 p-2">
              <EntrenamientoCard tipo="Card Grid" entrenamiento={item} />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
