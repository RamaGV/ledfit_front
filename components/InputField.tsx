// app/components/InputField.tsx

import React from "react";
import { View, Text, TextInput } from "react-native";

interface InputFieldProps {
  label?: string; // Etiqueta opcional para el campo
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean; // Campo para contraseñas
  multiline?: boolean; // Para textos largos
  numberOfLines?: number; // Líneas visibles si es multilínea
  error?: string; // Mensaje de error opcional
}

export default function InputField({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  multiline = false,
  numberOfLines = 1,
  error,
}: InputFieldProps) {
  return (
    <View className="mb-6">
      {label && (
        <Text className="text-gray-200 text-sm font-semibold mb-2">
          {label}
        </Text>
      )}
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        numberOfLines={numberOfLines}
        placeholderTextColor="#aaaaaa"
        className={`bg-gray-800 text-gray-200 border border-gray-700 rounded-lg px-4 py-3 ${
          error ? "border-red-400" : "border-gray-300"
        }`}
      />
      {error && <Text className="text-red-400 text-xs mt-1">{error}</Text>}
    </View>
  );
}
