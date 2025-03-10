// components/NivelButton.tsx
import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { useTheme } from "@/context/ThemeContext";

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
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    button: {
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
      paddingHorizontal: 16,
      backgroundColor: isActive ? colors.accent : colors.card,
      borderWidth: isActive ? 0 : 1,
      borderColor: isActive ? 'transparent' : colors.accent,
    },
    text: {
      color: isActive ? 'white' : colors.text,
      fontSize: 14,
      fontWeight: '500',
    }
  });

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { opacity: pressed ? 0.8 : 1 }
      ]}
    >
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

export default NivelButton;
