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

import type { IEntrenamiento } from "@/context/EntrenamientosContext";

import EntrenamientoCard from "@/components/dashboard/EntrenamientoCard";
import NivelButton from "@/components/dashboard/NivelButton";
import TopNavbar from "@/components/TopNavbar";

export default function HomeScreen() {
  const { entrenamientos, setSelectedEntrenamiento } = useEntrenamientos();

  const [filtroPorNivel, setFiltroPorNivel] = useState("Principiante");

  const niveles = ["Principiante", "Intermedio", "Avanzado"];

  const entrenamientoSeleccionado = (entrenamiento: IEntrenamiento) => {
    setSelectedEntrenamiento(entrenamiento);
    router.push("/(entrenar)/detallesDeEntrenamiento");
  };

  return (
    <View className="flex-1 bg-[#121212] p-3">
      <TopNavbar logo={true} iconNotif={true} iconFav={true} />
      <Text className="text-white text-2xl font-semibold p-2">
        Hola, Rama 👋
      </Text>

      <View className="flex-row items-center justify-between pt-2 px-2">
        <Text className="text-white text-lg">Mis entrenamientos</Text>
        <TouchableOpacity
          onPress={() => {
            // router.push(`/(entrenar)/mis-entrenamientos`);
          }}
        >
          <Text className="text-[#7B61FF] text-sm">Ver más</Text>
        </TouchableOpacity>
      </View>

      <View>
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
      <View className="flex-row items-center justify-between">
        <Text className="text-white text-lg font-semibold">Niveles</Text>
        <Pressable
          onPress={() => {
            // router.push(`/entrenamientosPorNivel`);
          }}
        >
          <Text className="text-[#7B61FF] text-sm">Ver más</Text>
        </Pressable>
      </View>
      <View className="flex-row items-center justify-around py-2">
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
