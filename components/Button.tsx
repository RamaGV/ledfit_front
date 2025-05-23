// app/components/Button.tsx

import React from "react";
import { Text, TouchableOpacity } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  color?: string;
}

export default function Button({ title, onPress, color }: ButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={{ backgroundColor: color }}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
}
