// app/(usuario)/login.tsx

import { View, Text, Alert } from "react-native";
import { useUser } from "@/context/UsersContext";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import axios from "axios";

import InputField from "@/components/InputField";
import Button from "@/components/Button";

export default function LoginScreen() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const { setUser } = useUser();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://192.168.1.5:5000/api/auth/login",
        {
          email,
          password,
        },
      );
      const { user } = response.data;
      Alert.alert("Éxito", "Inicio de sesión exitoso");
      setUser(user);
      router.push("/(dashboard)");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.message);
        console.error("Detalles del error:", error.response?.data);
      } else {
        console.error("Error desconocido:", error);
        Alert.alert("Error", "Algo salió mal. Inténtalo de nuevo.");
      }
    }
  };

  return (
    <View className="flex-1 w-full bg-gray-100 justify-center items-center">
      {/* Título */}
      <Text className="text-2xl font-bold text-green-700 mb-6">Ingresar</Text>

      {/* Campos de Entrada */}
      <View className="w-4/5">
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

      {/* Botón de Login */}
      <Button title="INGRESAR" onPress={handleLogin} />
      <View className="flex-1 items justify-center mt-12">
        <Button
          title="REGISTRAR"
          onPress={() => router.push("/(usuario)/register")}
        />
      </View>
    </View>
  );
}
