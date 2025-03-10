// app/(entrenar)/screens/FinScreen.tsx

import { View, Text, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import React from "react";

import { useEntrenamientos } from "@/context/EntrenamientosContext";
import { useEjercicios } from "@/context/EjerciciosContext";
import { calcularTiempo } from "@/utils/utilsEntrenamientos";
import { useTheme } from "@/context/ThemeContext";

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
        <TouchableOpacity
          onPress={() => router.push("/(dashboard)/entrenar")}
          style={{
            backgroundColor: colors.accent,
            paddingVertical: 16,
            marginBottom: 24,
            borderRadius: 50
          }}
        >
          <Text style={{ 
            color: 'white', 
            textAlign: 'center',
            fontWeight: '600'
          }}>
            Iniciar otro entrenamiento
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(dashboard)")}
          style={{
            backgroundColor: isDarkMode ? '#1E1E1E' : colors.card,
            paddingVertical: 16,
            borderRadius: 50
          }}
        >
          <Text style={{ 
            color: colors.text, 
            textAlign: 'center',
            fontWeight: '600'
          }}>
            Volver al Inicio
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
