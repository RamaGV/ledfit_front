// app/bookmark.tsx
import React, { useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import EntrenamientoCard from "@/components/dashboard/EntrenamientoCard";
import { useContext } from "react";
import { EntrenamientosContext } from "@/context/EntrenamientosContext";
import { ImagesMapContext } from "@/context/ImagesMapContext";

export default function BookmarkScreen() {
  const { imagesMap } = React.useContext(ImagesMapContext);
  const { entrenamientos: workouts } = useContext(EntrenamientosContext);
  const [isGrid, setIsGrid] = useState(true);
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#121212] pt-10 px-4">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-5">
        <View className="flex-row items-center">
          <Pressable onPress={() => router.back()} className="mr-3">
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </Pressable>
          <Text className="text-white text-xl font-semibold">
            Mis Entrenamientos
          </Text>
        </View>
        <View className="flex-row">
          <Pressable onPress={() => setIsGrid(false)} className="mr-3">
            <Ionicons
              name="list"
              size={24}
              color={isGrid ? "#888" : "#7B61FF"}
            />
          </Pressable>
          <Pressable onPress={() => setIsGrid(true)}>
            <Ionicons
              name="grid"
              size={24}
              color={isGrid ? "#7B61FF" : "#888"}
            />
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {isGrid ? (
          /* Vista en grid: 2 columnas */
          <View className="flex-row flex-wrap justify-between">
            {workouts.map((item, idx) => (
              <View key={idx} className="mb-6">
                <EntrenamientoCard
                  nombra={item.nombre}
                  tiempoTotal={item.tiempoTotal}
                  imagen={imagesMap[item.imagen]}
                  isBookmarked={item.isBookmarked}
                  tipo="Card Grid"
                />
              </View>
            ))}
          </View>
        ) : (
          /* Vista en lista: una columna */
          <View>
            {workouts.map((item, idx) => (
              <View
                key={idx}
                className="flex-row flex-wrap justify-center mb-5"
              >
                <EntrenamientoCard
                  nombra={item.nombre}
                  tiempoTotal={item.tiempoTotal}
                  nivel={item.nivel}
                  imagen={imagesMap[item.imagen]}
                  isBookmarked={item.isBookmarked}
                  tipo="Card Chica"
                />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
