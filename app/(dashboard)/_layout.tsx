// app/(dashboard)/_layout.tsx

import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { View, Platform } from "react-native";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TabBarIcon = ({ name, color }: { name: any; color: string }) => {
  return (
    <View style={{ 
      alignItems: 'center', 
      justifyContent: 'center',
      paddingTop: 8,
      width: 60,
      height: 50,
    }}>
      <Ionicons name={name} size={24} color={color} />
    </View>
  );
};

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  
  // Altura base del TabBar
  const baseHeight = 60;
  // Altura total incluyendo el área segura en la parte inferior
  const totalHeight = baseHeight + insets.bottom;
  
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(100, 100, 100, 0.50)',
          borderTopWidth: 0,
          elevation: 0,
          height: totalHeight,
          paddingBottom: insets.bottom,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          // Efecto de cristal en iOS (notch del iPhone)
          ...(Platform.OS === 'ios' ? {
            overflow: 'hidden',
            borderTopColor: 'transparent',
          } : {}),
        },
        tabBarActiveTintColor: "#8A6FFF", // Un poco más brillante que el color original
        tabBarInactiveTintColor: "#888",
        tabBarBackground: () => (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              borderTopWidth: 0,
              borderTopColor: 'transparent',
              borderBottomWidth: 40,
              borderBottomColor: 'transparent',
              overflow: 'hidden',
              backgroundColor: 'rgba(18, 18, 18, 0.75)',
            }}
          >
            {Platform.OS === 'ios' && (
              <BlurView
                intensity={25}
                tint="dark"
                style={{
                  flex: 1,
                }}
              />
            )}
          </View>
        ),
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
          fontWeight: '500',
        },
        // Ajustamos el espacio inferior para que no tape el contenido en las pantallas de Perfil y Entrenar
        ...(route.name === 'perfil' || route.name === 'entrenar' ? {
          contentStyle: {
            paddingBottom: totalHeight,
          }
        } : {}),
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="entrenar"
        options={{
          title: "Entrenar",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="play-circle" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="person-circle" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
