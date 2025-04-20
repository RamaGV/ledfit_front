// app/(usuario)/notificaciones.tsx

import React, { useContext, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
} from "react-native";
import { Image } from "expo-image";
import { useFocusEffect } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import TopNavbar from "../../components/TopNavbar";
import NotifItem from "../../components/usuario/NotifiItem";
import { NotificationsContext } from "../../context/NotificationsContext";
import { useTheme } from "../../context/ThemeContext";

export default function NotificationScreen({ navigation }: any) {
  const {
    notifications,
    unreadCount,
    refreshNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getGroupedNotifications,
  } = useContext(NotificationsContext);
  const { isDarkMode } = useTheme();

  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Refrescar notificaciones cuando la pantalla obtiene el foco
  useFocusEffect(
    useCallback(() => {
      const loadNotifications = async () => {
        setIsLoading(true);
        await refreshNotifications();
        setIsLoading(false);
      };

      loadNotifications();
    }, []),
  );

  // Función para manejar el pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await refreshNotifications();
    setRefreshing(false);
  };

  // Manejar cuando se presiona una notificación
  const handleNotificationPress = async (notificationId: string) => {
    await markAsRead(notificationId);
  };

  // Manejar cuando se elimina una notificación
  const handleNotificationDelete = async (notificationId: string) => {
    await deleteNotification(notificationId);
  };

  // Obtener notificaciones agrupadas por fecha
  const groupedNotifications = getGroupedNotifications();
  const dateKeys = Object.keys(groupedNotifications);

  // Renderizar el contenido según el estado
  const renderContent = () => {
    if (isLoading && notifications.length === 0) {
      return (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#6842FF" />
        </View>
      );
    }

    if (notifications.length === 0) {
      return (
        <View className="flex-1 justify-center items-center px-6">
          <Image
            source={require("@/assets/icons/iconFavTrue.png")}
            style={{
              width: 80,
              height: 80,
              tintColor: isDarkMode ? "#333" : "#999",
              marginBottom: 20,
            }}
          />
          <Text
            className={`text-lg font-bold text-center mb-2 ${isDarkMode ? "text-white" : "text-[#333333]"}`}
          >
            No tienes notificaciones
          </Text>
          <Text
            className={`text-center ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            Cuando recibas notificaciones sobre logros o actualizaciones,
            aparecerán aquí.
          </Text>
        </View>
      );
    }

    return (
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#6842FF"]}
            tintColor="#6842FF"
          />
        }
      >
        <View className="px-5 pb-10">
          {dateKeys.map((dateKey) => (
            <View key={dateKey} className="mb-4">
              {/* Encabezado de la sección de fecha */}
              <View className="flex-row items-center mb-2">
                <View
                  className={`flex-1 h-[1px] ${isDarkMode ? "bg-gray-800" : "bg-gray-300"}`}
                />
                <Text
                  className={`text-xs mx-3 ${isDarkMode ? "text-gray-500" : "text-gray-600"}`}
                >
                  {dateKey}
                </Text>
                <View
                  className={`flex-1 h-[1px] ${isDarkMode ? "bg-gray-800" : "bg-gray-300"}`}
                />
              </View>

              {/* Notificaciones de esta fecha */}
              {groupedNotifications[dateKey].map((notif) => (
                <NotifItem
                  key={notif._id}
                  id={notif._id}
                  tipo={notif.type}
                  titulo={notif.title}
                  contenido={notif.content}
                  fecha={notif.date}
                  leida={notif.read}
                  onPress={handleNotificationPress}
                  onDelete={handleNotificationDelete}
                />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View
        className={`flex-1 ${isDarkMode ? "bg-[#121212]" : "bg-[#EFEEE9]"}`}
      >
        <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

        {/* Usando TopNavbar sin repetir el título en el resto de la página */}
        <TopNavbar titulo="Notificaciones" iconBack={true} />

        {/* Cabecera con contador y botón de marcar todo como leído, solo cuando hay notificaciones */}
        {notifications.length > 0 && (
          <View className="flex-row justify-between items-center px-5 py-3">
            <View className="flex-row items-center">
              {unreadCount > 0 && (
                <View className="bg-[#6842FF] rounded-full w-6 h-6 items-center justify-center">
                  <Text className="text-white text-xs font-bold">
                    {unreadCount}
                  </Text>
                </View>
              )}
              <Text
                className={`text-base ml-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
              >
                No leídas
              </Text>
            </View>

            {unreadCount > 0 && (
              <TouchableOpacity
                onPress={markAllAsRead}
                className={`px-3 py-1 rounded-full ${isDarkMode ? "bg-[#1E1E1E]" : "bg-white"}`}
              >
                <Text className="text-[#6842FF] text-xs font-medium">
                  Marcar todas como leídas
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Contenido principal */}
        {renderContent()}
      </View>
    </GestureHandlerRootView>
  );
}
