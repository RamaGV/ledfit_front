import { View, Text, TextInput, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import { useRouter } from "expo-router";

const RegisterScreen = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [recordar, setRecordar] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    try {
      console.log(name, email, password);
      const response = await fetch(
        "http://192.168.1.5:5000/api/auth/register",
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
    } catch (e) {
      console.error(e);
      setError("Error en la conexión");
    }
  };

  return (
    <View className="flex-col w-full h-full justify-around bg-gray-900 px-8">
      <Text className="text-4xl text-white font-bold mt-12 mb-4">
        Crea tu cuenta
      </Text>

      <View className="flex-col space-y-6">
        <View className="flex-row items-center bg-gray-800 rounded-lg px-4">
          <TextInput
            className="flex-1 text-white h-12 ml-2"
            placeholder="Nombre"
            placeholderTextColor="#888"
            value={name}
            onChangeText={setName}
          />
        </View>
        <View className="flex-row items-center bg-gray-800 rounded-lg px-4">
          <MaterialIcons name="email" size={20} color="#888" />
          <TextInput
            className="flex-1 text-white h-12 ml-2"
            placeholder="Correo electrónico"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View className="flex-row items-center bg-gray-800 rounded-lg px-4 ">
          <MaterialIcons name="lock" size={20} color="#888" />
          <TextInput
            className="flex-1 text-white h-12 ml-2"
            placeholder="Contraseña"
            placeholderTextColor="#888"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <MaterialIcons
            name="visibility-off"
            size={20}
            color="#888"
            className="ml-2"
          />
        </View>

        <TouchableOpacity
          className="flex-row items-center justify-center"
          onPress={() => setRecordar(!recordar)}
        >
          <View
            className={`w-5 h-5 rounded-md border-2 border-gray-500 mr-3 ${recordar ? "bg-[#7B61FF]" : ""}`}
          />
          <Text className="text-white">Recordarme</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-[#7B61FF] rounded-lg items-center py-4"
          onPress={handleRegister}
        >
          <Text className="text-white text-lg font-bold">Registrarse</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center justify-around">
        <View className="w-1/4 border-b border-gray-700" />
        <Text className="text-gray-400 text-center ">o continúa con</Text>
        <View className="w-1/4 border-b border-gray-700" />
      </View>

      <View className="flex-row items-center justify-around px-12">
        <TouchableOpacity className="items-center w-16 h-12 bg-gray-800 p-3 rounded-lg">
          <FontAwesome name="facebook" size={24} color="#1877F2" />
        </TouchableOpacity>
        <TouchableOpacity className="items-center w-16 h-12 bg-gray-800 p-3 rounded-lg">
          <FontAwesome name="google" size={24} color="#DB4437" />
        </TouchableOpacity>
        <TouchableOpacity className="items-center w-16 h-12 bg-gray-800 p-3 rounded-lg">
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
        >
          <Text className="ml-2 text-[#7B61FF] font-bold">Inicia sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RegisterScreen;
