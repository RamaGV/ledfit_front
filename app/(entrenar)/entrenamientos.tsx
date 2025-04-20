// app/(dashboard)/Entrenamientos.tsx

import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import TopNavbar from "../../components/TopNavbar";
import {
  IEntrenamiento,
  useEntrenamientos,
} from "../../context/EntrenamientosContext";
import GroupSelector from "../../components/entrenar/GroupSelector";
import EntrenamientoCard from "../../components/dashboard/EntrenamientoCard";

export default function Entrenamientos() {
  const { entrenamientos, setSelectedEntrenamiento } = useEntrenamientos();
  const [selectedGroup, setSelectedGroup] = useState("Todos");

  // Extraemos los grupos únicos y agregamos la opción "Todos"
  const gruposUnicos = Array.from(new Set(entrenamientos.map((e) => e.grupo)));
  const groups = ["Todos", ...gruposUnicos];

  // Filtramos los entrenamientos según el grupo seleccionado
  const filteredEntrenamientos =
    selectedGroup === "Todos"
      ? entrenamientos
      : entrenamientos.filter((e) => e.grupo === selectedGroup);

  const handleSelectGroup = (group: string) => {
    setSelectedGroup(group);
  };

  const entrenamientoSeleccionado = (entrenamiento: IEntrenamiento) => {
    setSelectedEntrenamiento(entrenamiento);
    // Redirigir a la pantalla de detalles, por ejemplo:
    // router.push("/(entrenar)/detallesDeEntrenamiento");
  };

  return (
    <View className="flex-1 py-4 bg-[#121212]">
      <TopNavbar iconBack={true} titulo="Entrenamientos" />

      {/* Componente selector de grupos */}
      <View className="flex-1 px-4">
        <GroupSelector
          groups={groups}
          selectedGroup={selectedGroup}
          onSelect={handleSelectGroup}
        />

        {/* Lista de entrenamientos filtrados */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="px-2 gap-2 mt-2"
        >
          {filteredEntrenamientos.map((entrenamiento, idx) => (
            <TouchableOpacity
              key={entrenamiento._id || idx}
              onPress={() => entrenamientoSeleccionado(entrenamiento)}
              className="py-2"
            >
              <EntrenamientoCard
                key={entrenamiento._id || idx}
                tipo="Card Chica"
                entrenamiento={entrenamiento}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
