// app/(usuario)/logros.tsx
import { View, Text, ScrollView, TouchableOpacity, Dimensions, StatusBar } from "react-native";
import React, { useState, useRef } from "react";
import { Image } from 'expo-image';
import { LinearGradient } from "expo-linear-gradient";
import TopNavbar from "@/components/TopNavbar";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";

import { useUser } from "@/context/UsersContext";
import { HexBadge } from "@/components/usuario/ItemLogro";
import { useTheme } from "@/context/ThemeContext";

export default function Logros() {
  const { user } = useUser();
  const { isDarkMode } = useTheme();
  const logros = user?.logros ?? [];
  const [selectedCategory, setSelectedCategory] = useState<'check' | 'time' | 'plus'>('check');
  const screenWidth = Dimensions.get('window').width;
  const scrollRef = useRef<ScrollView>(null);

  // Colores base según el tema
  const backgroundColor = isDarkMode ? '#121212' : '#F5F5F5';
  const cardBackground = isDarkMode ? '#1E1E1E' : '#FFFFFF';
  const textColor = isDarkMode ? '#FFFFFF' : '#121212';
  const textSecondary = isDarkMode ? '#BBBBBB' : '#555555';
  const textMuted = isDarkMode ? '#777777' : '#999999';
  const borderColor = isDarkMode ? '#333333' : '#E0E0E0';
  const accentColor = '#6842FF';
  const accentLight = isDarkMode ? '#6842FF30' : '#6842FF20';

  // Agrupamos los logros por tipo
  const groupedLogros = {
    check: logros.filter((l) => l.type === "check"),
    time: logros.filter((l) => l.type === "time"),
    plus: logros.filter((l) => l.type === "plus"),
  };

  // Calculamos el progreso para cada categoría
  const getProgress = (category: 'check' | 'time' | 'plus') => {
    const categoryLogros = groupedLogros[category];
    const obtained = categoryLogros.filter(l => l.obtenido).length;
    const total = categoryLogros.length;
    return { obtained, total, percentage: total > 0 ? (obtained / total) * 100 : 0 };
  };

  const checkProgress = getProgress('check');
  const timeProgress = getProgress('time');
  const plusProgress = getProgress('plus');

  // Función para obtener el título de la categoría
  const getCategoryTitle = (category: 'check' | 'time' | 'plus') => {
    switch (category) {
      case 'check': return 'Calorías Quemadas';
      case 'time': return 'Tiempo Entrenado';
      case 'plus': return 'Entrenamientos Completados';
      default: return '';
    }
  };

  // Función para obtener el ícono de la categoría
  const getCategoryIcon = (category: 'check' | 'time' | 'plus') => {
    switch (category) {
      case 'check': return 'flame-outline';
      case 'time': return 'timer-outline';
      case 'plus': return 'barbell-outline';
      default: return 'trophy-outline';
    }
  };

  // Función para renderizar la tarjeta de categoría
  const renderCategoryCard = (category: 'check' | 'time' | 'plus') => {
    const progress = getProgress(category);
    const isSelected = selectedCategory === category;
    
    return (
      <TouchableOpacity 
        onPress={() => {
          setSelectedCategory(category);
          // Reset scroll position cuando se cambia de categoría
          scrollRef.current?.scrollTo({ y: 0, animated: true });
        }}
        className={`mr-4 rounded-xl overflow-hidden ${isSelected ? 'border-2 border-[#6842FF]' : `border border-[${borderColor}]`}`}
        style={{ 
          width: screenWidth * 0.7, 
          height: 120, 
          backgroundColor: cardBackground,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3
        }}
      >
        <View style={{ flex: 1, padding: 16 }}>
          <View className="flex-row items-center mb-2">
            <Ionicons 
              name={getCategoryIcon(category)} 
              size={24} 
              color={isSelected ? accentColor : textMuted} 
            />
            <Text style={{ color: textColor, fontWeight: 'bold', fontSize: 18, marginLeft: 8 }}>
              {getCategoryTitle(category)}
            </Text>
          </View>
          
          <View className="flex-row items-center justify-between">
            <Text style={{ color: textSecondary, fontSize: 14 }}>
              {`${progress.obtained}/${progress.total} logros`}
            </Text>
            <Text style={{ 
              fontWeight: 'bold', 
              color: isSelected ? accentColor : textSecondary
            }}>
              {`${Math.round(progress.percentage)}%`}
            </Text>
          </View>
          
          {/* Barra de progreso */}
          <View style={{ 
            height: 8, 
            backgroundColor: isDarkMode ? '#333333' : '#EEEEEE', 
            borderRadius: 4, 
            marginTop: 8, 
            overflow: 'hidden' 
          }}>
            <View 
              style={{ 
                height: '100%', 
                backgroundColor: isSelected ? accentColor : (isDarkMode ? '#555555' : '#CCCCCC'), 
                width: `${progress.percentage}%`,
                borderRadius: 4
              }} 
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Función para renderizar un logro individual con detalles
  const renderLogroDetail = (logro: any, index: number) => {
    // Determinar si el logro debe mostrarse con animación
    const delay = index * 100; // 100ms de retraso entre cada logro

    return (
      <Animated.View 
        key={index} 
        entering={FadeInDown.delay(delay).duration(300)}
        style={{ 
          flexDirection: 'row', 
          marginBottom: 24, 
          alignItems: 'center',
          backgroundColor: cardBackground,
          borderRadius: 16,
          padding: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDarkMode ? 0.2 : 0.1,
          shadowRadius: 4,
          elevation: 2
        }}
      >
        <View className="mr-4">
          <HexBadge 
            logroKey={logro.key} 
            obtenido={logro.obtenido} 
            type={logro.type}
            title={logro.title}
          />
        </View>
        <View className="flex-1">
          <Text style={{ 
            fontWeight: 'bold', 
            fontSize: 16, 
            color: logro.obtenido ? textColor : textMuted,
            marginBottom: 4
          }}>
            {logro.title}
          </Text>
          <Text style={{ 
            fontSize: 14, 
            color: logro.obtenido ? textSecondary : textMuted,
            marginBottom: 8
          }}>
            {logro.content}
          </Text>
          {logro.obtenido ? (
            <View style={{ 
              backgroundColor: accentLight, 
              paddingHorizontal: 12, 
              paddingVertical: 4, 
              borderRadius: 20,
              alignSelf: 'flex-start'
            }}>
              <Text style={{ color: accentColor, fontSize: 12, fontWeight: '600' }}>
                Completado
              </Text>
            </View>
          ) : (
            <View style={{ 
              backgroundColor: isDarkMode ? '#33333330' : '#EEEEEE', 
              paddingHorizontal: 12, 
              paddingVertical: 4, 
              borderRadius: 20,
              alignSelf: 'flex-start'
            }}>
              <Text style={{ color: textMuted, fontSize: 12 }}>
                Pendiente
              </Text>
            </View>
          )}
        </View>
      </Animated.View>
    );
  };

  // Obtener estadísticas generales
  const totalLogros = logros.length;
  const totalObtenidos = logros.filter(l => l.obtenido).length;
  const porcentajeTotal = totalLogros > 0 ? (totalObtenidos / totalLogros) * 100 : 0;

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={backgroundColor} />
      <View className="pt-2">
        <TopNavbar titulo="Logros" iconBack={true} />
      </View>

      {/* Resumen de progreso general */}
      <View className="px-5 py-4">
        <View style={{ 
          backgroundColor: cardBackground, 
          borderRadius: 16, 
          padding: 16, 
          marginBottom: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 2
        }}>
          <Text style={{ color: textColor, fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
            Tu progreso
          </Text>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: textSecondary, marginBottom: 4 }}>
                Logros completados
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                <Text style={{ color: textColor, fontWeight: 'bold', fontSize: 24, marginRight: 4 }}>
                  {totalObtenidos}
                </Text>
                <Text style={{ color: textSecondary }}>
                  de {totalLogros}
                </Text>
              </View>
            </View>
            
            <View style={{ 
              width: 70, 
              height: 70, 
              borderRadius: 35, 
              borderWidth: 5,
              borderColor: accentColor,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: isDarkMode ? '#1A1A1A' : '#F9F9F9'
            }}>
              <Text style={{ color: accentColor, fontWeight: 'bold', fontSize: 18 }}>
                {`${Math.round(porcentajeTotal)}%`}
              </Text>
            </View>
          </View>
          
          <View style={{ 
            height: 8, 
            backgroundColor: isDarkMode ? '#333333' : '#EEEEEE', 
            borderRadius: 4, 
            overflow: 'hidden',
            marginTop: 8
          }}>
            <View 
              style={{ 
                height: '100%', 
                backgroundColor: accentColor, 
                width: `${porcentajeTotal}%`,
                borderRadius: 4
              }} 
            />
          </View>
        </View>
      </View>

      {/* Categorías de logros (ScrollView horizontal) */}
      <View className="mb-6">
        <Text style={{ color: textColor, fontSize: 18, fontWeight: 'bold', paddingHorizontal: 20, marginBottom: 12 }}>
          Categorías
        </Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 20, paddingRight: 10 }}
          className="mb-2"
        >
          {renderCategoryCard('check')}
          {renderCategoryCard('time')}
          {renderCategoryCard('plus')}
        </ScrollView>
      </View>

      {/* Lista detallada de logros de la categoría seleccionada */}
      <View className="px-5 flex-row justify-between items-center mb-4">
        <Text style={{ color: textColor, fontSize: 18, fontWeight: 'bold' }}>
          {getCategoryTitle(selectedCategory)}
        </Text>
        <View style={{ 
          backgroundColor: accentLight, 
          paddingHorizontal: 10, 
          paddingVertical: 3, 
          borderRadius: 12
        }}>
          <Text style={{ color: accentColor, fontWeight: '600', fontSize: 13 }}>
            {`${getProgress(selectedCategory).obtained}/${getProgress(selectedCategory).total}`}
          </Text>
        </View>
      </View>
      
      <ScrollView 
        ref={scrollRef}
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="px-5">
          {groupedLogros[selectedCategory].map((logro, index) => 
            renderLogroDetail(logro, index)
          )}
        </View>
      </ScrollView>
    </View>
  );
}
