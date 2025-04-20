import React from "react";
import { View, Text, Animated, StatusBar, StyleSheet } from "react-native";
import { Image } from "expo-image";

interface LoadingStateProps {
  opacity: Animated.Value;
  scale: Animated.Value;
  backgroundColor: string;
}

const LoadingState = ({
  opacity,
  scale,
  backgroundColor,
}: LoadingStateProps) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor,
    },
    image: {
      width: 80,
      height: 80,
      marginBottom: 20,
      tintColor: "#6842FF",
    },
    text: {
      color: "#FFFFFF",
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
    },
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Animated.View style={{ opacity, transform: [{ scale }] }}>
        <Image
          source={require("@/assets/icons/iconFavTrue.png")}
          style={styles.image}
        />
        <Text style={styles.text}>Cargando entrenamientos...</Text>
      </Animated.View>
    </View>
  );
};

export default LoadingState;
