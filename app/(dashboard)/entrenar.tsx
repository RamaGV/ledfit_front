// app/(dashboard)/entrenar.tsx

import React, { useState, useEffect, useRef } from "react";
import { 
  View, 
  Dimensions, 
  ScrollView,
  Animated,
  StatusBar,
  Easing,
  StyleSheet
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import type { IEntrenamiento } from "@/context/EntrenamientosContext";
import { useEntrenamientos } from "@/context/EntrenamientosContext";
import { useImagesMap } from "@/context/ImagesMapContext";
import { useTheme } from "@/context/ThemeContext";

// Componentes personalizados
import TrainingCard from "@/components/training/TrainingCard";
import PageIndicators from "@/components/training/PageIndicators";
import ActionButton from "@/components/training/ActionButton";
import LoadingState from "@/components/training/LoadingState";
import TrainingHeader from "@/components/training/TrainingHeader";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.85;
const SPACING = width * 0.03;

export default function TrainingSelector() {
  const router = useRouter();
  const { entrenamientos, setSelectedEntrenamiento } = useEntrenamientos();
  const { imagesMap } = useImagesMap();
  const { colors, isDarkMode } = useTheme();

  const [index, setIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<ScrollView>(null);

  // Animaciones
  const scale = useRef(new Animated.Value(0.9)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  
  // Animación para el botón
  const buttonScale = useRef(new Animated.Value(1)).current;
  const buttonRotation = useRef(new Animated.Value(0)).current;
  const buttonBackground = useRef(new Animated.Value(0)).current;

  // Crear estilos con los colores del tema
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    spacer: {
      flex: 1,
    },
    buttonContainer: {
      paddingHorizontal: 24,
      marginBottom: 96,
    },
    scrollViewContent: {
      paddingHorizontal: SPACING,
    }
  });

  // Si hay entrenamientos, selecciona uno aleatorio al iniciar
  useEffect(() => {
    if (entrenamientos.length > 0) {
      const randomIndex = Math.floor(Math.random() * entrenamientos.length);
      setIndex(randomIndex);
      
      // Animar entrada
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [entrenamientos]);

  // Manejar cambio de índice
  useEffect(() => {
    if (flatListRef.current && entrenamientos.length > 0) {
      flatListRef.current.scrollTo({
        x: index * (CARD_WIDTH + SPACING * 2),
        animated: true,
      });
    }
  }, [index]);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleMomentumScrollEnd = (event: any) => {
    const newIndex = Math.round(
      event.nativeEvent.contentOffset.x / (CARD_WIDTH + SPACING * 2)
    );
    if (newIndex !== index) {
      setIndex(newIndex);
    }
  };

  // Animación al presionar el botón
  const animateButton = () => {
    // Primero reducimos el tamaño y rotamos ligeramente
    Animated.parallel([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 150,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(buttonRotation, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(buttonBackground, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start(() => {
      // Luego volvemos al tamaño original con un pequeño rebote
      Animated.parallel([
        Animated.spring(buttonScale, {
          toValue: 1,
          friction: 4,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.timing(buttonRotation, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(buttonBackground, {
          toValue: 0,
          duration: 150,
          useNativeDriver: false,
        }),
      ]).start();
    });
  };

  const handleSelect = (entrenamiento: IEntrenamiento) => {
    // Animar selección
    animateButton();
    
    // Navegar después de una pequeña pausa para que se vea la animación
    setTimeout(() => {
      setSelectedEntrenamiento(entrenamiento);
      router.push("/(entrenar)/detallesDeEntrenamiento");
    }, 400);
  };

  // Transformación para la rotación del botón
  const spin = buttonRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '3deg']
  });
  
  // Interpolación para el color del fondo del botón
  const bgColor = buttonBackground.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.accent, '#8A6FFF']
  });

  if (entrenamientos.length === 0) {
    return <LoadingState opacity={opacity} scale={scale} backgroundColor={colors.background} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      
      {/* Header con título y decoración */}
      <TrainingHeader
        title="Entrena"
        highlightText="ahora"
        subtitle={`${entrenamientos.length} entrenamientos disponibles`}
        opacity={opacity}
        colors={colors}
      />

      {/* Carrusel de entrenamientos */}
      <Animated.ScrollView
        ref={flatListRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
        snapToInterval={CARD_WIDTH + SPACING * 2}
        snapToAlignment="center"
        decelerationRate="fast"
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
        style={{ flexGrow: 0 }}
      >
        {entrenamientos.map((entrenamiento, idx) => {
          // Calcular animación para cada tarjeta
          const inputRange = [
            (idx - 1) * (CARD_WIDTH + SPACING * 2),
            idx * (CARD_WIDTH + SPACING * 2),
            (idx + 1) * (CARD_WIDTH + SPACING * 2),
          ];
          
          const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [20, 0, 20],
            extrapolate: "clamp",
          });
          
          const cardScale = scrollX.interpolate({
            inputRange,
            outputRange: [0.9, 1, 0.9],
            extrapolate: "clamp",
          });

          const cardOpacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.7, 1, 0.7],
            extrapolate: "clamp",
          });

          const animationStyles = {
            transform: [{ translateY }, { scale: cardScale }],
            opacity: cardOpacity
          };

          return (
            <TrainingCard
              key={entrenamiento._id}
              entrenamiento={entrenamiento}
              imagen={imagesMap[entrenamiento.imagen]}
              cardWidth={CARD_WIDTH}
              animationStyles={animationStyles}
              colors={colors}
            />
          );
        })}
      </Animated.ScrollView>

      {/* Indicadores de página */}
      <PageIndicators
        items={entrenamientos}
        scrollX={scrollX}
        currentIndex={index}
        cardWidth={CARD_WIDTH}
        spacing={SPACING}
        accentColor={colors.accent}
      />

      {/* Espacio flexible para empujar el botón hacia abajo */}
      <View style={styles.spacer} />

      {/* Botón de acción rectangular */}
      <View style={styles.buttonContainer}>
        <ActionButton
          onPress={() => handleSelect(entrenamientos[index])}
          text="Comenzar Entrenamiento"
          icon={<Ionicons name="play" size={24} color="white" />}
          bgColor={bgColor}
          scaleAnim={buttonScale}
          rotateAnim={spin}
        />
      </View>
    </View>
  );
}
