// app/(usuario)/logros.tsx
import { View, Text, ScrollView } from "react-native";
import React from "react";
import TopNavbar from "@/components/TopNavbar";

import { useUser } from "@/context/UsersContext";
import { HexBadge } from "@/components/usuario/ItemLogro";

export default function Logros() {
  const { user } = useUser();
  const logros = user?.logros ?? [];

  // Agrupamos los logros por tipo
  const groupedLogros = {
    check: logros.filter((l) => l.type === "check"),
    time: logros.filter((l) => l.type === "time"),
    plus: logros.filter((l) => l.type === "plus"),
  };

  // Función para renderizar una sección (rectángulo con título superpuesto)
  const renderLogroSection = (title: string, logroList: typeof logros) => {
    if (logroList.length === 0) return null; // Si no hay logros de ese tipo, no renderiza nada

    return (
      <View style={{ marginVertical: 16 }}>
        {/* Contenedor con el borde */}
        <View
          style={{
            borderWidth: 1,
            borderColor: "#666",
            borderRadius: 4,
            paddingTop: 16,
            position: "relative",
          }}
        >
          {/* Texto superpuesto */}
          <Text
            style={{
              position: "absolute",
              top: -12, // Levanta el texto sobre el borde
              left: 16,
              backgroundColor: "#121212", // Mismo color de fondo que la pantalla
              color: "#fff",
              paddingHorizontal: 8,
            }}
          >
            {title}
          </Text>

          {/* ScrollView horizontal con los hexágonos */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: "row", padding: 12 }}>
              {logroList.map((logro, index) => (
                <View key={index} style={{ marginRight: 16 }}>
                  <HexBadge logroKey={logro.key} obtenido={logro.obtenido} />
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-[#121212] pt-10 p-4 pb-4">
      <TopNavbar titulo="Logros" iconBack={true} />

      <ScrollView className="flex-1 mt-8" showsVerticalScrollIndicator={false}>
        {/* Sección para calorías (type="check") */}
        {renderLogroSection("Calorías", groupedLogros.check)}

        {/* Sección para tiempo (type="time") */}
        {renderLogroSection("Tiempo", groupedLogros.time)}

        {/* Sección para entrenamientos completados (type="plus") */}
        {renderLogroSection("Entrenamientos", groupedLogros.plus)}
      </ScrollView>
    </View>
  );
}
