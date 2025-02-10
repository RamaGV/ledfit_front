// app/(usuario)/login.tsx

import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import React from "react";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const router = useRouter();

  return (
    <View className="flex-col justify-around bg-[#121212] px-5 h-full">
      <Text className="text-white text-3xl font-semibold text-center">
        ¡Hora de entrenar!
      </Text>

      <View className="flex-col justify-around">
        <TouchableOpacity
          activeOpacity={0.7}
          className="flex-row items-center justify-center py-4 px-5 rounded-xl mb-4 
          bg-[#1E1E1E] border border-gray-600"
          onPress={() => {
            console.log("Continuar con Facebook");
          }}
        >
          <Image
            className="w-7 h-7 mr-3"
            source={require("@/assets/defaultWorkout.png")}
          />
          <Text className="text-white text-center text-base">
            Continuar con Facebook
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          className="flex-row items-center justify-center py-4 px-5 rounded-xl 
          bg-[#1E1E1E] border border-gray-600"
          onPress={() => {
            router.push("/(usuario)/loginGoogle");
          }}
        >
          <Image
            className="w-7 h-7 mr-3"
            source={require("@/assets/defaultWorkout.png")}
          />
          <Text className="text-white text-center text-base">
            Continuar con Google
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        activeOpacity={0.7}
        className="bg-[#7B61FF] py-4 rounded-xl mb-5"
      >
        <Text className="text-white text-center text-base font-semibold">
          Ingresar
        </Text>
      </TouchableOpacity>

      <View className="flex-row justify-center">
        <Text className="text-white text-sm">¿No tienes una cuenta? </Text>
        <Text className="text-[#7B61FF] text-sm">Registrarme</Text>
      </View>
    </View>
  );
}
