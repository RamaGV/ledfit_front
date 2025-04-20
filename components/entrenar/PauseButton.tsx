import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface PauseButtonProps {
  isPaused: boolean;
  isDisabled?: boolean;
  onToggle: () => void;
  size?: number;
  bottomPosition?: number;
}

/**
 * Botón de pausa/reanudar para la pantalla de entrenamiento
 */
export default function PauseButton({
  isPaused,
  isDisabled = false,
  onToggle,
  size = 30,
  bottomPosition = 30,
}: PauseButtonProps) {
  return (
    <TouchableOpacity
      onPress={onToggle}
      disabled={isDisabled}
      style={[styles.button, { bottom: bottomPosition }]}
      accessibilityLabel={
        isPaused ? "Reanudar entrenamiento" : "Pausar entrenamiento"
      }
      accessibilityRole="button"
    >
      <Ionicons name={isPaused ? "play" : "pause"} size={size} color="white" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    alignSelf: "center",
    padding: 15,
    backgroundColor: "rgba(100,100,100,0.7)",
    borderRadius: 50,
    zIndex: 10,
    elevation: 5,
  },
});
