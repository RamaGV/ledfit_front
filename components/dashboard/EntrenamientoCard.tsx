// components/EntrenamientoCard.tsx

import { Text, View, Image, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";

import type { IEntrenamiento } from "@/context/EntrenamientosContext";

export type EntrenamientoCardProps = {
  tipo: "Card Chica" | "Card Grande" | "Card Grid";
  entrenamiento: IEntrenamiento;
};

function calcularTiempo(tiempoTotal: number) {
  const m = Math.floor(tiempoTotal / 60);
  const s = tiempoTotal % 60;
  return `${m}:${s < 10 ? `0${s}` : s} min.`;
}

export default function EntrenamientoCard({
  entrenamiento: unEntrenamiento,
  tipo,
}: EntrenamientoCardProps) {
  let cardContainer = "overflow-hidden rounded-3xl";
  let tiempo = calcularTiempo(unEntrenamiento.tiempoTotal);
  console.log("tiempo", unEntrenamiento.tiempoTotal);
  if (tipo === "Card Chica") {
    cardContainer += " w-[300px] h-[110px]";
  } else if (tipo === "Card Grande") {
    cardContainer += " w-[240px] h-[240px]";
  } else if (tipo === "Card Grid") {
    cardContainer += " w-[150px] h-[150px]";
  }

  let nombreStyle = "text-white font-bold";

  if (tipo === "Card Chica") {
    nombreStyle = "text-[16px]";
  } else if (tipo === "Card Grande") {
    nombreStyle = "text-[20px]";
  }

  return (
    <View className={cardContainer}>
      <Image
        className="overflow-hidden rounded-3xl"
        style={{ position: "absolute", width: "100%", height: "100%" }}
        source={require("@/assets/defaultWorkout.png")}
        // source={unEntrenamiento.imagen}
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
      <View className="flex-1 flex-col gap-1 absolute bottom-0 w-full px-[8%] pb-4">
        <Text
          className={nombreStyle}
          style={{ fontWeight: "bold", color: "white" }}
          numberOfLines={1}
        >
          {unEntrenamiento.nombre}
        </Text>
        <View className="flex-row gap-1 items-center w-full">
          {unEntrenamiento.tiempoTotal && (
            <Text className="flex-1 text-white text-[13px]">{tiempo}</Text>
          )}
          {unEntrenamiento.nivel && (
            <Text className="flex-1 flex-start text-white text-[13px]">
              {unEntrenamiento.nivel}
            </Text>
          )}
          <Pressable>
            <Image
              className="flex-1 flex-end w-6 h-6 ml-auto"
              source={require("@/assets/iconlyboldbookmark.png")}
              resizeMode="contain"
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
