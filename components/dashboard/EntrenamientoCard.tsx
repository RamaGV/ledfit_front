// components/dashboard/EntrenamientoCard.tsx

import { Text, View, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect } from "react";
import { Image } from "expo-image";

import type { IEntrenamiento } from "@/context/EntrenamientosContext";
import { useTheme } from "@/context/ThemeContext";

import { calcularTiempo } from "@/utils/utilsEntrenamientos";
import { useImagesMap } from "@/context/ImagesMapContext";
import { useUser } from "@/context/UsersContext";

type EntrenamientoCardProps = {
  tipo: "Card Chica" | "Card Grande" | "Card Grid";
  entrenamiento: IEntrenamiento;
  onPress?: () => void;
};

export default function EntrenamientoCard({
  entrenamiento: unEntrenamiento,
  tipo,
  onPress,
}: EntrenamientoCardProps) {
  const { user, addFav, removeFav } = useUser();
  const { imagesMap } = useImagesMap();
  const { colors, isDarkMode } = useTheme();

  // Estado local para el ícono de favorito
  const [favIcon, setFavIcon] = useState(
    require("@/assets/icons/iconFavFalse.png"),
  );

  // Actualiza el ícono según los favoritos del usuario
  useEffect(() => {
    if (user?.favs.includes(unEntrenamiento._id)) {
      setFavIcon(require("@/assets/icons/iconFavTrue.png"));
    } else {
      setFavIcon(require("@/assets/icons/iconFavFalse.png"));
    }
  }, [user?.favs, unEntrenamiento._id]);

  function handleFav() {
    if (
      user &&
      user.favs &&
      user.favs
        .map((fav) => fav.toString())
        .includes(unEntrenamiento._id.toString())
    ) {
      console.log("Llamando a removeFav");
      removeFav(unEntrenamiento._id);
    } else {
      console.log("Llamando a addFav");
      addFav(unEntrenamiento._id);
    }
  }

  // Configurar clases de tailwind según el tipo de tarjeta
  let cardClasses = "rounded-3xl overflow-hidden shadow-lg relative";
  let nombreClasses = "font-bold text-white";
  
  // Configurar tamaños según el tipo
  if (tipo === "Card Chica") {
    cardClasses += " w-full h-[100px]";
    nombreClasses += " text-[16px]";
  } else if (tipo === "Card Grande") {
    cardClasses += " w-[240px] h-[240px]";
    nombreClasses += " text-[20px]";
  } else if (tipo === "Card Grid") {
    cardClasses += " w-full h-[150px]";
    nombreClasses += " text-[14px]";
  }

  return (
    <TouchableOpacity 
      activeOpacity={0.9}
      className={`my-2 ${cardClasses}`}
      onPress={onPress}
    >
      <Image
        className="absolute w-full h-full rounded-3xl"
        source={imagesMap[unEntrenamiento.imagen]}
        contentFit="cover"
        transition={300}
      />
      <LinearGradient
        className="absolute w-full h-full"
        locations={[0, 0.17, 0.27, 0.42, 0.53, 0.66, 0.8, 1]}
        colors={[
          "rgba(75, 75, 75, 0)",
          "rgba(68, 68, 68, 0.1)",
          "rgba(64, 64, 64, 0.2)",
          "rgba(58, 58, 58, 0.3)",
          "rgba(54, 54, 54, 0.4)",
          "rgba(47, 47, 47, 0.5)",
          "rgba(41, 41, 41, 0.6)",
          "rgba(32, 32, 32, 0.9)",
        ]}
      />
      <View className="absolute bottom-0 w-full p-4 flex-col">
        <Text
          className={nombreClasses}
          numberOfLines={1}
        >
          {unEntrenamiento.nombre}
        </Text>
        <View className="flex-row items-center justify-between w-full mt-1">
          <View className="flex-row items-center gap-1 w-2/3">
            <Text className="text-white text-xs">
              {calcularTiempo(unEntrenamiento.tiempoTotal)} min.
            </Text>
            <View className="border-r border-gray-400 h-2.5" />
            <Text className="text-white text-xs">
              {unEntrenamiento.nivel}
            </Text>
          </View>
          <TouchableOpacity 
            onPress={(e) => {
              e.stopPropagation(); // Evitar que el evento se propague al TouchableOpacity padre
              handleFav();
            }}
            className="ml-auto"
          >
            <Image
              className="w-6 h-6"
              source={favIcon}
              contentFit="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}
