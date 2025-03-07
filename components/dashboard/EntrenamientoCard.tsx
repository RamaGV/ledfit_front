// components/dashboard/EntrenamientoCard.tsx

import { Text, View, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect } from "react";

import type { IEntrenamiento } from "@/context/EntrenamientosContext";

import { calcularTiempo } from "@/utils/utilsEntrenamientos";
import { useImagesMap } from "@/context/ImagesMapContext";
import { useUser } from "@/context/UsersContext";

type EntrenamientoCardProps = {
  tipo: "Card Chica" | "Card Grande" | "Card Grid";
  entrenamiento: IEntrenamiento;
};

export default function EntrenamientoCard({
  entrenamiento: unEntrenamiento,
  tipo,
}: EntrenamientoCardProps) {
  const { user, addFav, removeFav } = useUser();
  const { imagesMap } = useImagesMap();

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

  let cardContainer = "overflow-hidden rounded-3xl";
  if (tipo === "Card Chica") {
    cardContainer += " w-full h-[100px]";
  } else if (tipo === "Card Grande") {
    cardContainer += " w-[240px] h-[240px]";
  } else if (tipo === "Card Grid") {
    cardContainer += " w-full h-[150px]";
  }

  let nombreStyle = "text-white font-bold";
  if (tipo === "Card Chica") {
    nombreStyle = "text-[16px]";
  } else if (tipo === "Card Grande") {
    nombreStyle = "text-[20px]";
  } else if (tipo === "Card Grid") {
    nombreStyle = "text-[13px]";
  }

  return (
    <View className={cardContainer}>
      <Image
        className="overflow-hidden rounded-3xl"
        style={{ position: "absolute", width: "100%", height: "100%" }}
        source={imagesMap[unEntrenamiento.imagen]}
        resizeMode="cover"
      />
      <LinearGradient
        style={{ position: "absolute", width: "100%", height: "100%" }}
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
      <View className="flex-1 flex-col gap-1 absolute bottom-0 w-full px-4 pb-4">
        <Text
          className={nombreStyle}
          style={{ fontWeight: "bold", color: "white" }}
          numberOfLines={1}
        >
          {unEntrenamiento.nombre}
        </Text>
        <View className="flex-row gap-1 items-center w-full">
          <View className="flex-row gap-1 justify-around w-1/3">
            <Text className="text-white text-[12px]">
              {calcularTiempo(unEntrenamiento.tiempoTotal)} min.
            </Text>
            <View className="border-r border-gray-400" />
            <Text className="text-white text-[12px]">
              {unEntrenamiento.nivel}
            </Text>
          </View>
          <View className="flex-1">
            <TouchableOpacity onPress={handleFav}>
              <Image
                className="w-6 h-6 ml-auto"
                source={favIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
