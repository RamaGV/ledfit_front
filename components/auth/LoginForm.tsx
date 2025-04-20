import React from "react";
import { View, Text } from "react-native";
import InputField from "./InputField";
import PrimaryButton from "./PrimaryButton";
import Checkbox from "./Checkbox";

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  remember: boolean;
  toggleRemember: () => void;
  showPassword: boolean;
  togglePasswordVisibility: () => void;
  error: string;
  isLoading: boolean;
  onSubmit: () => void;
}

/**
 * Componente para el formulario de login con email y contraseña
 */
export default function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  remember,
  toggleRemember,
  showPassword,
  togglePasswordVisibility,
  error,
  isLoading,
  onSubmit,
}: LoginFormProps) {
  return (
    <View className="space-y-4">
      <InputField
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        iconName="email"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <InputField
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        iconName="lock"
        secureTextEntry={!showPassword}
        showPasswordToggle={true}
        isPasswordVisible={showPassword}
        togglePasswordVisibility={togglePasswordVisibility}
      />

      <View className="mt-1 mb-3">
        <Checkbox
          label="Recordarme"
          checked={remember}
          onToggle={toggleRemember}
          accessibilityLabel="Recordarme"
        />
      </View>

      {error ? (
        <Text className="text-red-500 text-center text-sm mb-3">{error}</Text>
      ) : null}

      <PrimaryButton
        title="Iniciar sesión"
        onPress={onSubmit}
        isLoading={isLoading}
        accessibilityLabel="Iniciar sesión"
      />
    </View>
  );
}
