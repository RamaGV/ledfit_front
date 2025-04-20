// app/components/entrenar/ChipInfo.tsx

import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useTheme } from "../../context/ThemeContext";

export type ChipProps = {
  label?: string | number;
  icon?: "None" | "Time" | "Play";
  totalTime?: number;
};

// Formatea el tiempo en mm:ss
function formatTime(totalTime: number) {
  const m = Math.floor(totalTime / 60);
  const s = totalTime % 60;
  return `${m}:${s < 10 ? `0${s}` : s} min`;
}

const ChipInfo = ({ label, icon, totalTime }: ChipProps) => {
  const { colors } = useTheme();

  if (icon === "Time") {
    label = formatTime(totalTime ?? 0);
  } else if (icon === "Play") {
    label = label + " rondas";
  }

  const styles = StyleSheet.create({
    chip: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.card,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 50,
      borderWidth: 1,
      borderColor: colors.accent,
    },
    label: {
      color: colors.accent,
      fontSize: 14,
      textAlign: "center",
      marginLeft: 4,
    },
  });

  return (
    <View style={styles.chip}>
      {icon === "None" ? null : (
        <Ionicons
          name={icon === "Time" ? "time-outline" : "play"}
          size={15}
          color={colors.accent}
        />
      )}
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

export default ChipInfo;
