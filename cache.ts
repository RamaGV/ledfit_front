// cache.ts

import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { TokenCache } from "@clerk/clerk-expo/dist/cache";

const createTokenCache = (): TokenCache => {
  return {
    getToken: async (key: string): Promise<string | null> => {
      try {
        const item = await SecureStore.getItemAsync(key);
        if (item) {
          console.log(`Token "${key}" encontrado.`);
        } else {
          console.log(`No se encontró ningún token bajo la clave: ${key}`);
        }
        return item;
      } catch (error) {
        console.error("Error al obtener el token desde SecureStore:", error);
        // Si ocurre un error, se elimina el elemento para evitar inconsistencias
        await SecureStore.deleteItemAsync(key);
        return null;
      }
    },
    saveToken: async (key: string, token: string): Promise<void> => {
      try {
        await SecureStore.setItemAsync(key, token);
        console.log(`Token "${key}" guardado exitosamente.`);
      } catch (error) {
        console.error("Error al guardar el token en SecureStore:", error);
      }
    },
  };
};

// SecureStore no está disponible en web, por lo que se devuelve undefined en ese caso.
export const tokenCache =
  Platform.OS !== "web" ? createTokenCache() : undefined;
