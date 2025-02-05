// app/(profile)/login.tsx
import React from "react";
import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";

export default function LoginScreen() {
  return (
    <View className="flex-1 bg-[#121212] px-5 justify-center">
      <Text className="text-white text-3xl font-semibold mb-10">
        ¡Hora de entrenar!
      </Text>

      <View className="mb-5">
        <Pressable
          className="bg-[#1E1E1E] py-4 px-5 rounded-lg mb-3"
          onPress={() => {
            // Aquí puedes implementar la lógica de autenticación con Facebook
            console.log("Continuar con Facebook");
          }}
        >
          <Text className="text-white text-center text-base">
            Continuar con Facebook
          </Text>
        </Pressable>

        <Pressable
          className="bg-[#1E1E1E] py-4 px-5 rounded-lg mb-3"
          onPress={() => {
            // Lógica para iniciar login con Google
            console.log("Continuar con Google");
          }}
        >
          <Text className="text-white text-center text-base">
            Continuar con Google
          </Text>
        </Pressable>

        <Pressable
          className="bg-[#1E1E1E] py-4 px-5 rounded-lg mb-3"
          onPress={() => {
            // Lógica para iniciar login con Apple
            console.log("Continuar con Apple");
          }}
        >
          <Text className="text-white text-center text-base">
            Continuar con Apple
          </Text>
        </Pressable>
      </View>

      <Link href="/(profile)/ingresar" asChild>
        <Pressable className="bg-[#7B61FF] py-4 rounded-lg mb-5">
          <Text className="text-white text-center text-base font-semibold">
            Ingresar
          </Text>
        </Pressable>
      </Link>

      <View className="flex-row justify-center">
        <Text className="text-white text-sm">¿No tienes una cuenta? </Text>
        <Link href="/(profile)/registrarme">
          <Text className="text-[#7B61FF] text-sm">Registrarme</Text>
        </Link>
      </View>
    </View>
  );
}
