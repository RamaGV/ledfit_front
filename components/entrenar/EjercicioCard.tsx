// components/EjercicioCard.tsx

import { Text, View, TouchableOpacity, Dimensions } from "react-native";
import { Image } from "expo-image";
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { cn } from "@/lib/utils";

type EjercicioCardProps = {
  key?: number;
  imagen: any;
  label: string;
  tiempoTotal: number;
  descripcion?: string;
  grupo?: string;
  calorias?: number;
  onPress?: () => void;
  isDescanso?: boolean;
  isDetailed?: boolean;
};

const EjercicioCard = ({
  imagen,
  label,
  tiempoTotal,
  descripcion,
  grupo,
  calorias,
  onPress,
  isDescanso = false,
  isDetailed = false,
}: EjercicioCardProps) => {
  const { colors, isDarkMode } = useTheme();
  
  // Determinar colores basados en si es descanso o ejercicio normal
  const cardBgColor = isDescanso 
    ? (isDarkMode ? '#1E293B' : '#E0E7FF') 
    : (isDarkMode ? colors.card : colors.card);
  
  const iconColor = isDescanso ? '#60A5FA' : '#6842FF';
  const gradientColors = isDescanso 
    ? ['rgba(96, 165, 250, 0.7)', 'rgba(96, 165, 250, 0.1)'] 
    : ['rgba(104, 66, 255, 0.7)', 'rgba(104, 66, 255, 0.1)'];
  const iconName = isDescanso ? "timer-sand" : "dumbbell";

  // Vista detallada
  if (isDetailed) {
    return (
      <View className="mb-10 w-[92%] self-center ">
        {/* Tarjeta principal del ejercicio con estilo neumórfico */}
        <View className={cn(
          "w-full h-[230px] mb-4 rounded-[20px] overflow-hidden shadow-xl shadow-gray-800",
          isDarkMode ? "border border-opacity-50" : ""
        )}
          style={{
            backgroundColor: cardBgColor,
            borderColor: isDarkMode ? iconColor : 'transparent',
          }}
        >
          {/* Contenedor de la imagen */}
          <View className="relative h-[140px] w-full">
            <Image 
              source={imagen} 
              className="h-full w-full"
              contentFit="cover" 
              transition={300}
            />
            <LinearGradient
              colors={['rgba(0,0,0,0.7)', 'transparent', 'transparent', 'rgba(0,0,0,0.7)']}
              className="absolute inset-0"
            />
            
            {/* Indicador de tipo (descanso/ejercicio) */}
            <View 
              className="absolute top-3 left-3 rounded-xl w-9 h-9 items-center justify-center"
              style={{ backgroundColor: iconColor }}
            >
              <MaterialCommunityIcons name={iconName} size={20} color="white" />
            </View>
            
            {/* Grupo de ejercicio */}
            {grupo && !isDescanso && (
              <View className="absolute top-3 right-3 px-3 py-1.5 rounded-2xl bg-black/50">
                <Text className="text-white text-xs font-semibold">{grupo}</Text>
              </View>
            )}
          </View>
          
          {/* Contenido de texto */}
          <View className="flex-1 p-[18px]">
            <Text className="text-lg font-bold mb-2" style={{ color: colors.text }}>
              {label}
            </Text>
            
            <View className="flex-row items-center flex-wrap">
              <View className="flex-row items-center mr-4 mb-2">
                <Ionicons name="time-outline" size={16} color={colors.secondaryText} />
                <Text className="text-sm ml-1" style={{ color: colors.secondaryText }}>
                  {tiempoTotal} seg
                </Text>
              </View>
              
              {!isDescanso && calorias && (
                <View className="flex-row items-center mr-4 mb-2">
                  <Ionicons name="flame-outline" size={16} color={colors.secondaryText} />
                  <Text className="text-sm ml-1" style={{ color: colors.secondaryText }}>
                    {calorias} cal
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* La sección de descripción fue eliminada y movida a detallesDeEjercicios */}
      </View>
    );
  }
  
  // Vista simple (para listas)
  return (
    <TouchableOpacity 
      className={cn(
        "flex-row items-center rounded-2xl mb-4 overflow-hidden pr-3 shadow-md",
        isDarkMode ? "border-l-4" : "border-l-4"
      )}
      style={{
        backgroundColor: cardBgColor,
        borderLeftColor: iconColor
      }}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      {/* Imagen del ejercicio */}
      <View className="relative mr-4">
        <Image 
          source={imagen} 
          className="w-20 h-20 rounded-tl-3xl rounded-bl-3xl" 
          contentFit="cover" 
          transition={300}
        />
        
        {/* Indicador de tipo (descanso/ejercicio) */}
        <View 
          className="absolute top-2 left-2 rounded-xl w-6 h-6 items-center justify-center"
          style={{ backgroundColor: iconColor }}
        >
          <MaterialCommunityIcons name={iconName} size={14} color="white" />
        </View>
      </View>

      {/* Contenido de texto */}
      <View className="flex-1 flex-col py-4">
        <Text 
          className="font-bold text-base mb-1.5"
          style={{ color: colors.text }}
          numberOfLines={1}
        >
          {label}
        </Text>

        <View className="flex-row items-center">
          <Ionicons name="time-outline" size={14} color={colors.secondaryText} />
          <Text className="text-sm ml-1" style={{ color: colors.secondaryText }}>
            {tiempoTotal} segundos
          </Text>
        </View>
      </View>
      
      {/* Flecha indicadora */}
      {onPress && (
        <View className="p-2">
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

export default EjercicioCard;
