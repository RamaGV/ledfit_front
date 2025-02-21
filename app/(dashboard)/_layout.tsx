// app/(dashboard)/_layout.tsx

import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#121212",
            borderTopColor: "#1E1E1E",
          },
          tabBarActiveTintColor: "#6842FF",
          tabBarInactiveTintColor: "#888",
          tabBarBackground: undefined,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <Ionicons name="home" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="entrenar"
          options={{
            title: "Entrenar",
            tabBarIcon: ({ color }) => (
              <Ionicons name="play-circle" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="perfil"
          options={{
            title: "Perfil",
            tabBarIcon: ({ color }) => (
              <Ionicons name="person-circle" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
