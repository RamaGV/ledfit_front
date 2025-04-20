import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface AuthFooterProps {
  prompt: string;
  actionText: string;
  onPress: () => void;
  accessibilityLabel: string;
}

const AuthFooter: React.FC<AuthFooterProps> = ({
  prompt,
  actionText,
  onPress,
  accessibilityLabel,
}) => {
  return (
    <View className="flex-row items-center justify-center mb-8 mt-2">
      <Text className="text-gray-400 text-sm">{prompt}</Text>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        accessibilityLabel={accessibilityLabel}
        className="ml-2 py-1"
      >
        <Text className="text-purple-500 font-semibold text-sm">
          {actionText}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AuthFooter;
