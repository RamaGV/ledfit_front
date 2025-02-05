// components/EjercicioCard.tsx

import { Text, View, Image } from "react-native";
import React from "react";

type EjercicioCardProps = {
  key: number;
  imagen: any;
  label: string;
  tiempoTotal: number;
};

const EjercicioCard = ({
  imagen: imagen,
  label: label,
  tiempoTotal: tiempoTotal,
}: EjercicioCardProps) => {
  return (
    <View className="flex-row items-center bg-[#1E1E1E] rounded-xl mb-3 overflow-hidden">
      <Image source={imagen} className="w-24 h-24" resizeMode="cover" />
      <View className="flex-col ml-4">
        <Text className="text-white font-extrabold text-lg pb-1">{label}</Text>
        <Text className="text-white text-xs">{tiempoTotal} segundos</Text>
      </View>
    </View>
  );
};

export default EjercicioCard;
