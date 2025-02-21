// components/NivelButton.tsx
import React from "react";
import { Pressable, Text } from "react-native";

export type NivelButtonProps = {
  label: string;
  isActive?: boolean;
  onPress?: () => void;
};

export function NivelButton({
  label,
  onPress,
  isActive = false,
}: NivelButtonProps) {
  let backgroundClasses = isActive
    ? "bg-[#6842FF]"
    : "bg-[#1E1E1E] border border-[#6842FF]";

  return (
    <Pressable
      onPress={onPress}
      className={`rounded-full items-center justify-center px-4 py-2 ${backgroundClasses}`}
    >
      <Text className="text-white text-sm">{label}</Text>
    </Pressable>
  );
}

export default NivelButton;
