import React from "react";
import { View, Text } from "react-native";
import SocialButton from "./SocialButton";
import GoogleLoginButton from "./GoogleLoginButton";

interface SocialLoginSectionProps {
  onFacebookPress: () => void;
  onGooglePress?: () => void;
  onApplePress: () => void;
  type: "login" | "register";
  useNativeGoogleAuth?: boolean;
}

const SocialLoginSection: React.FC<SocialLoginSectionProps> = ({
  onFacebookPress,
  onGooglePress,
  onApplePress,
  type,
  useNativeGoogleAuth = false,
}) => {
  const actionText = type === "login" ? "iniciar sesión" : "registrarte";

  const handleGooglePress = () => {
    if (onGooglePress) {
      onGooglePress();
    } else {
      console.warn("No se proporcionó un manejador para Google Sign-In");
    }
  };

  return (
    <View className="w-full my-5">
      <View className="flex-row items-center justify-center mb-8">
        <View className="flex-1 h-[1px] bg-white/10" />
        <Text className="text-gray-400 mx-2 text-sm">o continúa con</Text>
        <View className="flex-1 h-[1px] bg-white/10" />
      </View>

      {useNativeGoogleAuth ? (
        <View className="w-full mb-4">
          <GoogleLoginButton type={type} />
        </View>
      ) : (
        <View className="flex-row justify-evenly w-full">
          <SocialButton
            icon="facebook"
            onPress={onFacebookPress}
            accessibilityLabel={`${type === "login" ? "Iniciar sesión" : "Registrarse"} con Facebook`}
          />
          <SocialButton
            icon="google"
            onPress={handleGooglePress}
            accessibilityLabel={`${type === "login" ? "Iniciar sesión" : "Registrarse"} con Google`}
          />
          <SocialButton
            icon="apple"
            onPress={onApplePress}
            accessibilityLabel={`${type === "login" ? "Iniciar sesión" : "Registrarse"} con Apple`}
          />
        </View>
      )}
    </View>
  );
};

export default SocialLoginSection;
