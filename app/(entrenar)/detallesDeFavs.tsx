// app/(entrenar)/entrenamientosFav.tsx

import { View, TouchableOpacity, ScrollView, Text } from "react-native";
import React, { useState } from "react";
import { Image } from "expo-image";
import { router } from "expo-router";

import {
  IEntrenamiento,
  useEntrenamientos,
} from "../../context/EntrenamientosContext";
import { useUser } from "../../context/UsersContext";
import { useTheme } from "../../context/ThemeContext";

import EntrenamientoCard from "../../components/dashboard/EntrenamientoCard";
import TopNavbar from "../../components/TopNavbar";

export default function EntrenamientosFav() {
  const { entrenamientos, setSelectedEntrenamiento } = useEntrenamientos();
  const { user } = useUser();
  const { isDarkMode } = useTheme();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const entrenamientosFav = entrenamientos.filter((entrenamiento) =>
    user?.favs.includes(entrenamiento._id),
  );

  const entrenamientoSeleccionado = (entrenamiento: IEntrenamiento) => {
    setSelectedEntrenamiento(entrenamiento);
    router.push("/(entrenar)/detallesDeEntrenamiento");
  };

  // Render empty state if no favorites
  if (entrenamientosFav.length === 0) {
    return (
      <View
        className={`flex-1 ${isDarkMode ? "bg-[#121212]" : "bg-[#EFEEE9]"}`}
      >
        <TopNavbar iconBack={true} titulo="Entrenamientos favoritos" />

        <View className="flex-1 items-center justify-center px-6">
          <Image
            source={require("@/assets/icons/iconFavTrue.png")}
            contentFit="contain"
            className="w-20 h-20 mb-5 opacity-60"
            style={{ tintColor: isDarkMode ? "#444444" : "#999999" }}
          />
          <Text
            className={`text-xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-[#333333]"}`}
          >
            No tienes favoritos
          </Text>
          <Text
            className={`text-center mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            Agrega entrenamientos a tus favoritos para acceder rápidamente a
            ellos
          </Text>
          <TouchableOpacity
            className="bg-[#6842FF] py-3 px-6 rounded-full"
            onPress={() => router.push("/(dashboard)")}
          >
            <Text className="text-white font-semibold">
              Explorar entrenamientos
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className={`flex-1 ${isDarkMode ? "bg-[#121212]" : "bg-[#EFEEE9]"}`}>
      <TopNavbar iconBack={true} titulo="Entrenamientos favoritos" />

      {/* View mode toggle */}
      <View className="flex-row justify-end px-4 mb-2">
        <View
          className={`flex-row rounded-lg overflow-hidden ${isDarkMode ? "bg-[#1E1E1E]" : "bg-white"}`}
        >
          <TouchableOpacity
            className={`px-4 py-2 ${viewMode === "grid" ? "bg-[#6842FF]" : "bg-transparent"}`}
            onPress={() => setViewMode("grid")}
          >
            <Text
              className={`font-bold ${viewMode === "grid" ? "text-white" : isDarkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              Grid
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-4 py-2 ${viewMode === "list" ? "bg-[#6842FF]" : "bg-transparent"}`}
            onPress={() => setViewMode("list")}
          >
            <Text
              className={`font-bold ${viewMode === "list" ? "text-white" : isDarkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              Lista
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-2"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {viewMode === "grid" ? (
          <View className="flex-row flex-wrap">
            {entrenamientosFav.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                className="w-1/2 p-2"
                onPress={() => entrenamientoSeleccionado(item)}
              >
                <EntrenamientoCard tipo="Card Grid" entrenamiento={item} />
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View className="flex-col">
            {entrenamientosFav.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                className="w-full px-2 py-1 mb-3"
                onPress={() => entrenamientoSeleccionado(item)}
              >
                <EntrenamientoCard tipo="Card Chica" entrenamiento={item} />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
