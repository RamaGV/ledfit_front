// app/(entrenar)/screens/InicioScreen.tsx

import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

interface ReadyProps {
  tiempoRestante: number;
  onReset: () => void;
}

function ReadyScreen({ tiempoRestante, onReset }: ReadyProps) {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-white text-4xl font-bold mb-4">¡Prepárate!</Text>
      <Text className="text-white text-6xl">{tiempoRestante}</Text>
      <TouchableOpacity
        onPress={onReset}
        className="bg-[#6842FF] py-2 px-4 rounded-full"
      >
        <Text className="text-white">Reiniciar</Text>
      </TouchableOpacity>
    </View>
  );
}

export default ReadyScreen;
