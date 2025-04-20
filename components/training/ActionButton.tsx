import React from "react";
import { TouchableOpacity, Text, Animated, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

interface ActionButtonProps {
  onPress: () => void;
  text: string;
  bgColor: Animated.AnimatedInterpolation<string | number>;
  scaleAnim: Animated.Value;
  rotateAnim: Animated.AnimatedInterpolation<string | number>;
  icon?: React.ReactNode;
}

const ActionButton = ({
  onPress,
  text,
  bgColor,
  scaleAnim,
  rotateAnim,
  icon,
}: ActionButtonProps) => {
  const styles = StyleSheet.create({
    buttonContainer: {
      transform: [{ scale: scaleAnim }, { rotate: rotateAnim }],
    },
    button: {
      borderRadius: 16,
      overflow: "hidden",
      shadowColor: "#6842FF",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
    gradient: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 16,
      paddingHorizontal: 20,
    },
    text: {
      color: "white",
      fontSize: 18,
      fontWeight: "bold",
      marginRight: 8,
    },
  });

  return (
    <Animated.View style={styles.buttonContainer}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        <Animated.View style={[styles.button, { backgroundColor: bgColor }]}>
          <LinearGradient
            colors={["#6842FF", "#8A6FFF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          >
            <Text style={styles.text}>{text}</Text>
            {icon || <Ionicons name="arrow-forward" size={22} color="white" />}
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default ActionButton;
