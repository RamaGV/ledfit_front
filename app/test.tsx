import React, { useState } from "react";
import { View, Text, Button } from "react-native";
import CirculasProgress from "react-native-circular-progress-indicator";

export default function Test() {
  const [valor, setValor] = useState(0);

  return (
    <View className="flex-1 items-center justify-center">
      <CirculasProgress
        radius={100}
        value={valor}
        duration={1000}
        valueSuffix="%"
        inActiveStrokeColor="#2ecc71"
        inActiveStrokeOpacity={0.2}
        inActiveStrokeWidth={6}
      />
    </View>
  );
}
