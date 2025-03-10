// components/EjercicioCard.tsx

import { Text, View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import React from "react";
import { useTheme } from "@/context/ThemeContext";

type EjercicioCardProps = {
  key?: number;
  imagen: any;
  label: string;
  tiempoTotal: number;
};

const EjercicioCard = ({
  imagen,
  label,
  tiempoTotal,
}: EjercicioCardProps) => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 12,
      marginBottom: 12,
      overflow: "hidden",
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    image: {
      width: 96,
      height: 96,
    },
    content: {
      flexDirection: "column",
      marginLeft: 16,
      paddingVertical: 12,
    },
    title: {
      color: colors.text,
      fontWeight: "800",
      fontSize: 16,
      paddingBottom: 4,
    },
    time: {
      color: colors.secondaryText,
      fontSize: 12,
    },
  });

  return (
    <View style={styles.container}>
      <Image 
        source={imagen} 
        style={styles.image} 
        contentFit="cover" 
        transition={300}
      />
      <View style={styles.content}>
        <Text style={styles.title}>{label}</Text>
        <Text style={styles.time}>{tiempoTotal} segundos</Text>
      </View>
    </View>
  );
};

export default EjercicioCard;
