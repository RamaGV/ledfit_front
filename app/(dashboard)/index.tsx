// app/(dashboard)/index.tsx

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
  StatusBar,
} from "react-native";
import { Image } from 'expo-image';
import { useRouter } from "expo-router";

import { useEntrenamientos, IEntrenamiento } from "@/context/EntrenamientosContext";
import { useUser } from "@/context/UsersContext";
import { useTheme } from "@/context/ThemeContext";
import NeumorphicButton from '@/components/ui/NeumorphicButton';

import EntrenamientoCard from "@/components/dashboard/EntrenamientoCard";
import NivelButton from "@/components/dashboard/NivelButton";
import TopNavbar from "@/components/TopNavbar";

export default function HomeScreen() {
  const router = useRouter();
  const { entrenamientos, setSelectedEntrenamiento } = useEntrenamientos();
  const { user } = useUser();
  const { colors, isDarkMode } = useTheme();
  const [filtroPorNivel, setFiltroPorNivel] = useState("Principiante");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const screenHeight = Dimensions.get('window').height;

  const niveles = ["Principiante", "Intermedio", "Avanzado"];

  // Simulación de carga inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    // Simular una actualización
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const entrenamientoSeleccionado = (entrenamiento: IEntrenamiento) => {
    setSelectedEntrenamiento(entrenamiento);
    router.push("/(entrenar)/detallesDeEntrenamiento");
  };

  // Filtrar los entrenamientos por nivel
  const entrenamientosFiltrados = entrenamientos.filter(
    (entrenamiento) => entrenamiento.nivel === filtroPorNivel
  );

  // Seleccionar los entrenamientos destacados (por ejemplo, los más populares o con mejores valoraciones)
  const entrenamientosDestacados = entrenamientos
    .sort((a, b) => b.calorias - a.calorias)
    .slice(0, 3); // Los 3 con más calorías

  if (loading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: colors.background
      }}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      
      {/* TopNavbar ahora incluye cálculos de padding automáticos */}
      <TopNavbar logo={true} iconNotif={true} iconFav={true} />

      {/* CONTENIDO FIJO - Fuera del ScrollView */}
      <View>
        {/* Encabezado con saludo */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 8 }}>
          <Text style={{ 
            fontSize: 24, 
            fontWeight: 'bold', 
            color: colors.text 
          }}>
            ¡Hola, {user?.name || "Usuario"}!
          </Text>
          <Text style={{ 
            fontSize: 16, 
            marginTop: 4, 
            color: colors.secondaryText 
          }}>
            ¿Listo para tu entrenamiento de hoy?
          </Text>
        </View>

        {/* Destacados */}
        <Text style={{ 
          fontSize: 18, 
          fontWeight: 'bold', 
          paddingHorizontal: 20, 
          marginTop: 8, 
          marginBottom: 12, 
          color: colors.text 
        }}>
          Destacados
        </Text>
        
        {/* ScrollView HORIZONTAL (se mantiene) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ paddingLeft: 20 }}
          contentContainerStyle={{ gap: 16, paddingRight: 20 }}
        >
          {entrenamientosDestacados.map((entrenamiento) => (
            <TouchableOpacity
              key={entrenamiento._id}
              onPress={() => entrenamientoSeleccionado(entrenamiento)}
            >
              <EntrenamientoCard
                entrenamiento={entrenamiento}
                tipo="Card Grande"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Botones de nivel */}
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-around', 
          alignItems: 'center', 
          paddingVertical: 12, 
          marginTop: 4 
        }}>
          {niveles.map((nivel) => (
            <NivelButton
              key={nivel}
              label={nivel}
              isActive={nivel === filtroPorNivel}
              onPress={() => setFiltroPorNivel(nivel)}
            />
          ))}
        </View>
      </View>

      {/* ÁREA SCROLLABLE - SÓLO para los entrenamientos filtrados */}
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={colors.accent}
            colors={[colors.accent]} 
          />
        }
      >
        {/* Lista de entrenamientos por nivel - ÚNICO contenido scrollable vertical */}
        <View style={{ 
          paddingHorizontal: 20, 
          paddingBottom: 40, 
          paddingTop: 8 
        }}>
          {entrenamientosFiltrados.length === 0 ? (
            <View style={{ 
              alignItems: 'center', 
              justifyContent: 'center', 
              paddingVertical: 32 
            }}>
              <Text style={{ 
                fontSize: 16, 
                color: colors.secondaryText 
              }}>
                No hay entrenamientos disponibles para este nivel
              </Text>
            </View>
          ) : (
            entrenamientosFiltrados.map((entrenamiento) => (
              <View key={entrenamiento._id} style={{ marginBottom: 16 }}>
                <TouchableOpacity
                  onPress={() => entrenamientoSeleccionado(entrenamiento)}
                >
                  <EntrenamientoCard
                    entrenamiento={entrenamiento}
                    tipo="Card Chica"
                  />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
