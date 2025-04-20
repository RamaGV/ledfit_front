// app/index.tsx

import { Redirect } from "expo-router";
import { useUser } from "../context/UsersContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { View, ActivityIndicator, Text } from "react-native";

/**
 * Pantalla de índice principal de la aplicación
 * Redirige al usuario según su estado de autenticación
 */
export default function IndexScreen() {
  const { user } = useUser();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("@token");
        console.log(
          "Verificando autenticación en índice principal:",
          token ? "Token encontrado" : "Sin token",
        );
        setTimeout(() => setChecking(false), 500); // Breve pausa para permitir que se cargue el contexto
      } catch (error) {
        console.error("Error verificando autenticación:", error);
        setChecking(false);
      }
    };

    checkAuth();
  }, []);

  if (checking) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#121212",
        }}
      >
        <ActivityIndicator size="large" color="#6842FF" />
        <Text style={{ marginTop: 10, color: "white" }}>
          Iniciando aplicación...
        </Text>
      </View>
    );
  }

  if (user) {
    console.log("Usuario autenticado, redirigiendo a dashboard");
    return <Redirect href="/(dashboard)" />;
  } else {
    console.log("Usuario no autenticado, redirigiendo a login");
    return <Redirect href="/(usuario)/login" />;
  }
}
