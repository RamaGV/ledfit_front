import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from "@expo/vector-icons";

interface SocialButtonProps {
  icon: "facebook" | "google" | "apple";
  onPress: () => void;
  accessibilityLabel: string;
}

const SocialButton: React.FC<SocialButtonProps> = ({
  icon,
  onPress,
  accessibilityLabel
}) => {
  // Configuración de colores por plataforma
  const iconColor = {
    facebook: "#1877F2",
    google: "#DB4437",
    apple: "#FFF"
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      activeOpacity={0.8}
    >
      <FontAwesome name={icon} size={22} color={iconColor[icon]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 54,
    height: 54,
    borderRadius: 15,
    backgroundColor: '#212121',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  }
});

export default SocialButton;
