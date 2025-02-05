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
  let sizeClasses = "py-2 px-6";

  let backgroundClasses = isActive
    ? "bg-[#7B61FF]"
    : "bg-[#1E1E1E] border border-[#7B61FF]";

  return (
    <Pressable
      onPress={onPress}
      className={`rounded-full items-center justify-center ${sizeClasses} ${backgroundClasses}`}
    >
      <Text className="text-white text-sm">{label}</Text>
    </Pressable>
  );
}

export default NivelButton;
