// components/EjercicioCard.tsx

import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

type EjercicioCardProps = {
  key?: number;
  imagen: any;
  label: string;
  tiempoTotal: number;
  onPress?: () => void;
  isDescanso?: boolean;
};

const EjercicioCard = ({
  imagen,
  label,
  tiempoTotal,
  onPress,
  isDescanso = false,
}: EjercicioCardProps) => {
  const { colors, isDarkMode } = useTheme();

  // Determinar colores basados en si es descanso o ejercicio normal
  const cardBgColor = isDescanso 
    ? (isDarkMode ? '#1E293B' : '#E0E7FF') 
    : (isDarkMode ? colors.card : colors.card);
  
  const iconColor = isDescanso ? '#60A5FA' : '#6842FF';
  const iconName = isDescanso ? "time-outline" : "fitness-outline";

  return (
    <TouchableOpacity 
      style={[
        styles.container,
        { 
          backgroundColor: cardBgColor,
          borderLeftColor: iconColor,
        }
      ]}
      onPress={onPress}
      activeOpacity={0.9}
      disabled={!onPress}
    >
      {/* Imagen del ejercicio */}
      <View style={styles.imageContainer}>
        <Image 
          source={imagen} 
          style={styles.image} 
          contentFit="cover" 
          transition={300}
        />
        
        {/* Indicador de tipo (descanso/ejercicio) */}
        <View style={[styles.typeIndicator, { backgroundColor: iconColor }]}>
          <Ionicons name={iconName} size={14} color="white" />
        </View>
      </View>
      
      {/* Contenido de texto */}
      <View style={styles.content}>
        <Text 
          style={[styles.title, { color: colors.text }]}
          numberOfLines={1}
        >
          {label}
        </Text>
        
        <View style={styles.timeContainer}>
          <Ionicons name="time-outline" size={14} color={colors.secondaryText} />
          <Text style={[styles.time, { color: colors.secondaryText }]}>
            {tiempoTotal} segundos
          </Text>
        </View>
      </View>
      
      {/* Flecha indicadora */}
      {onPress && (
        <View style={styles.arrowContainer}>
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={colors.secondaryText} 
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    paddingRight: 12,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  image: {
    width: 80,
    height: 80,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  typeIndicator: {
    position: 'absolute',
    top: 8,
    left: 8,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    flexDirection: "column",
    paddingVertical: 16,
  },
  title: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 6,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    fontSize: 14,
    marginLeft: 4,
  },
  arrowContainer: {
    padding: 8,
  }
});

export default EjercicioCard;
