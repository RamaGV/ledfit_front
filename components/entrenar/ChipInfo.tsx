// app/components/entrenar/ChipInfo.tsx

import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React from "react";

export type ChipProps = {
  label?: string | number;
  icon?: "None" | "Time" | "Play";
  totalTime?: number;
};

// Formatea el tiempo en mm:ss
function formatTime(totalTime: number) {
  const m = Math.floor(totalTime / 60);
  const s = totalTime % 60;
  return `${m}:${s < 10 ? `0${s}` : s} min`;
}

const ChipInfo = ({ label, icon, totalTime }: ChipProps) => {
  if (icon === "Time") {
    label = formatTime(totalTime ?? 0);
  } else if (icon === "Play") {
    label = label + " rondas";
  }

  return (
    <View className="flex-row items-center justify-center bg-[#1E1E1E] px-3 py-1 rounded-full border border-[#6842FF]">
      {icon === "None" ? null : (
        <Ionicons
          name={icon === "Time" ? "time-outline" : "play"}
          size={15}
          color="#7B61FF"
        />
      )}
      <Text className="text-[#6842FF] text-sm text-center ml-1">{label}</Text>
    </View>
  );
};

export default ChipInfo;
