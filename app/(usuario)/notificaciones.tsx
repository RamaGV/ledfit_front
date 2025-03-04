// app/(usuario)/notificaciones.tsx

import React, { useContext } from "react";
import { View, ScrollView, ActivityIndicator } from "react-native";
import TopNavbar from "@/components/TopNavbar";
import NotifItem from "@/components/usuario/NotifiItem";
import { NotificationsContext } from "@/context/NotificationsContext";

export default function NotificationScreen({ navigation }: any) {
  const { notifications } = useContext(NotificationsContext);

  return (
    <View className="flex-1 bg-[#121212] pt-10 p-4 pb-4">
      <TopNavbar titulo="Notificaciones" iconBack={true} />

      <ScrollView className="flex-1 mt-8" showsVerticalScrollIndicator={false}>
        {notifications.length === 0 ? (
          <ActivityIndicator size="large" color="#6842FF" />
        ) : (
          notifications.map((notif) => (
            <NotifItem
              key={notif._id}
              tipo={notif.type}
              titulo={notif.title}
              contenido={notif.content}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}
