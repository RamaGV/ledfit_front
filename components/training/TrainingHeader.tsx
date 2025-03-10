import React from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { ThemeColors } from '@/context/ThemeContext';

interface TrainingHeaderProps {
  title: string;
  subtitle: string;
  highlightText: string;
  opacity: Animated.Value;
  colors: ThemeColors;
}

const TrainingHeader = ({ 
  title, 
  subtitle, 
  highlightText, 
  opacity,
  colors 
}: TrainingHeaderProps) => {
  const styles = StyleSheet.create({
    container: {
      paddingVertical: 48,
      paddingHorizontal: 24,
    },
    title: {
      color: colors.text,
      fontSize: 30,
      fontWeight: 'bold',
    },
    highlightText: {
      color: colors.accent,
    },
    infoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
    },
    divider: {
      height: 4,
      width: 48,
      backgroundColor: colors.accent,
      borderRadius: 9999,
      marginRight: 8,
    },
    subtitle: {
      color: colors.secondaryText,
      fontSize: 14,
    }
  });

  return (
    <View style={styles.container}>
      <Animated.View 
        style={{ 
          opacity, 
          transform: [{ 
            translateY: opacity.interpolate({
              inputRange: [0, 1],
              outputRange: [-20, 0]
            })
          }] 
        }}
      >
        <Text style={styles.title}>
          {title} <Text style={styles.highlightText}>{highlightText}</Text>
        </Text>
        <View style={styles.infoContainer}>
          <View style={styles.divider} />
          <Text style={styles.subtitle}>
            {subtitle}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
};

export default TrainingHeader;
