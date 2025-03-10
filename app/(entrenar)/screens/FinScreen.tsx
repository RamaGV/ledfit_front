// app/(entrenar)/screens/FinScreen.tsx

import { View, Text, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import React from "react";

import { useEntrenamientos } from "@/context/EntrenamientosContext";
import { useEjercicios } from "@/context/EjerciciosContext";
import { calcularTiempo } from "@/utils/utilsEntrenamientos";
import { useTheme } from "@/context/ThemeContext";
import NeumorphicButton from "@/components/ui/NeumorphicButton";

export default function FinScreen() {
  const router = useRouter();
  const { selectedEntrenamiento } = useEntrenamientos();
  const { ejercicioActual } = useEjercicios();
  const { colors, isDarkMode } = useTheme();

  if (!ejercicioActual || !selectedEntrenamiento) {
    return null;
  }

  return (
    <View style={{ 
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: 24,
      backgroundColor: colors.background
    }}>
      <View style={{ marginTop: 40 }}>
        <Image
          source={require("@/assets/ejercicios/trofeo.png")}
          style={{ width: 300, height: 300 }}
          resizeMode="contain"
        />
      </View>

      <View style={{ alignItems: 'center' }}>
        <Text style={{ 
          color: "#FFD700", 
          fontSize: 30, 
          fontWeight: 'bold',
          marginBottom: 8 
        }}>
          ¡Felicidades!
        </Text>
        <Text style={{ 
          color: colors.text, 
          fontSize: 16,
          marginBottom: 24 
        }}>
          ¡Has completado el entrenamiento!
        </Text>
      </View>

      <View style={{ 
        width: '100%', 
        borderBottomWidth: 1, 
        borderBottomColor: isDarkMode ? '#454545' : colors.border,
        marginBottom: 24 
      }} />

      <View style={{ 
        flexDirection: 'row', 
        width: '100%', 
        justifyContent: 'space-around',
        marginBottom: 24
      }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ 
            color: colors.text, 
            fontSize: 20, 
            fontWeight: 'bold' 
          }}>
            {selectedEntrenamiento.ejercicios.length}
          </Text>
          <Text style={{ 
            color: colors.secondaryText, 
            fontSize: 14 
          }}>
            Rondas
          </Text>
        </View>
        <View style={{ 
          borderRightWidth: 1, 
          borderRightColor: isDarkMode ? '#454545' : colors.border
        }} />
        <View style={{ alignItems: 'center' }}>
          <Text style={{ 
            color: colors.text, 
            fontSize: 20, 
            fontWeight: 'bold' 
          }}>
            {selectedEntrenamiento.calorias}
          </Text>
          <Text style={{ 
            color: colors.secondaryText, 
            fontSize: 14 
          }}>
            Cal
          </Text>
        </View>
        <View style={{ 
          borderRightWidth: 1, 
          borderRightColor: isDarkMode ? '#454545' : colors.border
        }} />
        <View style={{ alignItems: 'center' }}>
          <Text style={{ 
            color: colors.text, 
            fontSize: 20, 
            fontWeight: 'bold' 
          }}>
            {calcularTiempo(selectedEntrenamiento.tiempoTotal)}
          </Text>
          <Text style={{ 
            color: colors.secondaryText, 
            fontSize: 14 
          }}>
            Minutos
          </Text>
        </View>
      </View>

      <View style={{ width: '100%', marginTop: 48 }}>
        <NeumorphicButton 
          onPress={() => router.push("/(dashboard)/entrenar")}
          text="Iniciar otro entrenamiento"
          isPrimary={true}
          colors={colors}
          isDarkMode={isDarkMode}
          style={{ marginBottom: 20 }}
        />

        <NeumorphicButton 
          onPress={() => router.push("/(dashboard)")}
          text="Volver al Inicio"
          isPrimary={false}
          colors={colors}
          isDarkMode={isDarkMode}
        />
      </View>
    </View>
  );
}

// Estilos para el diseño neumórfico
const styles = StyleSheet.create({
  neumorphicButton: {
    height: 55,
    borderRadius: 30,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topLeftHighlight: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bottomRightShadow: {
    borderBottomRightRadius: 30,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  buttonContent: {
    zIndex: 1,
    padding: 16,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    textAlign: 'center',
  }
});
