import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface CheckboxProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
  accessibilityLabel?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onToggle,
  accessibilityLabel,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onToggle}
      accessibilityLabel={accessibilityLabel || label}
      activeOpacity={0.8}
    >
      <View style={[styles.checkbox, checked && styles.checked]}>
        {checked && <View style={styles.inner} />}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  checked: {
    backgroundColor: "#6842FF",
    borderColor: "#6842FF",
  },
  inner: {
    width: 10,
    height: 10,
    backgroundColor: "white",
    borderRadius: 2,
  },
  label: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default Checkbox;
