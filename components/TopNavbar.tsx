// app/components/TopNavbar.tsx

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Logo from "../components/Logo";
import React, { useContext } from "react";
import {
  View,
  Text,
  Image,
  ImageSourcePropType,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import { NotificationsContext } from "../context/NotificationsContext";
import { useTheme } from "../context/ThemeContext";

type TopNavbarType = {
  titulo?: string;
  iconBuscar?: ImageSourcePropType;
  iconNotif?: boolean;
  iconBack?: boolean;
  iconFav?: boolean;
  logo?: boolean;
};

export default function TopNavbar({
  titulo: titulo = "Ledfit",
  iconBuscar: iconBuscar,
  iconNotif: iconNotif,
  iconBack: iconBack,
  iconFav: iconFav,
  logo: logo,
}: TopNavbarType) {
  const router = useRouter();
  const { unreadCount } = useContext(NotificationsContext);
  const { colors, isDarkMode } = useTheme();

  // Calcular padding superior para diferentes dispositivos
  const statusBarHeight = StatusBar.currentHeight || 0;
  const paddingTop = Platform.OS === "ios" ? 44 : statusBarHeight + 16;

  return (
    <View
      className={`flex-row items-center justify-between w-full px-4 ${isDarkMode ? "bg-[#121212]" : "bg-[#EFEEE9]"}`}
      style={{
        paddingTop: paddingTop,
        paddingBottom: 16,
      }}
    >
      <View className="flex-row items-center">
        {iconBack && (
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons
              name="chevron-back"
              size={30}
              color={isDarkMode ? "#FFFFFF" : "#333333"}
            />
          </TouchableOpacity>
        )}
        {logo && <Logo />}
        <Text
          className={`text-2xl font-bold pl-4 ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}
        >
          {titulo}
        </Text>
      </View>
      <View className="flex-row items-center gap-4">
        {iconNotif && (
          <TouchableOpacity
            onPress={() => router.push("/(usuario)/notificaciones")}
            className="relative"
          >
            <Image
              className={unreadCount > 0 ? "" : ""}
              style={{
                tintColor:
                  unreadCount > 0
                    ? "#6842FF"
                    : isDarkMode
                      ? colors.navIcon
                      : "#555555",
              }}
              source={require("@/assets/icons/iconNotif.png")}
            />
            {unreadCount > 0 && (
              <View className="absolute -top-1 -right-1 bg-[#6842FF] rounded-full min-w-5 h-5 items-center justify-center px-1">
                <Text className="text-white text-xs font-bold">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}
        {iconFav && (
          <TouchableOpacity
            onPress={() => {
              router.push("/(entrenar)/detallesDeFavs");
            }}
          >
            <Image
              style={{
                tintColor: isDarkMode ? colors.navIcon : "#555555",
              }}
              source={require("@/assets/icons/iconFavFalse.png")}
            />
          </TouchableOpacity>
        )}
        {iconBuscar && (
          <TouchableOpacity>
            <Image
              className="w-8 h-8"
              style={{
                tintColor: isDarkMode ? colors.navIcon : "#555555",
              }}
              source={iconBuscar}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
