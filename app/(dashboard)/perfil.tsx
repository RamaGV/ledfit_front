import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Switch,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TopNavbar from "@/components/TopNavbar";
import { useRouter } from "expo-router";

function Item({
  contenido,
  icono,
  color,
  onPress,
}: {
  contenido: string;
  icono: string;
  color?: string;
  onPress?: () => void;
}) {
  if (!color) {
    color = "#FFF";
  }
  return (
    <TouchableOpacity className="flex-row items-center py-3" onPress={onPress}>
      <Ionicons name={icono as any} size={20} color={color} />
      <Text className={`text-[${color}] ml-3`}>{contenido}</Text>
    </TouchableOpacity>
  );
}

export default function PerfilScreen() {
  const router = useRouter();

  // Ejemplo de control para el toggle “Dark Theme”
  const [darkMode, setDarkMode] = useState(false);
  const handleToggleDarkMode = () => setDarkMode((prev) => !prev);

  const handleNotificaciones = () => {
    router.push("/(usuario)/notificaciones");
  };

  const handleSalir = () => {
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
            {/* Botón de edición en la foto */}
            {/* <TouchableOpacity className="absolute right-0 bottom-0 bg-[#7B61FF] p-1 rounded-full">
              <Ionicons name="camera" size={16} color="#FFF" />
            </TouchableOpacity> */}
          </View>

          <Text className="text-white text-xl font-semibold mt-3">
            Christina Ainsley
          </Text>
          <Text className="text-gray-300 text-sm">
            christina_ainsley@gmail.com
          </Text>
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
