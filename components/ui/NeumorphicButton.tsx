import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { ThemeColors } from "../../context/ThemeContext";

// Definimos los tipos para las props del botón
interface NeumorphicButtonProps {
  onPress: () => void;
  text: string;
  isPrimary?: boolean;
  colors: ThemeColors;
  isDarkMode: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
}

/**
 * Botón con efecto neumórfico que se adapta automáticamente al tema
 *
 * @param onPress Función a ejecutar al presionar el botón
 * @param text Texto a mostrar en el botón
 * @param isPrimary Si es true, usará el color de acento del tema
 * @param colors Colores del tema actual
 * @param isDarkMode Si la app está en modo oscuro
 * @param style Estilos adicionales para el botón
 * @param textStyle Estilos adicionales para el texto
 * @param disabled Si el botón está deshabilitado
 */
const NeumorphicButton: React.FC<NeumorphicButtonProps> = ({
  onPress,
  text,
  isPrimary = false,
  colors,
  isDarkMode,
  style = {},
  textStyle = {},
  disabled = false,
}) => {
  // Colores base para el efecto neumórfico (adaptados al tema)
  const baseColor = isPrimary
    ? colors.accent
    : isDarkMode
      ? "#252525"
      : "#E5E5E0";

  // Para efecto neumórfico, necesitamos colores ligeramente más claros y más oscuros
  // que el color base para crear el efecto de profundidad
  const lighterColor = isPrimary
    ? "#7A5CFF" // Versión más clara del accent
    : isDarkMode
      ? "#2F2F2F"
      : "#F5F5F0";

  const darkerColor = isPrimary
    ? "#5A38E0" // Versión más oscura del accent
    : isDarkMode
      ? "#1A1A1A"
      : "#D5D5D0";

  const textColor = isPrimary ? "white" : colors.text;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.neumorphicButton,
        {
          backgroundColor: baseColor,
          ...Platform.select({
            ios: {
              shadowColor: isDarkMode ? "#000" : "#FFF",
              shadowOffset: { width: -4, height: -4 },
              shadowOpacity: 0.2,
              shadowRadius: 6,
            },
            android: {
              elevation: 4,
            },
          }),
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
      activeOpacity={0.9}
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

      {/* Contenido del botón */}
      <View style={styles.buttonContent}>
        <Text
          style={[
            styles.buttonText,
            { color: textColor, fontWeight: "600" },
            textStyle,
          ]}
        >
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// Estilos para el diseño neumórfico
const styles = StyleSheet.create({
  neumorphicButton: {
    height: 55,
    borderRadius: 30,
    overflow: "hidden",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  topLeftHighlight: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bottomRightShadow: {
    borderBottomRightRadius: 30,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  buttonContent: {
    zIndex: 1,
    padding: 16,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    textAlign: "center",
  },
});

export default NeumorphicButton;
