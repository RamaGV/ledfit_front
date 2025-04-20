// app/(entrenar)/screens/FinScreen.tsx

import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";

import { useTheme } from "../../../context/ThemeContext";
import { calcularTiempo } from "../../../utils/utilsEntrenamientos";

interface FinScreenProps {
  nombreEntrenamiento: string;
  tiempoTotal: number; // en segundos
  caloriasTotales: number;
  onVolver: () => void;
}

export default function FinScreen({
  nombreEntrenamiento,
  tiempoTotal,
  caloriasTotales,
  onVolver,
}: FinScreenProps) {
  const { colors, isDarkMode } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-around",
        padding: 24,
        backgroundColor: colors.background,
      }}
    >
      <View style={{ marginTop: 40, alignItems: "center" }}>
        <Image
          source={require("../../../assets/ejercicios/trofeo.png")}
          style={{ width: 250, height: 250 }}
          resizeMode="contain"
        />
      </View>

      <View style={{ alignItems: "center" }}>
        <Text
          style={{
            color: "#FFD700",
            fontSize: 28,
            fontWeight: "bold",
            marginBottom: 8,
          }}
        >
          ¡Felicidades!
        </Text>
        <Text
          style={{
            color: colors.text,
            fontSize: 18,
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          Completaste "{nombreEntrenamiento}"
        </Text>
      </View>

      <View
        style={{
          width: "100%",
          borderBottomWidth: 1,
          borderBottomColor: isDarkMode ? "#454545" : colors.border,
          marginBottom: 24,
        }}
      />

      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-around",
          marginBottom: 24,
        }}
      >
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              color: colors.text,
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            {calcularTiempo(tiempoTotal)}
          </Text>
          <Text
            style={{
              color: colors.secondaryText,
              fontSize: 14,
            }}
          >
            Minutos
          </Text>
        </View>
        <View
          style={{
            borderRightWidth: 1,
            borderRightColor: isDarkMode ? "#454545" : colors.border,
          }}
        />
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              color: colors.text,
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            {caloriasTotales}
          </Text>
          <Text
            style={{
              color: colors.secondaryText,
              fontSize: 14,
            }}
          >
            Calorías
          </Text>
        </View>
      </View>

      <View style={{ width: "100%", marginTop: 48 }}>
        <TouchableOpacity
          onPress={onVolver}
          style={{
            backgroundColor: "#6842FF",
            paddingVertical: 15,
            borderRadius: 30,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
          activeOpacity={0.8}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
            Volver a Entrenamientos
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
