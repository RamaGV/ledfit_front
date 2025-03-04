// components/dashboard/GroupDropdown.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface GroupDropdownProps {
  groups: string[];
  selectedGroup: string;
  onSelect: (group: string) => void;
}

const GroupDropdown: React.FC<GroupDropdownProps> = ({
  groups,
  selectedGroup,
  onSelect,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <View className="relative">
      {/* Botón del dropdown */}
      <TouchableOpacity
        onPress={() => setVisible(!visible)}
        className="bg-gray-800 p-3 rounded-md flex-row justify-between items-center border border-[#6842FF]"
      >
        <Text className="text-white">{selectedGroup}</Text>
        <Text className="text-white">{visible ? "▲" : "▼"}</Text>
      </TouchableOpacity>

      {/* Lista de opciones, posicionada justo debajo */}
      {visible && (
        <View className="absolute top-full mt-2 w-full bg-[#121212] rounded-lg border border-[#6842FF] z-50">
          {groups.map((group, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => {
                onSelect(group);
                setVisible(false);
              }}
              className="p-4 border-b border-gray-700 last:border-b-0"
            >
              <Text className="text-white">{group}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default GroupDropdown;
