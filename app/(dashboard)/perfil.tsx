// app/(dashboard)/perfil.tsx

import { View, Text, Switch, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";

import { useUser } from "../../context/UsersContext";
import { useTheme } from "../../context/ThemeContext";
import axiosInstance from "../../api/axiosInstance";

import Item from "../../components/usuario/ItemPerfil";

export default function PerfilScreen() {
  const router = useRouter();

  const { user, logout } = useUser();

  const { isDarkMode, toggleTheme } = useTheme();

  // Estado para la conexión del board
  const [isBoardConnected, setIsBoardConnected] = useState<boolean | null>(
    null,
  ); // null = loading/unknown
  const [boardStatusError, setBoardStatusError] = useState<string | null>(null);

  // Función para obtener el estado del board
  const fetchBoardStatus = async () => {
    console.log("Fetching board status...");
    setBoardStatusError(null); // Limpiar error anterior
    try {
      const response = await axiosInstance.get("/boards/status"); // axiosInstance maneja el token
      console.log("Board status response:", response.data);
      setIsBoardConnected(response.data.isConnected);
    } catch (error: any) {
      console.error(
        "Error fetching board status (Axios):",
        error.response?.data || error.message,
      );
      setIsBoardConnected(false); // Asumir desconectado en caso de error
      if (error.response?.status === 404) {
        setBoardStatusError("No tienes un board vinculado."); // Mensaje específico para 404
      } else {
        setBoardStatusError("Error al obtener estado del board.");
      }
    }
  };

  // useEffect para buscar el estado del board periódicamente
  useEffect(() => {
    // Buscar inmediatamente al montar
    fetchBoardStatus();

    // Establecer intervalo para buscar cada 10 segundos
    const intervalId = setInterval(() => {
      fetchBoardStatus();
    }, 10000); // 10000 ms = 10 segundos

    // Limpiar intervalo al desmontar el componente
    return () => clearInterval(intervalId);
  }, []); // El array vacío asegura que se ejecute solo al montar y desmontar

  // Formatear el tiempo (de segundos a formato legible)
  const formatTiempo = (seconds: number | undefined) => {
    if (!seconds) return "0h 0m";
    const horas = Math.floor(seconds / 3600);
    const minutos = Math.floor((seconds % 3600) / 60);
    return `${horas}h ${minutos}m`;
  };

  // Calcular porcentaje de logros obtenidos
  const calcularPorcentajeLogros = () => {
    if (!user?.logros || user.logros.length === 0) return 0;

    const logrosObtenidos = user.logros.filter(
      (logro) => logro.obtenido,
    ).length;
    return Math.round((logrosObtenidos / user.logros.length) * 100);
  };

  const handleToggleDarkMode = () => {
    toggleTheme();
  };

  const handleSalir = () => {
    logout();
    router.push("/(usuario)/login");
  };

  // Colores según el tema
  const bgColor = isDarkMode ? "#121212" : "#F5F5F5";
  const cardBgColor = isDarkMode ? "#1E1E1E" : "#FFFFFF";
  const textColor = isDarkMode ? "#FFFFFF" : "#121212";
  const secondaryTextColor = isDarkMode ? "#9E9E9E" : "#757575";

  // Determinar color del borde del avatar
  const avatarBorderColor =
    isBoardConnected === true
      ? "#2ECC71" // Verde si conectado
      : isBoardConnected === false
        ? "#E74C3C" // Rojo si desconectado o error o sin board
        : "#6842FF"; // Púrpura mientras carga (null)

  return (
    <View className="flex-1" style={{ backgroundColor: bgColor }}>
      {/* <TopNavbar titulo="Perfil" /> */}

      {/* Contenido principal */}
      <View className="flex-1 px-4 pt-6">
        {/* Tarjeta de perfil */}
        <View
          className="rounded-2xl p-5 mt-5 shadow-lg"
          style={{
            backgroundColor: cardBgColor,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDarkMode ? 0.3 : 0.1,
            shadowRadius: 8,
            elevation: 5,
          }}
        >
          <View className="flex-row items-center">
            <Image
              source={{
                uri: "https://randomuser.me/api/portraits/women/32.jpg",
              }}
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                borderWidth: 3,
                borderColor: avatarBorderColor,
              }}
            />
            <View className="ml-4 flex-1">
              <Text
                style={{ color: textColor, fontSize: 20, fontWeight: "600" }}
              >
                {user?.name}
              </Text>
              <Text
                style={{
                  color: secondaryTextColor,
                  fontSize: 14,
                  marginTop: 4,
                }}
              >
                {user?.email}
              </Text>

              <View
                style={{
                  backgroundColor: "#6842FF20",
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 50,
                  alignSelf: "flex-start",
                  marginTop: 8,
                }}
              >
                <Text
                  style={{ color: "#6842FF", fontSize: 12, fontWeight: "500" }}
                >
                  {user?.entrenamientosCompletos} entrenamientos
                </Text>
              </View>
            </View>
          </View>
          {/* Mostrar error de estado del board si existe */}
          {boardStatusError && (
            <Text
              style={{
                color: "#E74C3C",
                fontSize: 12,
                textAlign: "center",
                marginTop: 10,
              }}
            >
              {boardStatusError}
            </Text>
          )}
        </View>

        {/* Estadísticas rápidas */}
        <View className="flex-row justify-between my-4">
          <View
            className="flex-1 rounded-2xl p-4 mr-2 items-center shadow-md"
            style={{
              backgroundColor: cardBgColor,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: isDarkMode ? 0.3 : 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Ionicons name="flame-outline" size={24} color="#FF4D4D" />
            <Text style={{ color: textColor, fontWeight: "600", marginTop: 8 }}>
              {user?.caloriasQuemadas?.toLocaleString() || "0"}
            </Text>
            <Text style={{ color: secondaryTextColor, fontSize: 12 }}>
              Calorías
            </Text>
          </View>

          <View
            className="flex-1 rounded-2xl p-4 ml-2 items-center shadow-md"
            style={{
              backgroundColor: cardBgColor,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: isDarkMode ? 0.3 : 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Ionicons name="time-outline" size={24} color="#6842FF" />
            <Text style={{ color: textColor, fontWeight: "600", marginTop: 8 }}>
              {formatTiempo(user?.tiempoEntrenado)}
            </Text>
            <Text style={{ color: secondaryTextColor, fontSize: 12 }}>
              Tiempo total
            </Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-6 pb-36">
        {/* Progreso de logros */}
        <View
          className="rounded-2xl p-5 mb-4 shadow-md"
          style={{
            backgroundColor: cardBgColor,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDarkMode ? 0.3 : 0.1,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Text style={{ color: textColor, fontWeight: "600" }}>
              Progreso de logros
            </Text>
            <Text style={{ color: "#6842FF", fontWeight: "600" }}>
              {calcularPorcentajeLogros()}%
            </Text>
          </View>

          <View
            style={{
              height: 8,
              backgroundColor: isDarkMode ? "#2A2A2A" : "#E0E0E0",
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                height: 8,
                backgroundColor: "#6842FF",
                width: `${calcularPorcentajeLogros()}%`,
                borderRadius: 4,
              }}
            />
          </View>

          <TouchableOpacity
            style={{
              alignSelf: "center",
              marginTop: 16,
              flexDirection: "row",
              alignItems: "center",
            }}
            onPress={() => router.push("/(usuario)/logros")}
          >
            <Text
              style={{ color: "#6842FF", fontWeight: "500", marginRight: 4 }}
            >
              Ver todos mis logros
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#6842FF" />
          </TouchableOpacity>
        </View>

        {/* Sección de ajustes */}
        <View
          className="rounded-2xl p-4 mb-4 shadow-md"
          style={{
            backgroundColor: cardBgColor,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDarkMode ? 0.3 : 0.1,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <Text
            style={{
              color: textColor,
              fontSize: 16,
              fontWeight: "600",
              marginBottom: 16,
            }}
          >
            Ajustes
          </Text>

          <Item
            icono="person-outline"
            contenido="Editar perfil"
            color={textColor}
            onPress={() => router.push("/(usuario)/editarPerfil")}
          />

          <Item
            icono="notifications-outline"
            contenido="Notificaciones"
            color={textColor}
            onPress={() => router.push("/(usuario)/notificaciones")}
          />

          <Item
            icono="information-circle-outline"
            contenido="Información"
            color={textColor}
            onPress={() => router.push("/(usuario)/informacion")}
          />

          {/* Dark Theme */}
          <View className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center">
              <Ionicons name="moon-outline" size={25} color={textColor} />
              <Text style={{ color: textColor, marginLeft: 12 }}>
                Dark Theme
              </Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={handleToggleDarkMode}
              trackColor={{ false: "#767577", true: "#6842FF" }}
              thumbColor={isDarkMode ? "#FFF" : "#f4f3f4"}
            />
          </View>
        </View>

        {/* Botón de Salir */}
        <TouchableOpacity
          onPress={handleSalir}
          className="mb-28 rounded-2xl overflow-hidden shadow-lg"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDarkMode ? 0.3 : 0.1,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <LinearGradient
            colors={["#FF4444", "#FF6B6B"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="flex-row items-center justify-center py-5 px-6 rounded-2xl"
          >
            <Ionicons name="log-out-outline" size={24} color="white" />
            <Text className="text-white font-semibold ml-2">Cerrar Sesión</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
