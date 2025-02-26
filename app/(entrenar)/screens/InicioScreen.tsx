// app/(entrenar)/screens/InicioScreen.tsx

import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";

function InicioScreen({ etapaCompleta }: any) {
  const [tiempo, setTiempo] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      if (tiempo === 0) {
        etapaCompleta();
      }
        setTiempo((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } , [tiempo]);

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-white text-4xl font-bold mb-4">¡Prepárate!</Text>
      <Text className="text-white text-6xl">{tiempo}</Text>
      <TouchableOpacity
        onPress={ () => setTiempo(3) }
        className="bg-[#6842FF] py-2 px-4 rounded-full"
      >
        <Text className="text-white">Reiniciar</Text>
      </TouchableOpacity>
    </View>
  );
}

export default InicioScreen;
