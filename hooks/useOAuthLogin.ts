import { useState, useCallback } from "react";
import { useRouter } from "expo-router";
import { useOAuth, useAuth } from "@clerk/clerk-expo";
import { useUser } from "../context/UsersContext";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../env";

/**
 * Hook personalizado para manejar la autenticación con OAuth (Google, Facebook, Apple)
 */
export function useOAuthLogin() {
  const router = useRouter();
  const { getToken, userId } = useAuth();
  const { oauthSignIn } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Configuración con redirección personalizada para evitar errores de 'Unmatched Route'
  const redirectUrl =
    Constants.expoConfig?.extra?.clerkOAuthRedirectUrl ||
    "ledfit://oauth-callback";

  // Configurar OAuth para cada proveedor
  const { startOAuthFlow: startGoogleOAuth } = useOAuth({
    strategy: "oauth_google",
    redirectUrl,
  });

  const { startOAuthFlow: startFacebookOAuth } = useOAuth({
    strategy: "oauth_facebook",
    redirectUrl,
  });

  /**
   * Preparación común para cualquier autenticación OAuth
   */
  const prepareOAuthAuth = useCallback(async () => {
    setIsLoading(true);
    setError("");

    // Verificamos la configuración
    console.log("Esquema de app:", Constants.expoConfig?.scheme);
    console.log("Clerk redirectUrl:", redirectUrl);
    console.log("URL de API:", API_URL);

    // Limpiamos tokens previos
    await AsyncStorage.removeItem("@token");
    await AsyncStorage.removeItem("@user");
  }, [redirectUrl]);

  /**
   * Maneja los errores comunes en OAuth
   */
  const handleOAuthError = useCallback((errorMsg: string) => {
    console.error(errorMsg);
    setError(errorMsg);
    setIsLoading(false);
  }, []);

  /**
   * Procesa el resultado de un flujo OAuth exitoso
   */
  const processOAuthSuccess = useCallback(
    async (
      sessionId: string,
      setActiveSession: Function,
      provider = "oauth",
    ) => {
      try {
        // Activamos la sesión
        await setActiveSession({ session: sessionId });
        console.log("Sesión activada correctamente");

        let token;
        try {
          token = await getToken();
          if (token) {
            await AsyncStorage.setItem("@token", token);

            // Registramos mínimamente si es necesario
            if (userId && provider === "facebook") {
              try {
                await oauthSignIn({
                  name: `Usuario ${provider.charAt(0).toUpperCase() + provider.slice(1)}`,
                  email: `${userId}@clerk.dev`,
                  oauthProvider: provider,
                  oauthId: userId,
                });
              } catch (e) {
                console.error(`Error en registro con ${provider}:`, e);
              }
            }

            console.log("Redirigiendo al dashboard...");
            router.replace("/(dashboard)");
          } else {
            // Intento alternativo
            token = await getToken({ template: "org-public-key" });
            if (token) {
              await AsyncStorage.setItem("@token", token);
              router.replace("/(dashboard)");
            } else {
              setError("No se pudo obtener token de autenticación");
            }
          }
        } catch (e) {
          console.error("Error obteniendo token:", e);
          setError("Error obteniendo token de autenticación");
        }
      } catch (error) {
        console.error("Error activando sesión:", error);
        setError("Error al activar la sesión");
      } finally {
        setIsLoading(false);
      }
    },
    [getToken, userId, oauthSignIn, router],
  );

  /**
   * Inicia el flujo OAuth de Google
   */
  const handleGoogleLogin = useCallback(async () => {
    try {
      await prepareOAuthAuth();
      console.log("Iniciando autenticación con Google...");

      // Configuración específica para Google
      const oauthOptions = {
        redirectUrl,
        redirectUrlComplete: redirectUrl,
        scopes: ["profile", "email"],
        timeoutInMilliseconds: 90000, // 90 segundos
      };

      // Iniciar el flujo OAuth
      const oauthResult = await startGoogleOAuth(oauthOptions);

      // Verificar resultado
      if (!oauthResult || oauthResult?.authSessionResult?.type === "dismiss") {
        if (oauthResult?.signIn?.firstFactorVerification?.error) {
          handleOAuthError(
            `Error en autenticación: ${oauthResult.signIn.firstFactorVerification.error}`,
          );
        } else {
          handleOAuthError(
            "Autenticación cancelada por el usuario o expiró el tiempo de espera",
          );
        }
        return;
      }

      // Extraer datos de sesión
      const { createdSessionId, setActive } = oauthResult;
      if (!createdSessionId || !setActive) {
        handleOAuthError("No se pudo completar el proceso de autenticación");
        return;
      }

      // Procesar autenticación exitosa
      await processOAuthSuccess(createdSessionId, setActive, "google");
    } catch (error) {
      handleOAuthError("Error durante la autenticación con Google");
    }
  }, [
    prepareOAuthAuth,
    startGoogleOAuth,
    redirectUrl,
    handleOAuthError,
    processOAuthSuccess,
  ]);

  /**
   * Inicia el flujo OAuth de Facebook
   */
  const handleFacebookLogin = useCallback(async () => {
    try {
      await prepareOAuthAuth();
      console.log("Iniciando autenticación con Facebook...");

      // Configuración específica para Facebook
      const oauthOptions = {
        redirectUrl,
        redirectUrlComplete: redirectUrl,
        scopes: ["email", "public_profile"],
        useExternalBrowser: true,
        timeoutInMilliseconds: 90000,
      };

      // Iniciar el flujo OAuth
      const oauthResult = await startFacebookOAuth(oauthOptions);

      // Verificar resultado
      if (!oauthResult || oauthResult?.authSessionResult?.type === "dismiss") {
        handleOAuthError(
          "Autenticación cancelada o expiró el tiempo de espera",
        );
        return;
      }

      // Extraer datos de sesión
      const { createdSessionId, setActive } = oauthResult;
      if (!createdSessionId || !setActive) {
        handleOAuthError("No se recibió información de sesión");
        return;
      }

      // Procesar autenticación exitosa
      await processOAuthSuccess(createdSessionId, setActive, "facebook");
    } catch (error) {
      handleOAuthError("Error durante la autenticación con Facebook");
    }
  }, [
    prepareOAuthAuth,
    startFacebookOAuth,
    redirectUrl,
    handleOAuthError,
    processOAuthSuccess,
  ]);

  /**
   * Inicia el flujo OAuth de Apple (placeholder, aún no implementado)
   */
  const handleAppleLogin = useCallback(() => {
    setError("");
    setError("El inicio de sesión con Apple estará disponible próximamente");
  }, []);

  return {
    handleGoogleLogin,
    handleFacebookLogin,
    handleAppleLogin,
    isLoading,
    error,
    setError,
  };
}
