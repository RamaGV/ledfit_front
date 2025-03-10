import React from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ThemeColors } from '@/context/ThemeContext';

import type { IEntrenamiento } from '@/context/EntrenamientosContext';

interface TrainingCardProps {
  entrenamiento: IEntrenamiento;
  imagen: any;
  cardWidth: number;
  animationStyles: {
    transform: any[];
    opacity: any;
  };
  colors: ThemeColors;
}

const TrainingCard = ({ 
  entrenamiento, 
  imagen, 
  cardWidth, 
  animationStyles,
  colors 
}: TrainingCardProps) => {
  const styles = StyleSheet.create({
    card: {
      ...animationStyles,
      width: cardWidth,
      backgroundColor: colors.card,
      borderRadius: 24,
      overflow: 'hidden',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
      marginHorizontal: 12
    },
    imageContainer: {
      position: 'relative',
      width: '100%',
      height: 256,
      borderRadius: 24,
      overflow: 'hidden'
    },
    image: {
      width: '100%',
      height: '100%'
    },
    gradient: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: '70%'
    },
    contentContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: 16
    },
    badgeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8
    },
    primaryBadge: {
      backgroundColor: colors.accent,
      borderRadius: 9999,
      paddingHorizontal: 12,
      paddingVertical: 4,
      marginRight: 8
    },
    secondaryBadge: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: 9999,
      paddingHorizontal: 12,
      paddingVertical: 4
    },
    badgeText: {
      color: 'white',
      fontSize: 12,
      fontWeight: 'bold'
    },
    secondaryBadgeText: {
      color: 'white',
      fontSize: 12
    },
    title: {
      color: 'white',
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 4
    },
    detailsContainer: {
      padding: 16
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16
    },
    statItem: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    statText: {
      color: colors.secondaryText,
      fontSize: 14,
      marginLeft: 4
    },
    description: {
      color: colors.secondaryText,
      fontSize: 14,
      marginBottom: 16
    }
  });

  return (
    <Animated.View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={imagen}
          style={styles.image}
          contentFit="cover"
          transition={1000}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
          style={styles.gradient}
        />
        <View style={styles.contentContainer}>
          <View style={styles.badgeContainer}>
            <View style={styles.primaryBadge}>
              <Text style={styles.badgeText}>
                {entrenamiento.nivel}
              </Text>
            </View>
            <View style={styles.secondaryBadge}>
              <Text style={styles.secondaryBadgeText}>
                {entrenamiento.grupo}
              </Text>
            </View>
          </View>
          <Text style={styles.title}>
            {entrenamiento.nombre}
          </Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="time-outline" size={18} color={colors.accent} />
            <Text style={styles.statText}>
              {Math.floor(entrenamiento.tiempoTotal / 60)}:
              {(entrenamiento.tiempoTotal % 60).toString().padStart(2, '0')} min
            </Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="flame-outline" size={18} color="#FF4D4D" />
            <Text style={styles.statText}>
              {entrenamiento.calorias} cal
            </Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="barbell-outline" size={18} color={colors.accent} />
            <Text style={styles.statText}>
              {entrenamiento.ejercicios.length} ejercicios
            </Text>
          </View>
        </View>

        <Text
          style={styles.description}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {entrenamiento.descripcion}
        </Text>
      </View>
    </Animated.View>
  );
};

export default TrainingCard;
