// app/notifications.tsx
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ImagesMapContext } from "@/context/ImagesMapContext";
import { useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { UsersContext } from "@/context/UsersContext";

export default function NotificationsScreen() {
  const { user, loadUser: userLoading, errorUser } = useContext(UsersContext);
  const { imagesMap } = useContext(ImagesMapContext);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!userLoading && user) {
      const fetchNotifications = async () => {
        try {
          setLoading(true);
          const response = await fetch(
            `http://192.168.1.3:5000/api/users/${user._id}/notifications`,
          );
          if (!response.ok) {
            throw new Error("Failed to fetch notifications");
          }
          const data = await response.json();
          setNotifications(data);
        } catch (err) {
          console.error("Error fetching notifications:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchNotifications();
    }
  }, [user, userLoading]);

  if (userLoading || loading) {
    return (
      <View className="flex-1 bg-[#121212] justify-center items-center">
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  if (errorUser || !user) {
    return (
      <View className="flex-1 bg-[#121212] justify-center items-center">
        <Text className="text-white text-center">
          {errorUser || "User not authenticated"}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#121212] pt-10 px-4">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-5">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color="#FFFFFF" />
        </Pressable>
        <View className="flex-1 items-center">
          <Text className="text-white text-xl font-semibold">
            Notificaciones
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {notifications.map((section, idx) => (
          <View key={idx}>
            <Text className="text-white text-base font-semibold mb-3">
              {section.date}
            </Text>
            {section.items.map((notif: any, nIdx: number) => (
              <View
                key={nIdx}
                className="flex-row items-center bg-[#1E1E1E] rounded-2xl p-4 mb-4"
              >
                <View
                  className={`w-10 h-10 rounded-full justify-center items-center ${notif.iconBg} mr-3`}
                >
                  <Image
                    source={imagesMap[notif.icon]}
                    style={{ width: 55, height: 55 }}
                    resizeMode="contain"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-white font-semibold text-base">
                    {notif.title}
                  </Text>
                  <Text className="text-[#CCCCCC] text-sm">
                    {notif.subtitle}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
