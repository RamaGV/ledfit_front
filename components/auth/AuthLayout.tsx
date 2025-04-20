import React, { ReactNode } from "react";
import {
  View,
  StatusBar,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface AuthLayoutProps {
  children: ReactNode;
}

/**
 * Layout común para las pantallas de autenticación
 * Incluye el fondo, manejo de teclado y estructura básica
 */
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <LinearGradient
      colors={["#121212", "#1A1A1A"]}
      className="flex-1 bg-[#121212]"
    >
      <StatusBar barStyle="light-content" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="items-center mt-10 mb-3 h-24">
              <Image
                source={require("@/assets/images/icon.png")}
                className="w-20 h-20"
                resizeMode="contain"
              />
            </View>

            <View className="flex-1 px-6 pt-0">{children}</View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
