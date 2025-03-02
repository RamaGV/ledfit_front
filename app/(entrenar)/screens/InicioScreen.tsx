// app/(entrenar)/screens/InicioScreen.tsx

import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

interface InicioScreenProps {
  etapaCompleta: () => void;
  tiempoRestante: number; // Recibido en segundos (puede ser decimal)
}

export default function InicioScreen({ etapaCompleta, tiempoRestante }: InicioScreenProps) {
  // Redondea el tiempo restante para que se muestre solo como un entero.
  const tiempo = Math.ceil(tiempoRestante);

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-white text-4xl font-bold mb-4">¡Prepárate!</Text>
      <Text className="text-white text-6xl">{tiempo}</Text>
      <TouchableOpacity
        onPress={etapaCompleta}
        className="bg-[#6842FF] py-2 px-4 rounded-full"
      >
        <Text className="text-white">Reiniciar</Text>
      </TouchableOpacity>
    </View>
  );
}
