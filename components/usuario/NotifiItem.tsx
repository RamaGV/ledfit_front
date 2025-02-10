import { View, Text } from "react-native";
import { Image } from "expo-image";
import React from "react";

import { useImagesMap } from "@/context/ImagesMapContext";

export default function NotifItem({
  tipo,
  titulo,
  contenido,
}: {
  tipo: "check" | "plus" | "time";
  titulo: string;
  contenido: string;
}) {
  const { imagesMap } = useImagesMap();
  let icono = imagesMap["notifCheck"];
  if (tipo === "plus") {
    icono = imagesMap["notifPlus"];
  } else if (tipo === "time") {
    icono = imagesMap["notifTime"];
  }

  return (
    <View className="flex-row items-center justify-around bg-[#1E1E1E] rounded-2xl p-3 mb-4">
      <Image source={icono} style={{ width: 55, height: 55 }} />
      <View className="flex-col items-start ml-8">
        <Text className="text-white font-semibold text-base">{titulo}</Text>
        <Text className="text-[#CCCCCC] text-sm">{contenido}</Text>
      </View>
    </View>
  );
}
