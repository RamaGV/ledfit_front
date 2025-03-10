// app/(usuario)/logros.tsx
import { View, Text, ScrollView, TouchableOpacity, Dimensions, StatusBar } from "react-native";
import React, { useState } from "react";
import { Image } from 'expo-image';
import { LinearGradient } from "expo-linear-gradient";
import TopNavbar from "@/components/TopNavbar";

import { useUser } from "@/context/UsersContext";
import { HexBadge } from "@/components/usuario/ItemLogro";

export default function Logros() {
  const { user } = useUser();
  const logros = user?.logros ?? [];
  const [selectedCategory, setSelectedCategory] = useState<'check' | 'time' | 'plus'>('check');
  const screenWidth = Dimensions.get('window').width;

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
      case 'check': return require('@/assets/icons/iconFavTrue.png'); // Reemplazar con ícono adecuado
      case 'time': return require('@/assets/icons/iconFavTrue.png'); // Reemplazar con ícono adecuado
      case 'plus': return require('@/assets/icons/iconFavTrue.png'); // Reemplazar con ícono adecuado
      default: return require('@/assets/icons/iconFavTrue.png');
    }
  };

  // Función para renderizar la tarjeta de categoría
  const renderCategoryCard = (category: 'check' | 'time' | 'plus') => {
    const progress = getProgress(category);
    const isSelected = selectedCategory === category;
    
    return (
      <TouchableOpacity 
        onPress={() => setSelectedCategory(category)}
        className={`mr-4 rounded-xl overflow-hidden ${isSelected ? 'border-2 border-[#6842FF]' : 'border border-gray-700'}`}
        style={{ width: screenWidth * 0.7, height: 120 }}
      >
        <LinearGradient
          colors={isSelected ? ['#6842FF20', '#6842FF40'] : ['#20202020', '#20202040']}
          style={{ flex: 1, padding: 16 }}
        >
          <View className="flex-row items-center mb-2">
            <Image
              source={getCategoryIcon(category)}
              style={{ width: 24, height: 24, tintColor: isSelected ? '#6842FF' : '#888' }}
            />
            <Text className="text-white font-bold text-lg ml-2">{getCategoryTitle(category)}</Text>
          </View>
          
          <View className="flex-row items-center justify-between">
            <Text className="text-gray-400 text-sm">{`${progress.obtained}/${progress.total} logros`}</Text>
            <Text className={`font-bold ${isSelected ? 'text-[#6842FF]' : 'text-gray-400'}`}>
              {`${Math.round(progress.percentage)}%`}
            </Text>
          </View>
          
          {/* Barra de progreso */}
          <View className="h-2 bg-gray-800 rounded-full mt-2 overflow-hidden">
            <View 
              className={`h-full ${isSelected ? 'bg-[#6842FF]' : 'bg-gray-600'}`} 
              style={{ width: `${progress.percentage}%` }}
            />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  // Función para renderizar un logro individual con detalles
  const renderLogroDetail = (logro: any, index: number) => {
    return (
      <View key={index} className="flex-row mb-6 items-center">
        <View className="mr-4">
          <HexBadge logroKey={logro.key} obtenido={logro.obtenido} />
        </View>
        <View className="flex-1">
          <Text className={`font-bold text-base ${logro.obtenido ? 'text-white' : 'text-gray-500'}`}>
            {logro.title}
          </Text>
          <Text className={`text-sm mt-1 ${logro.obtenido ? 'text-gray-300' : 'text-gray-600'}`}>
            {logro.content}
          </Text>
          {logro.obtenido && (
            <View className="mt-2 bg-[#6842FF30] px-3 py-1 rounded-full self-start">
              <Text className="text-[#6842FF] text-xs font-medium">Completado</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  // Obtener estadísticas generales
  const totalLogros = logros.length;
  const totalObtenidos = logros.filter(l => l.obtenido).length;
  const porcentajeTotal = totalLogros > 0 ? (totalObtenidos / totalLogros) * 100 : 0;

  return (
    <View className="flex-1 bg-[#121212]">
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <View className="pt-2">
        <TopNavbar titulo="Logros" iconBack={true} />
      </View>

        {/* Resumen de progreso general */}
        <View className="px-5 py-4">
          <View className="bg-[#1E1E1E] rounded-xl p-4 mb-4">
            <Text className="text-white text-lg font-bold mb-2">Tu progreso</Text>
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-gray-400">Logros completados</Text>
              <Text className="text-white font-bold">{`${totalObtenidos}/${totalLogros}`}</Text>
            </View>
            <View className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <View 
                className="h-full bg-[#6842FF]" 
                style={{ width: `${porcentajeTotal}%` }}
              />
            </View>
          </View>
        </View>

        {/* Categorías de logros (ScrollView horizontal) */}
        <View className="mb-4">
          <Text className="text-white text-lg font-bold px-5 mb-3">Categorías</Text>
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
        <Text className="px-5 text-white text-lg font-bold mb-4">
          {getCategoryTitle(selectedCategory)}
        </Text>
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="px-5 ">
            {groupedLogros[selectedCategory].map((logro, index) => 
              renderLogroDetail(logro, index)
            )}
          </View>
        </ScrollView>
    </View>
  );
}
