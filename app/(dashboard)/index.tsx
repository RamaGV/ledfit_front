// app/(dashboard)/index.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";

import { useEntrenamientos } from "@/context/EntrenamientosContext";
import { useUser } from "@/context/UsersContext";

import type { IEntrenamiento } from "@/context/EntrenamientosContext";

import EntrenamientoCard from "@/components/dashboard/EntrenamientoCard";
import NivelButton from "@/components/dashboard/NivelButton";
import TopNavbar from "@/components/TopNavbar";

export default function HomeScreen() {
  const { entrenamientos, setSelectedEntrenamiento } = useEntrenamientos();
  const { user } = useUser();

  const [filtroPorNivel, setFiltroPorNivel] = useState("Principiante");

  const niveles = ["Principiante", "Intermedio", "Avanzado"];

  const entrenamientoSeleccionado = (entrenamiento: IEntrenamiento) => {
    setSelectedEntrenamiento(entrenamiento);
    router.push("/(entrenar)/detallesDeEntrenamiento");
  };

  return (
    <View className="flex-col items-center justify-around pt-4 h-full bg-[#121212]">
      <View className="w-full px-4">
        <TopNavbar logo={true} iconNotif={true} iconFav={true} />
      </View>

      <Text className="w-full text-white text-2xl font-semibold p-2 px-4">
        Hola, {user?.name} 👋
      </Text>

      {/* Sección "Mis entrenamientos" */}
      <View className="w-full flex-row items-center justify-between pt-2 px-4">
        <Text className="text-white text-lg">Mis entrenamientos</Text>
        <TouchableOpacity
          onPress={() => {
            router.push(`/(entrenar)/entrenamientosFav`);
          }}
        >
          <Text className="text-[#6842FF] text-sm">Ver más</Text>
        </TouchableOpacity>
      </View>

      <View className="w-full">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {entrenamientos.map((unEntrenamiento, idx) => (
            <TouchableOpacity
              key={unEntrenamiento._id || idx}
              className="m-3"
              onPress={() => entrenamientoSeleccionado(unEntrenamiento)}
            >
              <EntrenamientoCard
                key={unEntrenamiento._id || idx}
                tipo="Card Grande"
                entrenamiento={unEntrenamiento}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Sección "Niveles" */}
      <View className="w-full flex-row items-center justify-between px-4">
        <Text className="text-white text-lg font-semibold">Niveles</Text>
        <Pressable
          onPress={() => {
            // router.push(`/entrenamientosPorNivel`);
          }}
        >
          <Text className="text-[#6842FF] text-sm">Ver más</Text>
        </Pressable>
      </View>

      {/* Fila de botones */}
      <View className="w-full flex-row items-center justify-around py-2 px-4">
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

      {/* Lista de entrenamientos filtrados por nivel */}
      <View className="flex-1 flex-col items-center justify-center py-1">
        <ScrollView showsVerticalScrollIndicator={false}>
          {entrenamientos
            .filter((entrenamientoFiltrado) => entrenamientoFiltrado.nivel === filtroPorNivel)
            .map((unEntrenamiento, idx) => (
              <TouchableOpacity
                key={unEntrenamiento._id || idx}
                className="py-2"
                onPress={() => entrenamientoSeleccionado(unEntrenamiento)}
              >
                <EntrenamientoCard
                  key={unEntrenamiento._id || idx}
                  tipo="Card Chica"
                  entrenamiento={unEntrenamiento}
                />
              </TouchableOpacity>
            ))}
        </ScrollView>
      </View>
    </View>
  );
}
