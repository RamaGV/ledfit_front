import React from "react";
import { View, Text } from "react-native";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

/**
 * Componente para mostrar título y subtítulo en pantallas de autenticación
 */
export default function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <View className="mb-8">
      <Text className="text-2xl font-bold text-white mb-2">{title}</Text>
      <Text className="text-base text-gray-400">{subtitle}</Text>
    </View>
  );
}
