import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  accessibilityLabel?: string;
  gradientColors?: readonly [string, string, ...string[]];
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  isLoading = false,
  accessibilityLabel,
  gradientColors = ["#6842FF", "#8A6FFF"]
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={isLoading}
      accessibilityLabel={accessibilityLabel || title}
      activeOpacity={0.9}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        {isLoading ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <Text style={styles.text}>{title}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: "#6842FF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  }
});

export default PrimaryButton;
