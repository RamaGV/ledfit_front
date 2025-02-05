// app/components/CustomButton.tsx

import React from "react";
import { Pressable, Text } from "react-native";

export type CustomButtonProps = {
  label: string; // Texto dentro del botón
  onPress?: () => void;
  size?: "large" | "medium" | "small";
  isActive?: boolean; // Para cambiar el color de fondo o estilo
  disabled?: boolean; // Para desactivar el botón
};

/**
 * Un botón tailwind configurable.
 */
export function CustomButton({
  label,
  onPress,
  size = "medium",
  isActive = false,
  disabled = false,
}: CustomButtonProps) {
  // Podemos definir clases tailwind según el tamaño
  let sizeClasses = "py-2 px-6"; // por defecto "medium"
  if (size === "large") {
    sizeClasses = "py-3 px-8";
  } else if (size === "small") {
    sizeClasses = "py-2 px-4";
  }

  // Fondo según si está activo o no
  // (ej. "activo" => fill color #7B61FF, "inactivo" => border)
  let backgroundClasses = isActive
    ? "bg-[#7B61FF]"
    : "bg-[#1E1E1E] border border-[#7B61FF]";

  // Si está disabled, podemos bajarle la opacidad
  let opacityClass = disabled ? "opacity-50" : "opacity-100";

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      className={`rounded-full items-center justify-center ${sizeClasses} ${backgroundClasses} ${opacityClass}`}
    >
      <Text className="text-white text-sm">{label}</Text>
    </Pressable>
  );
}

export default CustomButton;
