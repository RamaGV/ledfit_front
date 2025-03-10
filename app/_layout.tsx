// app/_layout.tsx

import React, { useEffect, useState } from "react";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { Platform, SafeAreaView, View, Text, ActivityIndicator } from "react-native";
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
import { API_URL } from "@/env";

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
              try {
                // No hay token local, intentamos obtener el de Clerk
                console.log("Intentando obtener token de Clerk con múltiples métodos...");

                // Intentamos diferentes métodos para obtener el token
                let clerkToken;

                // Método 1: getToken básico
                try {
                  clerkToken = await getToken();
                  console.log("Método 1 - getToken básico:", clerkToken ? "Éxito" : "Fallido");
                } catch (error) {
                  console.error("Error en método 1:", error);
                }

                // Método 2: getToken con template específico
                if (!clerkToken) {
                  try {
                    clerkToken = await getToken({ template: "org-public-key" });
                    console.log("Método 2 - template org-public-key:", clerkToken ? "Éxito" : "Fallido");
                  } catch (error) {
                    console.error("Error en método 2:", error);
                  }
                }

                // Método 3: intentar con otro template
                if (!clerkToken) {
                  try {
                    clerkToken = await getToken({ template: "long-lived" });
                    console.log("Método 3 - template long-lived:", clerkToken ? "Éxito" : "Fallido");
                  } catch (error) {
                    console.error("Error en método 3:", error);
                  }
                }

                // Método 4: último intento con skipCache
                if (!clerkToken) {
                  try {
                    clerkToken = await getToken({ skipCache: true });
                    console.log("Método 4 - skipCache:", clerkToken ? "Éxito" : "Fallido");
                  } catch (error) {
                    console.error("Error en método 4:", error);
                  }
                }

                if (clerkToken) {
                  console.log("Token de Clerk obtenido exitosamente");
                  console.log("Longitud del token:", clerkToken.length);
                  
                  // Guardamos el token en AsyncStorage
                  await AsyncStorage.setItem("@token", clerkToken);
                  
                  // Intentar recuperar el usuario desde nuestro backend usando el token de Clerk
                  try {
                    console.log("Contactando backend con Clerk ID:", userId);
                    const response = await fetch(`${API_URL}/api/auth/clerk-user`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${clerkToken}`
                      },
                      body: JSON.stringify({ 
                        clerkId: userId,
                        // Incluir más información para ayudar al backend
                        provider: "google", // Asumimos provider por defecto
                        platform: Platform.OS,
                        email: `${userId}@clerk.dev`,
                        name: "Usuario Clerk"
                      })
                    });
                    
                    if (response.ok) {
                      console.log("Usuario recuperado del backend usando Clerk ID");
                      const userData = await response.json();
                      
                      // Guardamos tanto el token de Clerk como el token de nuestro backend
                      if (userData && userData.user) {
                        console.log("Guardando datos de usuario en AsyncStorage");
                        await AsyncStorage.setItem("@user", JSON.stringify(userData.user));
                        
                        // Si el backend también devuelve un token propio, lo guardamos
                        if (userData.token) {
                          console.log("Guardando token del backend");
                          await AsyncStorage.setItem("@token", userData.token);
                        }
                      }
                    } else {
                      // Si hay error de autorización, capturamos la respuesta para depuración
                      console.log("No se pudo recuperar el usuario del backend. Status:", response.status);
                      try {
                        const errorData = await response.json();
                        console.error("Error del backend:", JSON.stringify(errorData));
                        
                        // Si el error es de autorización, podríamos necesitar implementar una solución
                        if (response.status === 401 || response.status === 403) {
                          console.log("Error de autorización detectado, es posible que la API requiera configuración");
                        }
                      } catch (e) {
                        console.log("No se pudo obtener detalle del error");
                      }
                    }
                  } catch (error) {
                    console.error("Error intentando sincronizar con backend:", error);
                  }
                } else {
                  console.log("No se pudo obtener token de Clerk");
                }
              } catch (tokenError) {
                console.error("Error obteniendo token de Clerk:", tokenError);
              }
            } else {
              console.log("Token local encontrado:", localToken.substring(0, 10) + "...");
            }
          } else {
            console.log("No hay sesión activa en Clerk");
            
            // Si Clerk indica que no hay sesión, pero hay token local, podemos limpiarlo
            // para mantener sincronización
            const localToken = await AsyncStorage.getItem("@token");
            if (localToken && !isSignedIn) {
              console.log("Limpiando token local porque no hay sesión en Clerk");
              await AsyncStorage.removeItem("@token");
              await AsyncStorage.removeItem("@user");
            }
          }
          
          // Pequeño retraso para permitir que todos los sistemas se inicialicen
          await new Promise(resolve => setTimeout(resolve, 300));
          setIsInitialized(true);
        }
      } catch (error) {
        console.error("Error sincronizando sesión de Clerk:", error);
        setIsInitialized(true);
      }
    };

    syncClerkSession();
  }, [isLoaded, isSignedIn, userId, getToken]);

  // Mostramos un indicador de carga más informativo
  if (!isInitialized && isLoaded) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#121212'
      }}>
        <ActivityIndicator size="large" color="#6842FF" />
        <Text style={{ 
          color: 'white', 
          marginTop: 20,
          fontSize: 16,
          textAlign: 'center',
          paddingHorizontal: 30
        }}>
          Sincronizando datos de usuario...
        </Text>
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
