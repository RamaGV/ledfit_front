// app/_layout.tsx

import React, { useEffect, useState } from "react";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { Platform, SafeAreaView, View, Text } from "react-native";
import { useFonts } from "expo-font";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useTheme } from "@/context/ThemeContext";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import * as Notifications from "expo-notifications";

// Providers de la app
import { EntrenamientosProvider } from "@/context/EntrenamientosContext";
import { NotificationsProvider } from "@/context/NotificationsContext";
import { EjerciciosProvider } from "@/context/EjerciciosContext";
import { ImagesMapProvider } from "@/context/ImagesMapContext";
import { UserProvider } from "@/context/UsersContext";
import { ThemeProvider } from "@/context/ThemeContext";

// Clerk
import { ClerkProvider, ClerkLoaded, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@/cache";
import { EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY } from "@/env";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

// Componente que escucha los cambios de la sesión de Clerk y sincroniza con nuestro UserProvider
const ClerkAuthSync: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoaded, isSignedIn, userId, getToken } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const syncClerkSession = async () => {
      try {
        console.log("Sincronizando sesión de Clerk:", { isLoaded, isSignedIn, userId });
        
        if (isLoaded) {
          if (isSignedIn && userId) {
            console.log("Usuario autenticado en Clerk con ID:", userId);
            
            // Verificar si hay un token local
            const localToken = await AsyncStorage.getItem("@token");
            
            if (!localToken) {
              console.log("No hay token local, intentando obtener token de Clerk");
              // No hay token local, intentamos obtener el de Clerk
              const clerkToken = await getToken();
              
              if (clerkToken) {
                console.log("Token de Clerk obtenido, guardando en local");
                await AsyncStorage.setItem("@token", clerkToken);
              }
            }
          } else {
            console.log("No hay sesión activa en Clerk");
          }
          
          setIsInitialized(true);
        }
      } catch (error) {
        console.error("Error sincronizando sesión de Clerk:", error);
        setIsInitialized(true);
      }
    };

    syncClerkSession();
  }, [isLoaded, isSignedIn, userId]);

  if (!isInitialized && isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Sincronizando datos de usuario...</Text>
      </View>
    );
  }

  return children;
};

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
    <NavigationThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#121212" }}>
        <ClerkProvider
          publishableKey={EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
          tokenCache={tokenCache}
        >
          <ClerkLoaded>
            <ClerkAuthSync>
              <UserProvider>
                <NotificationsProvider>
                  <ImagesMapProvider>
                    <EjerciciosProvider>
                      <EntrenamientosProvider>
                        <ThemeProvider>
                          <Slot />
                          {/* <Stack>
                            <Stack.Screen
                              name="index"
                              options={{ headerShown: false }}
                            />
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
                          </Stack> */}
                          <StatusBar style="auto" />
                        </ThemeProvider>
                      </EntrenamientosProvider>
                    </EjerciciosProvider>
                  </ImagesMapProvider>
                </NotificationsProvider>
              </UserProvider>
            </ClerkAuthSync>
          </ClerkLoaded>
        </ClerkProvider>
      </SafeAreaView>
    </NavigationThemeProvider>
  );
}
