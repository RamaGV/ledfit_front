// app/(dashboard)/perfil.tsx

import { View, Text, Switch, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { Image } from "expo-image";

import { useUser } from "@/context/UsersContext";

import Item from "@/components/usuario/ItemPerfil";
import TopNavbar from "@/components/TopNavbar";

export default function PerfilScreen() {
  const router = useRouter();

  const { user, logout } = useUser();

  const [darkMode, setDarkMode] = useState(false);

  const handleToggleDarkMode = () => setDarkMode((prev) => !prev);

  const handleNotificaciones = () => {
    router.push("/(usuario)/notificaciones");
  };

  const handleSalir = () => {
    logout();
    router.push("/(usuario)/login");
  };

  return (
    <View className="flex-1 bg-[#121212]">
      {/* Navbar superior */}
      <TopNavbar titulo="Perfil" />

      {/* Contenido principal */}
      <ScrollView className="flex-1 px-4">
        {/* Foto y datos de usuario */}
        <View className="items-center mt-6">
          <View className="relative">
            <Image
              source={{
                uri: "https://randomuser.me/api/portraits/women/32.jpg",
              }}
              className="w-24 h-24 rounded-full"
            />
          </View>

          <Text className="text-white text-xl font-semibold mt-3">
            {user?.name}
          </Text>
          <Text className="text-gray-300 text-sm mt-2">{user?.email}</Text>
        </View>

        {/* Sección de items (Editar perfil, Notificaciones, etc.) */}
        <View className="p-2 mt-6  border-t border-gray-700">
          <Item icono="person-outline" contenido="Editar perfil" />
          <Item
            icono="notifications-outline"
            contenido="Notificaciones"
            onPress={handleNotificaciones}
          />
          <Item icono="settings-outline" contenido="Configuracion" />
          <Item icono="help-circle-outline" contenido="Informacion" />

          {/* Dark Theme */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="moon-outline" size={20} color="#FFF" />
              <Text className="text-white ml-3">Dark Theme</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={handleToggleDarkMode}
              trackColor={{ false: "#767577", true: "#7B61FF" }}
              thumbColor={darkMode ? "#FFF" : "#f4f3f4"}
            />
          </View>
        </View>

        {/* Salir */}
        <View className="w-full border-t border-gray-700 p-2">
          <Item
            icono="log-out-outline"
            contenido="Salir"
            color="#FF4444"
            onPress={handleSalir}
          />
        </View>
      </ScrollView>
    </View>
  );
}
