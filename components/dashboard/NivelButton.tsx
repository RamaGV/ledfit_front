// components/NivelButton.tsx
import React from "react";
import { Pressable, Text, StyleSheet, View, Platform } from "react-native";
import { useTheme } from "../../context/ThemeContext";

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
  const { colors, isDarkMode } = useTheme();

  // Colores base para el efecto neumórfico (adaptados al tema)
  const baseColor = isActive
    ? colors.accent
    : isDarkMode
      ? "#252525"
      : "#E5E5E0";

  // Colores para el efecto neumórfico
  const lighterColor = isActive
    ? "#7A5CFF" // Versión más clara del accent
    : isDarkMode
      ? "#2F2F2F"
      : "#F5F5F0";

  const darkerColor = isActive
    ? "#5A38E0" // Versión más oscura del accent
    : isDarkMode
      ? "#1A1A1A"
      : "#D5D5D0";

  // Color del texto
  const textColor = isActive ? "white" : colors.text;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: baseColor,
          opacity: pressed ? 0.9 : 1,
          ...Platform.select({
            ios: {
              shadowColor: isDarkMode ? "#000" : "#FFF",
              shadowOffset: { width: -2, height: -2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
            },
            android: {
              elevation: 4,
            },
          }),
        },
      ]}
    >
      {/* Capa para simular el brillo desde la parte superior izquierda */}
      <View
        style={[
          StyleSheet.absoluteFillObject,
          styles.topLeftHighlight,
          {
            backgroundColor: lighterColor,
            opacity: isDarkMode ? 0.05 : 0.5,
          },
        ]}
      />

      {/* Capa para simular la sombra en la parte inferior derecha */}
      <View
        style={[
          StyleSheet.absoluteFillObject,
          styles.bottomRightShadow,
          {
            backgroundColor: darkerColor,
            opacity: isDarkMode ? 0.5 : 0.3,
          },
        ]}
      />

      {/* Texto del botón */}
      <Text style={[styles.text, { color: textColor }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    position: "relative",
    overflow: "hidden",
    height: 36,
    minWidth: 90,
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
    zIndex: 1,
  },
  topLeftHighlight: {
    borderTopLeftRadius: 50,
    borderTopRightRadius: 25,
    borderBottomLeftRadius: 25,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bottomRightShadow: {
    borderBottomRightRadius: 50,
    borderTopRightRadius: 25,
    borderBottomLeftRadius: 25,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default NivelButton;
