import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";

// Definir un tipo para los nombres de iconos de MaterialIcons
type MaterialIconName = React.ComponentProps<typeof MaterialIcons>["name"];

interface InputFieldProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  iconName?: MaterialIconName;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  showPasswordToggle?: boolean;
  isPasswordVisible?: boolean;
  togglePasswordVisibility?: () => void;
}

const InputField: React.FC<InputFieldProps> = ({
  placeholder,
  value,
  onChangeText,
  iconName,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  showPasswordToggle = false,
  isPasswordVisible = false,
  togglePasswordVisibility = () => {},
}) => {
  return (
    <View className="flex-row items-center bg-gray-800/80 rounded-xl px-4 h-14 backdrop-blur-sm border border-gray-700/50 mt-2">
      {iconName && (
        <MaterialIcons 
          name={iconName} 
          size={20} 
          color="#888" 
          style={{ marginRight: 10 }}
        />
      )}
      <TextInput
        className="flex-1 text-white text-base"
        placeholder={placeholder}
        placeholderTextColor="#888"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry && !isPasswordVisible}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        accessibilityLabel={placeholder}
        style={styles.input}
      />
      {showPasswordToggle && (
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          accessibilityLabel={isPasswordVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialIcons
            name={isPasswordVisible ? "visibility" : "visibility-off"}
            size={20}
            color="#888"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    fontFamily: 'System',
    fontWeight: '400',
  }
});

export default InputField;
