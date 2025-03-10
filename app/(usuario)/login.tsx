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

// Componentes
import InputField from "@/components/auth/InputField";
import PrimaryButton from "@/components/auth/PrimaryButton";
import Checkbox from "@/components/auth/Checkbox";
import SocialLoginSection from "@/components/auth/SocialLoginSection";
import AuthFooter from "@/components/auth/AuthFooter";

export default function LoginScreen() {
  const router = useRouter();
  const { login, oauthSignIn } = useUser();
  const { getToken, userId } = useAuth();
  // Configuración con redirección personalizada para evitar errores de 'Unmatched Route'
  const redirectUrl = Constants.expoConfig?.extra?.clerkOAuthRedirectUrl || 'com.ledfit.app://oauth-callback';
  
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
      
      // Configuración de opciones avanzadas para OAuth
      const oauthOptions = {
        // Redirigir específicamente a nuestra URL personalizada
        redirectUrl: redirectUrl,
        // Esperar hasta 60 segundos por una respuesta
        redirectUrlComplete: redirectUrl,
        // Incluimos scopes necesarios para obtener perfil y email
        scopes: ['profile', 'email']
      };
      
      console.log('Opciones OAuth:', oauthOptions);
      
      // Comprobamos si ya existe una sesión activa en Clerk
      try {
        console.log('Verificando si ya existe una sesión Clerk activa...');
        const existingToken = await getToken();
        if (existingToken) {
          console.log('Ya existe un token Clerk. Intentando usar la sesión existente.');
        }
      } catch (sessionCheckError) {
        console.log('Error al verificar sesión existente:', sessionCheckError);
      }
      
      // Iniciar el flujo OAuth con opciones personalizadas
      console.log('Iniciando flujo OAuth con Google...');
      let oauthResult;
      try {
        oauthResult = await startGoogleOAuth(oauthOptions);
        console.log('Resultado OAuth inicial recibido de Clerk');
        
        // Verificar si el usuario canceló el proceso
        if (oauthResult?.authSessionResult?.type === 'dismiss') {
          console.log('El usuario canceló el proceso de autenticación');
          setError('Autenticación cancelada por el usuario');
          setIsLoading(false);
          return; // Salir de la función para evitar procesar más
        }
      } catch (startOAuthError: any) {
        console.error('Error al iniciar OAuth con Google:', startOAuthError);
        throw new Error(`Error al iniciar OAuth: ${startOAuthError.message || 'Error desconocido'}`);
      }
      
      console.log('Resultado OAuth completo:', JSON.stringify(oauthResult || {}));
      
      const { createdSessionId, setActive } = oauthResult || {};
      
      // Si se creó una sesión, la activamos
      if (createdSessionId && setActive) {
        console.log('Sesión de Clerk creada con ID:', createdSessionId);
        
        try {
          // Activamos la sesión
          console.log('Activando sesión...');
          try {
            await setActive({ session: createdSessionId });
            console.log('Sesión activada correctamente');
          } catch (activateError: any) {
            console.error('Error al activar sesión:', activateError);
            throw new Error(`Error al activar sesión: ${activateError.message || 'Error desconocido'}`);
          }
          
          // Esperamos un momento para que Clerk termine de procesar la sesión
          console.log('Esperando procesamiento...');
          // Aumentamos el tiempo de espera para la activación de la sesión
          console.log('Esperando 5 segundos para que Clerk complete el proceso...');
          await new Promise(resolve => setTimeout(resolve, 5000)); // Aumentamos a 5 segundos
          
          // Ahora obtenemos el token y datos del usuario de Clerk
          console.log('Obteniendo token de Clerk...');
          let token;
          try {
            token = await getToken({ template: "org-public-key" });
            console.log('¿Token obtenido?', !!token);
          } catch (tokenError: any) {
            console.error('Error al obtener token:', tokenError);
            throw new Error(`Error al obtener token: ${tokenError.message || 'Error desconocido'}`);
          }
          
          console.log('¿userId disponible?', !!userId);
          
          if (token && userId) {
            console.log('Token y userId obtenidos con éxito');
            
            // Obtenemos datos del usuario desde Clerk
            try {
              console.log('Consultando API de Clerk para datos del usuario...');
              console.log('User ID para consulta:', userId);
              
              const response = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              });
              
              console.log('Respuesta de API Clerk:', response.status);
              
              if (response.ok) {
                let userData;
                try {
                  userData = await response.json();
                  console.log('Datos de usuario recibidos correctamente');
                } catch (parseError) {
                  console.error('Error al parsear respuesta JSON de Clerk:', parseError);
                  throw new Error('Error al procesar datos del usuario');
                }
                
                if (!userData.email_addresses || userData.email_addresses.length === 0) {
                  console.error('No se encontraron emails en los datos del usuario:', userData);
                  throw new Error('No se encontró email en la cuenta de Google');
                }
                
                const email = userData.email_addresses[0].email_address;
                const name = userData.first_name + (userData.last_name ? ' ' + userData.last_name : '');
                
                console.log('Email obtenido:', email);
                console.log('Nombre obtenido:', name);
                
                // Registramos el usuario en nuestro backend
                console.log('Registrando en backend...');
                try {
                  console.log('Llamando a oauthSignIn con datos:', { name, email, oauthId: userId });
                  await oauthSignIn({
                    name,
                    email,
                    oauthProvider: 'google',
                    oauthId: userId
                  });
                  
                  // Verificamos si el token se guardó correctamente
                  const tokenSaved = await AsyncStorage.getItem('@token');
                  console.log('Token guardado en AsyncStorage:', tokenSaved ? '******' : 'NO HAY TOKEN');
                  
                  console.log('Registro en backend exitoso');
                } catch (backendError: any) {
                  console.error('Error al registrar en backend:', backendError);
                  throw new Error(`Error al registrar en backend: ${backendError.message || 'Error desconocido'}`);
                }
                
                console.log('Registro exitoso, redireccionando a dashboard...');
                
                // Navegamos al dashboard
                try {
                  console.log('Intentando navegar al dashboard');
                  // Utilizamos replace en lugar de push para reiniciar la navegación
                  router.replace("/(dashboard)");
                  console.log('Navegación a dashboard ejecutada (usando replace)');
                } catch (navigationError: any) {
                  console.error('Error en la navegación al dashboard:', navigationError);
                  throw new Error(`Error al navegar: ${navigationError.message || 'Error desconocido'}`);
                }
                console.log('================================================');
                return;
              } else {
                let errorData;
                try {
                  errorData = await response.json();
                } catch (e) {
                  errorData = {};
                }
                console.error('Error en respuesta de Clerk API:', errorData);
                throw new Error(`Error de API Clerk: ${response.status}`);
              }
            } catch (apiError) {
              console.error('Error al llamar API de Clerk:', apiError);
              throw apiError;
            }
          } else {
            console.error('No se obtuvieron las credenciales necesarias');
            if (!token) console.log('Token no disponible');
            if (!userId) console.log('UserId no disponible');
            throw new Error('Faltan credenciales requeridas después de la autenticación');
          }
        } catch (sessionError) {
          console.error('Error general al manejar la sesión:', sessionError);
          throw sessionError;
        }
      } else {
        console.log('Datos de sesión OAuth incompletos:', JSON.stringify(oauthResult || {}));
        console.error('No se recibió información de sesión completa de Google');
        if (!createdSessionId) console.log('createdSessionId no está disponible');
        if (!setActive) console.log('setActive no está disponible');
        throw new Error('Respuesta incompleta del servidor de autenticación de Google');
      }
    } catch (error: any) {
      console.error("Error detallado en Google OAuth:", error);
      console.log('================================================');
      // Mostramos error más específico al usuario
      setError(error.message || "No se pudo completar la autenticación con Google");

      // Comprobamos si hay un token en AsyncStorage para diagnosticar
      AsyncStorage.getItem('@token').then(existingToken => {
        console.log('Estado actual del token en AsyncStorage:', existingToken ? 'Existe token' : 'NO EXISTE TOKEN');
      });

      // Añadimos una alerta para mostrar el error de forma más visible
      Alert.alert(
        "Error de autenticación",
        `No se pudo completar la autenticación: ${error.message || "Error desconocido"}\n\nIntente nuevamente o use otro método de inicio de sesión.`
      );
    } finally {
      setIsLoading(false);
    }
  }, [startGoogleOAuth, getToken, userId, oauthSignIn, router]);

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


