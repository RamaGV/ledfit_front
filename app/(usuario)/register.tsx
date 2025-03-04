import React, { useState, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const RegisterScreen = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recordar, setRecordar] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = useCallback(async () => {
    try {
      // Se puede validar que los campos no estén vacíos
      if (!name || !email || !password) {
        setError("Completa todos los campos");
        return;
      }
      const response = await fetch(
        "https://ledfit-back.vercel.app/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        },
      );
      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Error en el registro");
        return;
      }
      const data = await response.json();
      await AsyncStorage.setItem("@token", data.token);
      await AsyncStorage.setItem("@user", JSON.stringify(data.user));
      router.push("/(dashboard)");
    } catch (e: any) {
      console.error(e);
      setError("Error en la conexión");
    }
  }, [name, email, password, router]);

  return (
    <View className="flex-col w-full h-full justify-around bg-[#121212] px-8">
      <Text className="text-4xl text-white font-bold mt-12 mb-4">
        Crea tu cuenta
      </Text>

      <View className="flex-col space-y-6">
        {/* Campo de Nombre */}
        <View className="flex-row items-center bg-gray-800 rounded-lg px-4">
          <TextInput
            className="flex-1 text-white h-12 ml-2"
            placeholder="Nombre"
            placeholderTextColor="#888"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            accessibilityLabel="Nombre"
          />
        </View>

        {/* Campo de Email */}
        <View className="flex-row items-center bg-gray-800 rounded-lg px-4">
          <MaterialIcons name="email" size={20} color="#888" />
          <TextInput
            className="flex-1 text-white h-12 ml-2"
            placeholder="Correo electrónico"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            accessibilityLabel="Correo electrónico"
          />
        </View>

        {/* Campo de Contraseña con toggle de visibilidad */}
        <View className="flex-row items-center bg-gray-800 rounded-lg px-4">
          <MaterialIcons name="lock" size={20} color="#888" />
          <TextInput
            className="flex-1 text-white h-12 ml-2"
            placeholder="Contraseña"
            placeholderTextColor="#888"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            accessibilityLabel="Contraseña"
          />
          <TouchableOpacity
            onPress={() => setShowPassword((prev) => !prev)}
            accessibilityLabel={
              showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
            }
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialIcons
              name={showPassword ? "visibility" : "visibility-off"}
              size={20}
              color="#888"
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>
        </View>

        {/* Opción "Recordarme" */}
        <TouchableOpacity
          className="flex-row items-center justify-center"
          onPress={() => setRecordar(!recordar)}
          accessibilityLabel="Recordarme"
        >
          <View
            className={`w-5 h-5 rounded-md border-2 border-gray-500 mr-3 ${recordar ? "bg-[#6842FF]" : ""}`}
          />
          <Text className="text-white">Recordarme</Text>
        </TouchableOpacity>

        {/* Mensaje de error */}
        {error ? (
          <Text className="text-red-500 text-center">{error}</Text>
        ) : null}

        {/* Botón de registro */}
        <TouchableOpacity
          className="bg-[#6842FF] rounded-lg items-center py-4"
          onPress={handleRegister}
          accessibilityLabel="Registrarse"
        >
          <Text className="text-white text-lg font-bold">Registrarse</Text>
        </TouchableOpacity>
      </View>

      {/* Sección para login social */}
      <View className="flex-row items-center justify-around">
        <View className="w-1/4 border-b border-gray-700" />
        <Text className="text-gray-400 text-center">o continúa con</Text>
        <View className="w-1/4 border-b border-gray-700" />
      </View>

      <View className="flex-row items-center justify-around px-10">
        <TouchableOpacity
          className="items-center w-16 h-12 bg-gray-800 p-3 rounded-lg"
          accessibilityLabel="Registrarse con Facebook"
        >
          <FontAwesome name="facebook" size={24} color="#1877F2" />
        </TouchableOpacity>
        <TouchableOpacity
          className="items-center w-16 h-12 bg-gray-800 p-3 rounded-lg"
          accessibilityLabel="Registrarse con Google"
        >
          <FontAwesome name="google" size={24} color="#DB4437" />
        </TouchableOpacity>
        <TouchableOpacity
          className="items-center w-16 h-12 bg-gray-800 p-3 rounded-lg"
          accessibilityLabel="Registrarse con Apple"
        >
          <FontAwesome name="apple" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center justify-center">
        <Text className="text-gray-400 text-center">
          ¿Ya tienes una cuenta?
        </Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push("/(usuario)/login")}
          accessibilityLabel="Iniciar sesión"
        >
          <Text className="ml-2 text-[#6842FF] font-bold">Inicia sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RegisterScreen;
