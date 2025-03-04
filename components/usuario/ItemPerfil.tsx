// app/components/usuario/ItemPerfil.tsx

import { Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React from "react";

export default function Item({
  contenido,
  icono,
  color,
  onPress,
}: {
  contenido: string;
  icono: string;
  color?: string;
  onPress?: () => void;
}) {
  if (!color) {
    color = "#FFFFFF";
  }

  return (
    <TouchableOpacity className="flex-row items-center py-3" onPress={onPress}>
      <Ionicons name={icono as any} size={25} color={color} />
      <Text style={{ color: color }} className="ml-3">
        {contenido}
      </Text>
    </TouchableOpacity>
  );
}
