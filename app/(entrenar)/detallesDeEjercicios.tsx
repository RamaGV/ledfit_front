// app/(entrenar)/detallesDeEjercicios.tsx

import { View, ScrollView, Text, StatusBar, SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { useEntrenamientos } from "@/context/EntrenamientosContext";
import { useEjercicios, IEjercicio } from "@/context/EjerciciosContext";

// Interfaz extendida para incluir la propiedad 'tiempo' que necesitamos para los ejercicios en un entrenamiento
interface IEjercicioConTiempo extends IEjercicio {
  tiempo?: number;
}
import { useImagesMap } from "@/context/ImagesMapContext";
import { useTheme } from "@/context/ThemeContext";

import EjercicioCard from "@/components/entrenar/EjercicioCard";
import TopNavbar from "@/components/TopNavbar";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// ID del ejercicio de descanso en la base de datos
const DESCANSO_ID = "67bc1a7372e1e0091651e944";

// Función para capitalizar la primera letra de cada palabra
const capitalizeText = (text: string): string => {
  if (!text) return '';
  
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export default function DetallesDeEjercicios() {
  // Solo mantenemos estilos mínimos que no se pueden implementar con NativeWind
  // como las sombras en Android (elevation)
  const styles = StyleSheet.create({
    // Cualquier estilo que necesite propiedades no soportadas por NativeWind
  });
  const { selectedEntrenamiento } = useEntrenamientos();
  const { ejercicios, fetchEjercicioById } = useEjercicios();
  const { imagesMap } = useImagesMap();
  const { isDarkMode, colors } = useTheme();
  const params = useLocalSearchParams();
  const [selectedEjercicio, setSelectedEjercicio] = useState<IEjercicioConTiempo | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  
  /**
   * Carga los datos del ejercicio seleccionado cuando cambia el ID de ejercicio en los parámetros
   * o cuando cambia el entrenamiento seleccionado.
   */
  useEffect(() => {
    const loadEjercicio = async () => {
      if (!params.ejercicioId || typeof params.ejercicioId !== 'string') return;
      
      // Estrategia 1: Buscar en el entrenamiento seleccionado
      if (selectedEntrenamiento?.ejercicios) {
        const index = selectedEntrenamiento.ejercicios.findIndex(
          e => e.ejercicioId._id === params.ejercicioId
        );
        
        if (index !== -1) {
          const ejercicioInEntrenamiento = selectedEntrenamiento.ejercicios[index];
          const ejercicioConTiempo: IEjercicioConTiempo = {
            ...ejercicioInEntrenamiento.ejercicioId,
            nombre: capitalizeText(ejercicioInEntrenamiento.ejercicioId.nombre), // Capitalizar el nombre
            tiempo: ejercicioInEntrenamiento.tiempo
          };
          setSelectedEjercicio(ejercicioConTiempo);
          setCurrentIndex(index);
          return; // Terminamos la búsqueda si encontramos el ejercicio
        }
      }
      
      // Estrategia 2: Buscar en la lista local de ejercicios
      const ejercicioLocal = ejercicios.find((e: IEjercicio) => e._id === params.ejercicioId);
      if (ejercicioLocal) {
        const ejercicioCapitalizado: IEjercicioConTiempo = {
          ...ejercicioLocal,
          nombre: capitalizeText(ejercicioLocal.nombre) // Capitalizar el nombre
        };
        setSelectedEjercicio(ejercicioCapitalizado);
        return;
      }
      
      // Estrategia 3: Buscar mediante la API
      try {
        const ejercicioAPI = await fetchEjercicioById(params.ejercicioId);
        if (ejercicioAPI) {
          setSelectedEjercicio(ejercicioAPI as IEjercicioConTiempo);
        }
      } catch (error) {
        console.error('Error al buscar ejercicio por API:', error);
      }
    };
    
    loadEjercicio();
  }, [params.ejercicioId, selectedEntrenamiento, ejercicios, fetchEjercicioById]);

  // Si hay un ejercicio seleccionado, mostrar su detalle
  if (selectedEjercicio) {
    const isDescanso = selectedEjercicio._id === DESCANSO_ID;
    // Usamos la propiedad 'tiempo' de nuestro IEjercicioConTiempo
    const tiempo = selectedEjercicio.tiempo || 0;
    
    // Color del icono para los botones de navegación
    const iconColor = isDescanso ? '#60A5FA' : '#6842FF';
    
    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
        <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
        
        <TopNavbar iconBack={true} titulo={capitalizeText(selectedEjercicio.nombre)} />
        
        <View className="flex-1 flex-col py-4">
          {/* Contenido principal */}
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1 }} 
            className="w-full px-3"
            showsVerticalScrollIndicator={false}
          >
            <View className="items-center">
              {/* Tarjeta principal con estilo minimalista */}
              <EjercicioCard
                imagen={imagesMap[selectedEjercicio.imagen] || require("@/assets/ejercicios/trianglePoseImage.webp")}
                label={capitalizeText(selectedEjercicio.nombre)}
                tiempoTotal={tiempo}
                descripcion={selectedEjercicio.descripcion}
                grupo={selectedEjercicio.grupo}
                calorias={selectedEjercicio.caloriasPorSegundo ? tiempo * selectedEjercicio.caloriasPorSegundo : undefined}
                isDescanso={isDescanso}
                isDetailed={true}
              />
              
              {/* Sección de Notas - Diseño minimalista */}
              <View 
                className={`w-[90%] rounded-xl overflow-hidden shadow-xl shadow-gray-800 ${isDarkMode ? 'bg-slate-800/80' : 'bg-white/95'} ${isDarkMode ? 'border border-white/10' : ''}`}
              >
                {/* Encabezado de la sección */}
                <View
                  style={{
                    backgroundColor: isDescanso 
                      ? (isDarkMode ? '#3B82F6' : '#60A5FA') 
                      : (isDarkMode ? '#8B5CF6' : '#8854d9'),
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                  }}
                  className="rounded-t-2xl"
                >
                  <Text className="text-lg font-bold text-white">
                    Notas
                  </Text>
                </View>
                
                {/* Contenido de las notas con más espacio */}
                <View className="px-6 py-4">
                  <View className="rounded-xl">
                    <Text 
                      className={`text-base leading-relaxed ${isDescanso
                        ? (isDarkMode ? 'text-gray-100 ' : 'text-gray-700 ')
                        : (isDarkMode ? 'text-gray-100 ' : 'text-gray-700 ')
                      }`}
                    >
                      {isDescanso
                        ? "Los periodos de descanso son esenciales para la recuperación. Aprovecha para respirar profundamente, hidratar tu cuerpo y prepararte para el siguiente ejercicio."
                        : (selectedEjercicio.descripcion || "No hay notas disponibles para este ejercicio.")}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Botones de navegación en la parte inferior (usando NativeWind) */}
          {selectedEntrenamiento && selectedEntrenamiento.ejercicios && selectedEntrenamiento.ejercicios.length > 1 && (
            <View className="w-full px-3 pb-4 ">
              <View 
                className={`flex flex-row justify-between items-center w-full rounded-2xl p-3 mx-auto shadow-xl shadow-gray-800 ${isDarkMode ? 'bg-slate-800/70' : 'bg-slate-50/95'} ${isDarkMode ? 'border border-slate-700' : ''}`}
              >
                <TouchableOpacity 
                  className={`flex-row items-center py-3 px-5 rounded-xl ${currentIndex > 0 ? 'opacity-100' : 'opacity-50'}`}
                  style={{
                    backgroundColor: isDescanso 
                      ? (isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(96, 165, 250, 0.2)') 
                      : (isDarkMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(136, 84, 217, 0.2)'),
                  }}
                  onPress={() => {
                    if (currentIndex > 0 && selectedEntrenamiento) {
                      const prevIndex = currentIndex - 1;
                      const prevEjercicio = selectedEntrenamiento.ejercicios[prevIndex];
                      const ejercicioConTiempo: IEjercicioConTiempo = {
                        ...prevEjercicio.ejercicioId,
                        nombre: capitalizeText(prevEjercicio.ejercicioId.nombre), // Capitalizar el nombre
                        tiempo: prevEjercicio.tiempo
                      };
                      setSelectedEjercicio(ejercicioConTiempo);
                      setCurrentIndex(prevIndex);
                    }
                  }}
                  disabled={currentIndex <= 0}
                >
                  <MaterialCommunityIcons name="chevron-left" size={28} color={iconColor} />
                  <Text className={`ml-1 font-medium ${isDescanso
                  ? (isDarkMode ? 'text-blue-300' : 'text-blue-600')
                  : (isDarkMode ? 'text-purple-200' : 'text-purple-600')
                }`}>Anterior</Text>
                </TouchableOpacity>
                
                <View className="px-3 ">
                  <Text className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                    {currentIndex + 1} / {selectedEntrenamiento.ejercicios.length}
                  </Text>
                </View>
                
                <TouchableOpacity 
                  className={`flex-row items-center py-3 px-5 rounded-xl ${currentIndex < selectedEntrenamiento.ejercicios.length - 1 ? 'opacity-100' : 'opacity-50'}`}
                  style={{
                    backgroundColor: isDescanso 
                      ? (isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(96, 165, 250, 0.2)') 
                      : (isDarkMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(136, 84, 217, 0.2)'),
                  }}
                  onPress={() => {
                    if (currentIndex < selectedEntrenamiento.ejercicios.length - 1 && selectedEntrenamiento) {
                      const nextIndex = currentIndex + 1;
                      const nextEjercicio = selectedEntrenamiento.ejercicios[nextIndex];
                      const ejercicioConTiempo: IEjercicioConTiempo = {
                        ...nextEjercicio.ejercicioId,
                        nombre: capitalizeText(nextEjercicio.ejercicioId.nombre), // Capitalizar el nombre
                        tiempo: nextEjercicio.tiempo
                      };
                      setSelectedEjercicio(ejercicioConTiempo);
                      setCurrentIndex(nextIndex);
                    }
                  }}
                  disabled={currentIndex >= selectedEntrenamiento.ejercicios.length - 1}
                >
                  <Text className={`mr-1 font-medium  ${isDescanso
                  ? (isDarkMode ? 'text-blue-300' : 'text-blue-600')
                  : (isDarkMode ? 'text-purple-200' : 'text-purple-600')
                }`}>Siguiente</Text>
                  <MaterialCommunityIcons name="chevron-right" size={28} color={iconColor} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  }

  // Mostrar la lista de ejercicios del entrenamiento
  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      
      <TopNavbar iconBack={true} titulo="Ejercicios" />
      
      <View className="px-5 py-4">
        <Text className="text-lg font-semibold" style={{ color: colors.text }}>
          {selectedEntrenamiento?.nombre || "Ejercicios del entrenamiento"}
        </Text>
        <Text style={{ color: colors.secondaryText }}>
          Toca un ejercicio para ver más detalles
        </Text>
      </View>

      <ScrollView 
        className="flex-1 px-5" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {selectedEntrenamiento?.ejercicios.map((ejercicio, idx) => {
          const isDescanso = ejercicio.ejercicioId._id === DESCANSO_ID;
          
          return (
            <EjercicioCard
              key={idx}
              imagen={imagesMap[ejercicio.ejercicioId.imagen] || require("@/assets/ejercicios/trianglePoseImage.webp")}
              label={capitalizeText(ejercicio.ejercicioId.nombre)}
              tiempoTotal={ejercicio.tiempo}
              grupo={ejercicio.ejercicioId.grupo}
              isDescanso={isDescanso}
              onPress={() => {
                // Buscar el ejercicio completo en la lista de ejercicios
                const foundEjercicio = ejercicios.find((e: IEjercicio) => e._id === ejercicio.ejercicioId._id);
                if (foundEjercicio) {
                  // Agregar el tiempo del ejercicio desde el entrenamiento y capitalizar el nombre
                  const ejercicioConTiempo: IEjercicioConTiempo = { 
                    ...foundEjercicio,
                    nombre: capitalizeText(foundEjercicio.nombre), // Asegurar que el nombre esté capitalizado
                    tiempo: ejercicio.tiempo 
                  };
                  setSelectedEjercicio(ejercicioConTiempo);
                }
              }}
            />
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
