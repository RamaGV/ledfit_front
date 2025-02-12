// app/(usuario)/login.tsx

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Google from "expo-auth-session/providers/google";
import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import * as WebBrowser from "expo-web-browser";
import { Image } from "expo-image";

WebBrowser.maybeCompleteAuthSession();

interface UserInfo {
  picture: string;
  email: string;
  verified_email: boolean;
  name: string;
}

export default function LoginScreen() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [token, setToken] = useState("");
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "549244597082-r2g88tr26v7v1sujt5pl42n5p2qpt647.apps.googleusercontent.com",
  });

  useEffect(() => {
    handleEffect();
  }, [response, token]);

  async function handleEffect() {
    const user = await getLocalUser();
    console.log("user", user);
    if (!user) {
      if (response?.type === "success") {
        // setToken(response.authentication.accessToken);
        getUserInfo(response.authentication?.accessToken);
      }
    } else {
      setUserInfo(user);
      console.log("loaded locally");
    }
  }

  const getLocalUser = async () => {
    const data = await AsyncStorage.getItem("@user");
    if (!data) return null;
    return JSON.parse(data);
  };

  const getUserInfo = async (token: any) => {
    if (!token) return;
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const user = await response.json();
      await AsyncStorage.setItem("@user", JSON.stringify(user));
      setUserInfo(user);
    } catch (error) {
      // Add your own error handler here
    }
  };

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
        {!userInfo ? (
          <TouchableOpacity
            activeOpacity={0.7}
            className="flex-row items-center justify-center py-4 px-5 rounded-xl 
          bg-[#1E1E1E] border border-gray-600"
            disabled={!request}
            onPress={() => {
              promptAsync();
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
        ) : (
          <View className="border border-gray-600 rounded-xl p-4">
            {userInfo?.picture && (
              <Image
                className="w-7 h-7 mr-3"
                source={{ uri: userInfo.picture }}
              />
            )}
            <Text className="text-white text-center text-base">
              Email: {userInfo.email}
            </Text>
            <Text className="text-white text-center text-base">
              Verified: {userInfo.verified_email ? "yes" : "no"}
            </Text>
            <Text className="text-white text-center text-base">
              Name: {userInfo.name}
            </Text>
          </View>
        )}
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
