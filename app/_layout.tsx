// app/_layout.tsx

import { Stack } from "expo-router";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

import { EntrenamientosProvider } from "@/context/EntrenamientosContext";
import { ImagesMapProvider } from "@/context/ImagesMapContext";
import { EjerciciosProvider } from "@/context/EjerciciosContext";

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

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
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
              <Stack.Screen name="(usuario)" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style="auto" />
          </EntrenamientosProvider>
        </EjerciciosProvider>
      </ImagesMapProvider>
    </ThemeProvider>
  );
}
