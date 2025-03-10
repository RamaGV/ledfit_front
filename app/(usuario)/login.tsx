// app/(usuario)/login.tsx

import React, { useState, useCallback } from "react";
import { 
  View, 
  Text, 
  StatusBar, 
  Image, 
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ActivityIndicator
} from "react-native";
import { useRouter } from "expo-router";
import Constants from "expo-constants";
import { useUser } from "@/context/UsersContext";
import { useOAuth, useAuth } from "@clerk/clerk-expo";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@/env"; // Importar la variable de entorno

// Componentes
import InputField from "@/components/auth/InputField";
import PrimaryButton from "@/components/auth/PrimaryButton";
import Checkbox from "@/components/auth/Checkbox";
import SocialLoginSection from "@/components/auth/SocialLoginSection";
import AuthFooter from "@/components/auth/AuthFooter";

export default function LoginScreen() {
  const router = useRouter();
  const { login, oauthSignIn, setUser } = useUser();
  const { getToken, userId } = useAuth();
  // Configuración con redirección personalizada para evitar errores de 'Unmatched Route'
  const redirectUrl = Constants.expoConfig?.extra?.clerkOAuthRedirectUrl || 'ledfit://oauth-callback';
  
  const { startOAuthFlow: startGoogleOAuth } = useOAuth({ 
    strategy: "oauth_google",
    redirectUrl
  });
  
  const { startOAuthFlow: startFacebookOAuth } = useOAuth({ 
    strategy: "oauth_facebook",
    redirectUrl
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recordar, setRecordar] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = useCallback(async () => {
    if (!email || !password) {
      setError("Por favor completa todos los campos");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await login(email, password);
      router.push("/(dashboard)");
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Error en la conexión");
    } finally {
      setIsLoading(false);
    }
  }, [email, password, login, router]);

  // Función para iniciar el flujo OAuth de Google con Clerk e integrarlo con nuestro backend
  const handleGoogleLogin = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      
      console.log('================================================');
      console.log('Iniciando autenticación con Google... DEPURACIÓN MEJORADA');
      
      // Mostramos más información sobre la redirección configurada
      console.log('URL de redirección configurada:', redirectUrl);
      
      // Verificamos la configuración completa
      console.log('Esquema de app:', Constants.expoConfig?.scheme);
      console.log('Clerk redirectUrl:', redirectUrl);
      console.log('URL de API:', API_URL);
      
      // Configuración de opciones avanzadas para OAuth
      const oauthOptions = {
        // Redirigir específicamente a nuestra URL personalizada
        redirectUrl: redirectUrl,
        // Esperar hasta 90 segundos por una respuesta (tiempo suficiente pero no excesivo)
        redirectUrlComplete: redirectUrl,
        // Incluimos scopes necesarios para obtener perfil y email
        scopes: ['profile', 'email'],
        // Usar el navegador interno para mejor control
        useExternalBrowser: false,
        // Establecer tiempo de espera
        timeoutInMilliseconds: 90000 // 90 segundos
      };
      
      console.log('Opciones OAuth completas:', JSON.stringify(oauthOptions));
      
      // Limpiar AsyncStorage antes de iniciar nueva sesión para evitar conflictos
      await AsyncStorage.removeItem('@token');
      await AsyncStorage.removeItem('@user');
      
      // Iniciar el flujo OAuth con opciones personalizadas
      console.log('Iniciando flujo OAuth con Google...');
      let oauthResult;
      try {
        oauthResult = await startGoogleOAuth(oauthOptions);
        console.log('Resultado OAuth inicial recibido de Clerk');
        
        console.log('Resultado OAuth detallado:', JSON.stringify(oauthResult));
        
        // Verificar si el usuario canceló el proceso
        if (!oauthResult || oauthResult?.authSessionResult?.type === 'dismiss') {
          console.log('El usuario canceló el proceso de autenticación o hubo timeout');
          
          // Verificar si hay detalles de error
          if (oauthResult?.signIn?.firstFactorVerification?.error) {
            console.error('Error en verificación:', oauthResult.signIn.firstFactorVerification.error);
            setError(`Error en autenticación: ${oauthResult.signIn.firstFactorVerification.error}`);
          } else {
            setError('Autenticación cancelada por el usuario o expiró el tiempo de espera');
          }
          
          setIsLoading(false);
          return;
        }
      } catch (startOAuthError) {
        console.error('Error al iniciar OAuth con Google:', startOAuthError);
        setError('Error al iniciar el proceso de autenticación con Google');
        setIsLoading(false);
        return;
      }
      
      // Extraemos los datos de la sesión
      const { createdSessionId, setActive } = oauthResult || {};
      
      if (!createdSessionId || !setActive) {
        console.error('No se recibió información de sesión completa');
        setError('No se pudo completar el proceso de autenticación');
        setIsLoading(false);
        return;
      }
      
      // Si se creó una sesión, la activamos
      console.log('Sesión de Clerk creada con ID:', createdSessionId);
      
      try {
        // Activamos la sesión
        console.log('Activando sesión de Clerk...');
        await setActive({ session: createdSessionId });
        console.log('Sesión activada correctamente');
        
        // Pequeña pausa para asegurarnos de que la sesión esté completamente activada
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Intentamos obtener el token rápidamente
        console.log('Intentando obtener token...');
        let token;
        
        // Intentamos con el método básico primero
        try {
          token = await getToken();
          console.log('Token obtenido correctamente:', !!token);
        } catch (error) {
          console.error('Error obteniendo token básico:', error);
        }
        
        if (token) {
          // Si tenemos el token, guardamos y redirigimos inmediatamente
          console.log('Token obtenido, guardando y redirigiendo al dashboard...');
          await AsyncStorage.setItem('@token', token);
          
          // Intento registrar en backend con información mínima
          try {
            if (userId) {
              await oauthSignIn({
                name: "Usuario Google",
                email: `${userId}@clerk.dev`,
                oauthProvider: 'google',
                oauthId: userId
              });
              console.log('Usuario registrado en backend');
            } else {
              console.log('No se pudo registrar en backend: userId es null o undefined');
            }
          } catch (err) {
            console.error('Error registrando usuario, pero continuando...', err);
          }
          
          // Redirigimos al dashboard de forma inmediata
          console.log('Redirigiendo al dashboard...');
          router.replace('/(dashboard)');
          setIsLoading(false);
          return;
        }
        
        // Si no obtuvimos el token con el método básico, intentamos otros métodos
        if (!token) {
          try {
            token = await getToken({ template: "org-public-key" });
            console.log('Token obtenido con org-public-key:', !!token);
            
            if (token) {
              await AsyncStorage.setItem('@token', token);
              console.log('Redirigiendo al dashboard...');
              router.replace('/(dashboard)');
              setIsLoading(false);
              return;
            }
          } catch (error) {
            console.error('Error con template:', error);
          }
        }
      } catch (error) {
        console.error('Error activando la sesión de Clerk:', error);
        setError('Error activando la sesión');
      }
    } catch (error) {
      console.error('Error general en el proceso de autenticación con Google:', error);
      setError('Ocurrió un error durante la autenticación');
    } finally {
      setIsLoading(false);
    }
  }, [router, startGoogleOAuth, redirectUrl, getToken, userId, oauthSignIn, setUser]);

  // Función para iniciar el flujo OAuth de Facebook con Clerk e integrarlo con nuestro backend
  const handleFacebookLogin = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      
      console.log('Iniciando autenticación con Facebook...');
      
      // Mostramos más información sobre la redirección configurada
      console.log('URL de redirección configurada:', redirectUrl);
      
      // Verificamos la configuración completa
      console.log('Esquema de app:', Constants.expoConfig?.scheme);
      console.log('Clerk redirectUrl:', redirectUrl);
      
      // Iniciar el flujo OAuth
      const oauthResult = await startFacebookOAuth();
      console.log('Resultado OAuth inicial:', JSON.stringify(oauthResult || {}));
      
      const { createdSessionId, setActive } = oauthResult || {};
      
      // Si se creó una sesión, la activamos
      if (createdSessionId && setActive) {
        console.log('Sesión de Clerk creada con ID:', createdSessionId);
        
        try {
          // Activamos la sesión
          console.log('Activando sesión...');
          await setActive({ session: createdSessionId });
          console.log('Sesión activada correctamente');
          
          // Esperamos un momento para que Clerk termine de procesar la sesión
          console.log('Esperando procesamiento...');
          await new Promise(resolve => setTimeout(resolve, 2000)); // Aumentamos el tiempo de espera
          
          // Ahora obtenemos el token y datos del usuario de Clerk
          console.log('Obteniendo token de Clerk...');
          const token = await getToken({ template: "org-public-key" });
          console.log('¿Token obtenido?', !!token);
          console.log('¿userId disponible?', !!userId);
          
          if (token && userId) {
            console.log('Token y userId obtenidos');
            
            // Obtenemos datos del usuario desde Clerk
            try {
              console.log('Consultando API de Clerk para datos del usuario...');
              const response = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              });
              
              console.log('Respuesta de API Clerk:', response.status);
              
              if (response.ok) {
                const userData = await response.json();
                console.log('Datos de usuario recibidos');
                
                if (!userData.email_addresses || userData.email_addresses.length === 0) {
                  throw new Error('No se encontró email en la cuenta de Facebook');
                }
                
                const email = userData.email_addresses[0].email_address;
                const name = userData.first_name + (userData.last_name ? ' ' + userData.last_name : '');
                
                console.log('Email:', email, 'Nombre:', name);
                
                // Registramos el usuario en nuestro backend
                console.log('Registrando en backend...');
                await oauthSignIn({
                  name,
                  email,
                  oauthProvider: 'facebook',
                  oauthId: userId
                });
                
                console.log('Registro exitoso, redireccionando...');
                
                // Navegamos al dashboard
                router.push("/(dashboard)");
                return;
              } else {
                const errorData = await response.json().catch(() => ({}));
                console.error('Error en respuesta de Clerk API:', errorData);
                throw new Error(`Error de API Clerk: ${response.status}`);
              }
            } catch (apiError) {
              console.error('Error al llamar API de Clerk:', apiError);
              throw apiError;
            }
          } else {
            console.error('No se obtuvo token o userId después de activar sesión');
            if (!token) console.log('Token no disponible');
            if (!userId) console.log('UserId no disponible');
            throw new Error('No se pudo obtener credenciales después de autenticación');
          }
        } catch (sessionError) {
          console.error('Error al activar sesión:', sessionError);
          throw sessionError;
        }
      } else {
        console.log('Datos de sesión OAuth:', JSON.stringify(oauthResult || {}));
        console.error('No se recibió información de sesión completa de Facebook');
        if (!createdSessionId) console.log('createdSessionId no está disponible');
        if (!setActive) console.log('setActive no está disponible');
        throw new Error('No se completó el inicio de sesión con Facebook');
      }
    } catch (error: any) {
      console.error("Error detallado en Facebook OAuth:", error);
      // Mostramos error más específico al usuario
      setError(error.message || "No se pudo completar la autenticación con Facebook");
    } finally {
      setIsLoading(false);
    }
  }, [startFacebookOAuth, getToken, userId, oauthSignIn, router]);

  // Para el login con Apple (simulado por ahora)
  const handleAppleLogin = () => {
    // Limpiamos cualquier error anterior
    setError("");
    // Mostramos mensaje informativo
    setError("El inicio de sesión con Apple estará disponible próximamente");
  };

  return (
    <LinearGradient
      colors={['#121212', '#1A1A1A']}
      className="flex-1 bg-[#121212]"
    >
      <StatusBar barStyle="light-content" />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="items-center mt-10 mb-3 h-24">
              <Image 
                source={require('@/assets/images/icon.png')} 
                className="w-20 h-20"
                resizeMode="contain"
              />
            </View>
            
            <View className="flex-1 px-6 pt-0">
              <Text className="text-2xl font-bold text-white mb-2">
                Bienvenido de vuelta
              </Text>
              
              <Text className="text-base text-gray-400 mb-8">
                Ingresa con tu cuenta para continuar
              </Text>

              <View className="space-y-4">
                <InputField
                  placeholder="Correo electrónico"
                  value={email}
                  onChangeText={setEmail}
                  iconName="email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <InputField
                  placeholder="Contraseña"
                  value={password}
                  onChangeText={setPassword}
                  iconName="lock"
                  secureTextEntry={true}
                  showPasswordToggle={true}
                  isPasswordVisible={showPassword}
                  togglePasswordVisibility={() => setShowPassword(prev => !prev)}
                />

                <View className="mt-1 mb-3">
                  <Checkbox
                    label="Recordarme"
                    checked={recordar}
                    onToggle={() => setRecordar(prev => !prev)}
                    accessibilityLabel="Recordarme"
                  />
                </View>

                {error ? (
                  <Text className="text-red-500 text-center text-sm mb-3">{error}</Text>
                ) : null}

                <PrimaryButton
                  title="Iniciar sesión"
                  onPress={handleLogin}
                  isLoading={isLoading}
                  accessibilityLabel="Iniciar sesión"
                />
              </View>

              <SocialLoginSection 
                onFacebookPress={handleFacebookLogin}
                onGooglePress={handleGoogleLogin}
                onApplePress={handleAppleLogin}
                type="login"
              />

              <AuthFooter
                prompt="¿No tienes una cuenta?"
                actionText="Regístrate"
                onPress={() => router.push("/(usuario)/register")}
                accessibilityLabel="Ir a registro"
              />
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}


