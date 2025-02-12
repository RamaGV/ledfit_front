import React, { useState } from "react";
import { View, Text, Alert } from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";

import InputField from "@/components/InputField";
import Button from "@/components/Button";

import { useUser } from "@/context/UsersContext";

export default function RegisterScreen() {
  const router = useRouter();

  // Estados para los campos de registro
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Si quieres iniciar sesión automáticamente:
  const { setUser } = useUser();

  const handleRegister = async () => {
    try {
      const response = await axios.post(
        "http://192.168.1.5:5000/api/auth/register",
        {
          name,
          email,
          password,
        },
      );
      // Backend debe retornar { token, user: { id, name, email } }
      const { token, user } = response.data;

      Alert.alert("¡Registro exitoso!", "Tu cuenta ha sido creada");

      // OPCIÓN A: Guardar token y user en tu contexto => usuario se registra y loguea de inmediato
      // Ejemplo:
      // setUser({ ...user, token });
      // router.push("/(dashboard)");

      // OPCIÓN B: Solo notificar y redirigir al login
      // Ejemplo:
      router.push("/(usuario)/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.message);
        console.error("Detalles del error:", error.response?.data);
        Alert.alert(
          "Error de registro",
          error.response?.data?.message ||
            "Revisa los campos e inténtalo de nuevo",
        );
      } else {
        console.error("Error desconocido:", error);
        Alert.alert("Error", "Algo salió mal. Inténtalo de nuevo.");
      }
    }
  };

  return (
    <View className="flex-1 w-full bg-gray-100 justify-center items-center">
      <Text className="text-2xl font-bold text-green-700 mb-6">
        Crear Cuenta
      </Text>

      <View className="w-4/5">
        <InputField placeholder="Nombre" value={name} onChangeText={setName} />
        <InputField
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
        />
        <InputField
          placeholder="Contraseña"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <Button title="REGISTRARSE" onPress={handleRegister} />
    </View>
  );
}
