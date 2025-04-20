// componentes/usuario/NotifItem.tsx

import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Image } from "expo-image";
import React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Swipeable } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "../../context/ThemeContext";

interface NotifItemProps {
  id: string;
  tipo: "check" | "plus" | "time";
  titulo: string;
  contenido: string;
  fecha: string;
  leida: boolean;
  onPress: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function NotifItem({
  id,
  tipo,
  titulo,
  contenido,
  fecha,
  leida,
  onPress,
  onDelete,
}: NotifItemProps) {
  const { isDarkMode } = useTheme();

  // Cargar iconos directamente
  let icono;
  if (tipo === "plus") {
    icono = require("@/assets/icons/notifPlus.png");
  } else if (tipo === "time") {
    icono = require("@/assets/icons/notifTime.png");
  } else {
    icono = require("@/assets/icons/notifCheck.png");
  }

  // Formatear la fecha
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (date.toDateString() === today.toDateString()) {
        return format(date, "'Hoy,' HH:mm", { locale: es });
      } else if (date.toDateString() === yesterday.toDateString()) {
        return format(date, "'Ayer,' HH:mm", { locale: es });
      } else {
        return format(date, "dd 'de' MMMM, HH:mm", { locale: es });
      }
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Fecha desconocida";
    }
  };

  const bgColor = isDarkMode
    ? !leida
      ? "bg-[#1E1E1E]"
      : "bg-[#181818]"
    : !leida
      ? "bg-white"
      : "bg-gray-50";

  // Renderizar el lado derecho del swipeable (botón de eliminar)
  const renderRightActions = () => {
    // Solo permitir swipe en notificaciones ya leídas
    if (!leida || !onDelete) return null;

    return (
      <View className="flex justify-center ml-2">
        <TouchableOpacity
          className={`justify-center items-center px-5 rounded-xl h-[90%] ${isDarkMode ? "bg-[#FF4757]" : "bg-red-500"}`}
          onPress={() => {
            Alert.alert(
              "Eliminar notificación",
              "¿Estás seguro de que quieres eliminar esta notificación?",
              [
                { text: "Cancelar", style: "cancel" },
                {
                  text: "Eliminar",
                  onPress: () => onDelete(id),
                  style: "destructive",
                },
              ],
            );
          }}
        >
          <Ionicons name="trash-outline" size={24} color="white" />
          <Text className="text-white text-xs mt-1">Eliminar</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Si es swipeable (notificación leída y con handler de eliminación)
  const isSwipeable = leida && !!onDelete;

  // Contenido de la notificación
  const NotificationContent = (
    <TouchableOpacity
      onPress={() => onPress(id)}
      className={`flex-row items-start rounded-xl p-4 mb-4 ${bgColor} ${!leida ? "border-l-4 border-[#6842FF]" : ""}`}
      style={{
        opacity: leida ? 0.9 : 1,
      }}
    >
      <View className="relative">
        <View
          className={`rounded-full p-2 ${!leida ? "bg-[#6842FF20]" : isDarkMode ? "bg-[#20202020]" : "bg-gray-100"}`}
        >
          <Image
            source={icono}
            style={{
              width: 32,
              height: 32,
              tintColor: !leida
                ? "#6842FF"
                : isDarkMode
                  ? "#888888"
                  : "#999999",
            }}
          />
        </View>
        {!leida && (
          <View className="absolute -top-1 -right-1 w-3 h-3 bg-[#6842FF] rounded-full" />
        )}
      </View>

      <View className="flex-1 ml-3">
        {/* Título en su propia línea para evitar colisión con la fecha */}
        <Text
          className={`font-semibold text-base ${
            !leida
              ? isDarkMode
                ? "text-white"
                : "text-[#333333]"
              : isDarkMode
                ? "text-gray-300"
                : "text-gray-600"
          }`}
        >
          {titulo}
        </Text>

        {/* Contenido con color más oscuro para mejor contraste */}
        <Text
          className={`text-sm mt-1 ${
            !leida
              ? isDarkMode
                ? "text-gray-300"
                : "text-gray-700"
              : isDarkMode
                ? "text-gray-400"
                : "text-gray-800"
          }`}
          numberOfLines={2}
        >
          {contenido}
        </Text>

        {/* Fecha en la parte inferior derecha */}
        <View className="flex-row justify-end mt-2">
          <Text
            className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
          >
            {formatDate(fecha)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Envolver en Swipeable si es necesario
  if (isSwipeable) {
    return (
      <Swipeable
        renderRightActions={renderRightActions}
        friction={2}
        rightThreshold={40}
      >
        {NotificationContent}
      </Swipeable>
    );
  }

  // Si no es swipeable, devolver solo el contenido
  return NotificationContent;
}
