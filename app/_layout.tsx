// app/_layout.tsx

import { Stack } from "expo-router";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { Platform, SafeAreaView } from "react-native";
import { useFonts } from "expo-font";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import * as Notifications from "expo-notifications";

import { EntrenamientosProvider } from "@/context/EntrenamientosContext";
import { NotificationsProvider } from "@/context/NotificationsContext";
import { EjerciciosProvider } from "@/context/EjerciciosContext";
import { ImagesMapProvider } from "@/context/ImagesMapContext";
import { UserProvider } from "@/context/UsersContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    const initNotifications = async () => {
      // Configurar canal en Android
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }
      // Solicitar permisos
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        console.warn("No se concedieron permisos para notificaciones");
      }
    };

    initNotifications();
  }, []);


  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#121212" }}>
        <UserProvider>
          <NotificationsProvider>
            <ImagesMapProvider>
              <EjerciciosProvider>
                <EntrenamientosProvider>
                  <Stack>
                    <Stack.Screen name="index" options={{ headerShown: false }} />
                      <Stack.Screen
                        name="(dashboard)"
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="(entrenar)"
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="(usuario)"
                        options={{ headerShown: false }}
                      />
                    </Stack>
                  <StatusBar style="auto" />
                </EntrenamientosProvider>
              </EjerciciosProvider>
            </ImagesMapProvider>
          </NotificationsProvider>
        </UserProvider>
      </SafeAreaView>
    </ThemeProvider>
  );
}
