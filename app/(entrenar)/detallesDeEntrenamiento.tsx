// app/(entrenar)/detallesDeEntrenamiento.tsx

import {
  View,
  Text,
  ScrollView,
  Pressable,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  StyleSheet,
  Dimensions
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";

import { useEntrenamientos } from "@/context/EntrenamientosContext";
import { useImagesMap } from "@/context/ImagesMapContext";
import { useTheme } from "@/context/ThemeContext";

import EjercicioCard from "@/components/entrenar/EjercicioCard";
import ChipInfo from "@/components/entrenar/ChipInfo";
import NeumorphicButton from "@/components/ui/NeumorphicButton";
import { calcularTiempo } from "@/utils/utilsEntrenamientos";

const HEADER_HEIGHT = 300;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ID del ejercicio de descanso en la base de datos
const DESCANSO_ID = "67bc1a7372e1e0091651e944";

export default function DetallesDeEntrenamiento() {
  const router = useRouter();
  const { selectedEntrenamiento } = useEntrenamientos();
  const { imagesMap } = useImagesMap();
  const { isDarkMode, colors } = useTheme();
  const [ejerciciosReales, setEjerciciosReales] = useState<number>(0);

  // Verificar que existe un entrenamiento seleccionado
  useEffect(() => {
    if (!selectedEntrenamiento) {
      router.replace("/(dashboard)");
    } else {
      // Contar ejercicios reales (no descansos)
      const reales = selectedEntrenamiento.ejercicios.filter(
        ejercicio => ejercicio.ejercicioId._id !== DESCANSO_ID
      ).length;
      setEjerciciosReales(reales);
    }
  }, [selectedEntrenamiento]);

  const handleStart = () => {
    router.push("/(entrenar)/entrenar");
  };

  const mainImage =
    (selectedEntrenamiento?.imagen &&
      imagesMap[selectedEntrenamiento.imagen]) ||
    require("@/assets/defaultWorkout.png");

  if (!selectedEntrenamiento) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.background }}>
        <Text style={{ color: colors.text }}>Cargando entrenamiento...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      
      {/* Header con imagen y gradiente */}
      <View style={styles.headerContainer}>
        <Image
          source={mainImage}
          style={styles.headerImage}
          contentFit="cover"
        />
        <LinearGradient
          colors={["rgba(0,0,0,0.7)", "transparent", "rgba(0,0,0,0.5)"]}
          style={StyleSheet.absoluteFillObject}
        />
        
        {/* Botón de retroceso */}
        <Pressable 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={26} color="#FFFFFF" />
        </Pressable>
        
        {/* Información superpuesta en la imagen */}
        <View style={styles.overlayInfo}>
          <Text style={styles.workoutTitle}>
            {selectedEntrenamiento.nombre}
          </Text>
          
          <Text style={styles.workoutDescription}>
            {selectedEntrenamiento.descripcion || 
              `Entrenamiento de nivel ${selectedEntrenamiento.nivel} para mejorar tu condición física.`}
          </Text>
          
          {/* Chips de información en formato neumórfico */}
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: isDarkMode ? '#252525' : '#E5E5E0' }]}>
              <MaterialCommunityIcons 
                name="dumbbell" 
                size={24} 
                color={colors.accent} 
              />
              <Text style={[styles.statValue, { color: colors.text }]}>
                {ejerciciosReales}
              </Text>
              <Text style={[styles.statLabel, { color: colors.secondaryText }]}>
                Ejercicios
              </Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: isDarkMode ? '#252525' : '#E5E5E0' }]}>
              <MaterialCommunityIcons 
                name="clock-outline" 
                size={24} 
                color={colors.accent} 
              />
              <Text style={[styles.statValue, { color: colors.text }]}>
                {calcularTiempo(selectedEntrenamiento.tiempoTotal)}
              </Text>
              <Text style={[styles.statLabel, { color: colors.secondaryText }]}>
                Minutos
              </Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: isDarkMode ? '#252525' : '#E5E5E0' }]}>
              <MaterialCommunityIcons 
                name="fire" 
                size={24} 
                color={colors.accent} 
              />
              <Text style={[styles.statValue, { color: colors.text }]}>
                {selectedEntrenamiento.calorias}
              </Text>
              <Text style={[styles.statLabel, { color: colors.secondaryText }]}>
                Calorías
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Encabezado de la sección de ejercicios */}
      <View style={[
        styles.sectionHeader, 
        { 
          backgroundColor: colors.background,
          borderColor: isDarkMode ? '#333333' : '#E0E0E0' 
        }
      ]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Ejercicios
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/(entrenar)/detallesDeEjercicios")}
        >
          <Text style={{ color: colors.accent }}>Ver más</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de ejercicios - SCROLLABLE */}
      <ScrollView
        style={styles.exerciseList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {selectedEntrenamiento.ejercicios.map((ejercicio, idx) => (
          <EjercicioCard
            key={idx}
            imagen={imagesMap[ejercicio.ejercicioId.imagen]}
            label={ejercicio.ejercicioId.nombre}
            tiempoTotal={ejercicio.tiempo}
            isDescanso={ejercicio.ejercicioId._id === DESCANSO_ID}
            onPress={() => {
              // Navegar a detalles del ejercicio
              router.push({
                pathname: "/(entrenar)/detallesDeEjercicios",
                params: { ejercicioId: ejercicio.ejercicioId._id }
              });
            }}
          />
        ))}
      </ScrollView>

      {/* Botón de inicio - FIJO */}
      <View style={[
        styles.bottomBar,
        { 
          backgroundColor: colors.background,
          borderColor: isDarkMode ? '#333333' : '#E0E0E0' 
        }
      ]}>
        <NeumorphicButton
          onPress={handleStart}
          text="INICIAR ENTRENAMIENTO"
          isPrimary={true}
          colors={colors}
          isDarkMode={isDarkMode}
          style={styles.startButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: HEADER_HEIGHT,
    width: '100%',
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
  },
  overlayInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  workoutTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  workoutDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statCard: {
    width: (SCREEN_WIDTH - 60) / 3,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  exerciseList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  startButton: {
    width: '100%',
  }
});
