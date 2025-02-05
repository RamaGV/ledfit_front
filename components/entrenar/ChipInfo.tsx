// app/components/ChipInfo.tsx

import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export type ChipProps = {
  label?: string | number;
  icon?: "None" | "Time" | "Play";
  totalTime?: number;
};

function formatTime(totalTime: number) {
  const m = Math.floor(totalTime / 60);
  const s = totalTime % 60;
  return `${m}:${s < 10 ? `0${s}` : s} min`;
}

const Chip = ({ label, icon, totalTime }: ChipProps) => {
  if (icon === "Time") {
    label = formatTime(totalTime ?? 0);
  } else if (icon === "Play") {
    label = label + " rondas";
  }

  return (
    <View className="flex-row items-center justify-center bg-[#1E1E1E] px-3 py-1 rounded-full border border-[#7B61FF]">
      {icon === "None" ? null : (
        <Ionicons
          name={icon === "Time" ? "time-outline" : "play"}
          size={15}
          color="#7B61FF"
        />
      )}
      <Text className="text-[#7B61FF] text-sm text-center ml-1">{label}</Text>
    </View>
  );
};

export default Chip;
