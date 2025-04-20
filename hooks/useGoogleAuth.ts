import { useState, useCallback, useEffect } from "react";
import { useUser } from "../context/UsersContext";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

// Registra el WebBrowser como handler de redirección
WebBrowser.maybeCompleteAuthSession();

// ID de cliente de Google como fallback
const GOOGLE_WEB_CLIENT_ID =
  "649056789982-6b496noc3447m3ov12utu2lmpvi3ne8.apps.googleusercontent.com";
const GOOGLE_ANDROID_CLIENT_ID =
  "649056789982-6tcud4ip56k9nacp9h06blut0cn4c1vt.apps.googleusercontent.com";

// Definir interfaz para datos del usuario de Google
interface GoogleUserData {
  name: string;
  email: string;
  oauthProvider: string;
  oauthId: string;
  profilePicture?: string;
}

/**
 * Hook personalizado para manejar la autenticación con Google usando expo-auth-session
 */
export function useGoogleAuth() {
  const router = useRouter();
  const { setUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Configuración de Google Auth Request
  const [request, response, promptAsync] = Google.useAuthRequest({
    // WebClientId: obtenido de la configuración o valor predeterminado
    clientId:
      Constants.expoConfig?.extra?.googleWebClientId || GOOGLE_WEB_CLIENT_ID,
    // Android ClientId: específico para aplicaciones Android
    androidClientId:
      Constants.expoConfig?.extra?.googleAndroidClientId ||
      GOOGLE_ANDROID_CLIENT_ID,
    // iOS ClientId: específico para aplicaciones iOS (si es necesario)
    iosClientId: Constants.expoConfig?.extra?.googleIosClientId || "",
    // Definir los permisos que solicitaremos
    scopes: ["profile", "email"],
    // URL de redirección explícita para asegurar que funcione
    redirectUri:
      Constants.expoConfig?.extra?.clerkOAuthRedirectUrl ||
      "https://auth.expo.io/@funesgv/Ledfit",
  });

  // Maneja el resultado de la autenticación con Google
  useEffect(() => {
    if (!response) return;

    switch (response.type) {
      case "success":
        handleGoogleAuthResponse(response);
        break;
      case "error":
        console.error("Error de autenticación Google:", response.error);
        setError(
          `Error en la autenticación con Google: ${response.error?.message || "Desconocido"}`,
        );
        setIsLoading(false);
        break;
      case "dismiss":
        console.log("Autenticación cancelada por el usuario");
        setError(""); // No mostramos error cuando el usuario cancela
        setIsLoading(false);
        break;
      default:
        setIsLoading(false);
        break;
    }
  }, [response]);

  // Procesa la respuesta de autenticación de Google
  const handleGoogleAuthResponse = useCallback(
    async (response: any) => {
      try {
        setIsLoading(true);

        // Obtener el token de acceso de la respuesta
        const { authentication } = response;

        if (!authentication) {
          throw new Error("No se recibió información de autenticación");
        }

        const { accessToken } = authentication;

        // Guardar el token en AsyncStorage
        await AsyncStorage.setItem("@token", accessToken);

        // Obtener la información del perfil de Google
        const userInfoResponse = await fetch(
          "https://www.googleapis.com/userinfo/v2/me",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );

        if (!userInfoResponse.ok) {
          throw new Error(
            `Error al obtener información del usuario: ${userInfoResponse.status}`,
          );
        }

        const userInfo = await userInfoResponse.json();

        // Registrar al usuario en nuestro backend o actualizar información
        const userData: GoogleUserData = {
          name: userInfo.name,
          email: userInfo.email,
          oauthProvider: "google",
          oauthId: userInfo.id,
          profilePicture: userInfo.picture,
        };

        // Guardar la información del usuario en el contexto
        setUser(userData as any); // Usar any temporalmente hasta ajustar la interfaz User
        await AsyncStorage.setItem("@user", JSON.stringify(userData));

        // Redirigir al dashboard
        router.replace("/(dashboard)");
      } catch (error: any) {
        console.error("Error procesando la autenticación de Google:", error);
        setError(
          `Error al procesar tu cuenta de Google: ${error?.message || "Desconocido"}`,
        );
      } finally {
        setIsLoading(false);
      }
    },
    [router, setUser],
  );

  // Iniciar el flujo de autenticación de Google
  const loginWithGoogle = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      // Limpiar tokens existentes
      await AsyncStorage.removeItem("@token");
      await AsyncStorage.removeItem("@user");

      // Verificar si tenemos la configuración necesaria
      if (!request) {
        throw new Error(
          "No se pudo iniciar la autenticación con Google. Verificando configuración...",
        );
      }

      // Iniciar el flujo de autenticación
      await promptAsync();
    } catch (error: any) {
      console.error("Error iniciando autenticación con Google:", error);
      setError(
        `Error al iniciar la autenticación: ${error?.message || "Desconocido"}`,
      );
      setIsLoading(false);
    }
  }, [request, promptAsync]);

  return {
    loginWithGoogle,
    isLoading,
    error,
    setError,
  };
}
