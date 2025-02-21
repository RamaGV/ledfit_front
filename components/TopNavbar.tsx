// app/components/TopNavbar.tsx

import { Color } from "@/GlobalStyles";
import { useRouter } from "expo-router";
import React from "react";
import Logo from "@/components/Logo";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageSourcePropType,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type TopNavbarType = {
  titulo?: string;
  iconBuscar?: ImageSourcePropType;
  iconNotif?: boolean;
  iconBack?: boolean;
  iconFav?: boolean;
  logo?: boolean;
};

const TopNavbar = ({
  titulo: titulo = "Ledfit",
  iconBuscar: iconBuscar,
  iconNotif: iconNotif,
  iconBack: iconBack,
  iconFav: iconFav,
  logo: logo,
}: TopNavbarType) => {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between my-6">
      <View className="flex-row items-center">
        {iconBack && (
          <TouchableOpacity className="" onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={30} color="#FFFFFF" />
          </TouchableOpacity>
        )}
        {logo && <Logo />}
        <Text className="text-2xl font-bold text-gray-200 pl-4">{titulo}</Text>
      </View>
      <View className="flex-row items-center gap-4">
        {iconNotif && (
          <TouchableOpacity
            onPress={() => router.push("/(usuario)/notificaciones")}
          >
            <Image
              className="w-8 h-8"
              source={require("@/assets/iconlycurvednotification.png")}
              style={styles.color}
            />
          </TouchableOpacity>
        )}
        {iconFav && (
          <TouchableOpacity
            onPress={() => {
              router.push("/(entrenar)/entrenamientosFav");
            }}
          >
            <Image
              style={styles.color}
              source={require("@/assets/iconlycurvedbookmark.png")}
            />
          </TouchableOpacity>
        )}
        {iconBuscar && (
          <TouchableOpacity>
            <Image
              className="w-8 h-8"
              style={styles.color}
              source={iconBuscar}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default TopNavbar;

// Color de icono //
const styles = StyleSheet.create({
  color: {
    tintColor: Color.greyscale300,
  },
});
