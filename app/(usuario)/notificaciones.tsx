import { View, ScrollView } from "react-native";
import React from "react";

import TopNavbar from "@/components/TopNavbar";
import NotifItem from "@/components/usuario/NotifiItem";

export default function NotificationScreen({ navigation }: any) {
  return (
    <View className="flex-1 bg-[#121212] pt-10 p-4 pb-4">
      <TopNavbar titulo="Notificaciones" iconBack={true} />

      {/* CONTENIDO */}
      <ScrollView className="flex-1 mt-8" showsVerticalScrollIndicator={false}>
        {/* Lista de notificaciones */}
        <NotifItem
          tipo="check"
          titulo="Congratulations!"
          contenido="You've been exercising for 2 hours"
        />
      </ScrollView>
    </View>
  );
}
