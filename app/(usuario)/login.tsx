// import React, { useState, useCallback } from "react";
// import { View, Text, TextInput, TouchableOpacity } from "react-native";
// import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import { useUser } from "@/context/UsersContext";

// export default function LoginScreen() {
//   const router = useRouter();
//   const { login } = useUser();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [recordar, setRecordar] = useState(false);
//   const [error, setError] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   const handleLogin = useCallback(async () => {
//     try {
//       await login(email, password);
//       router.push("/(dashboard)");
//     } catch (e: any) {
//       console.error(e);
//       setError(e.message || "Error en la conexión");
//     }
//   }, [email, password, login, router]);

//   return (
//     <View className="flex-col w-full h-full justify-around bg-[#121212] px-8">
//       <Text className="text-4xl text-white font-bold mt-12 mb-2">
//         Ingresa con tu cuenta
//       </Text>

//       <View className="flex-col space-y-6">
//         {/* Input de correo */}
//         <View className="flex-row items-center bg-gray-800 rounded-lg px-4">
//           <MaterialIcons name="email" size={20} color="#888" />
//           <TextInput
//             className="flex-1 text-white h-12 ml-2"
//             placeholder="Correo electrónico"
//             placeholderTextColor="#888"
//             value={email}
//             onChangeText={setEmail}
//             keyboardType="email-address"
//             autoCapitalize="none"
//             accessibilityLabel="Correo electrónico"
//           />
//         </View>

//         {/* Input de contraseña con toggle de visibilidad */}
//         <View className="flex-row items-center bg-gray-800 rounded-lg px-4">
//           <MaterialIcons name="lock" size={20} color="#888" />
//           <TextInput
//             className="flex-1 text-white h-12 ml-2"
//             placeholder="Contraseña"
//             placeholderTextColor="#888"
//             secureTextEntry={!showPassword}
//             value={password}
//             onChangeText={setPassword}
//             autoCapitalize="none"
//             accessibilityLabel="Contraseña"
//           />
//           <TouchableOpacity
//             onPress={() => setShowPassword((prev) => !prev)}
//             accessibilityLabel={
//               showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
//             }
//             hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//           >
//             <MaterialIcons
//               name={showPassword ? "visibility" : "visibility-off"}
//               size={20}
//               color="#888"
//               style={{ marginLeft: 8 }}
//             />
//           </TouchableOpacity>
//         </View>

//         {/* Opción "Recordarme" */}
//         <TouchableOpacity
//           className="flex-row items-center justify-center"
//           onPress={() => setRecordar(!recordar)}
//           accessibilityLabel="Recordarme"
//         >
//           <View
//             className={`w-5 h-5 rounded-md border-2 border-gray-500 mr-3 ${recordar ? "bg-[#6842FF]" : ""}`}
//           />
//           <Text className="text-white">Recordarme</Text>
//         </TouchableOpacity>

//         {/* Mensaje de error */}
//         {error ? (
//           <Text className="text-red-500 text-center">{error}</Text>
//         ) : null}

//         {/* Botón de login */}
//         <TouchableOpacity
//           className="bg-[#6842FF] rounded-lg items-center py-4"
//           onPress={handleLogin}
//           accessibilityLabel="Iniciar sesión"
//         >
//           <Text className="text-white text-lg font-bold">Iniciar sesión</Text>
//         </TouchableOpacity>

//         {/* Opción "Olvidaste tu contraseña" */}
//         <TouchableOpacity
//           activeOpacity={0.7}
//           accessibilityLabel="Olvidaste tu contraseña"
//         >
//           <Text className="text-[#6842FF] text-center">
//             ¿Olvidaste tu contraseña?
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {/* Sección de login social */}
//       <View className="flex-row items-center justify-around">
//         <View className="w-1/4 border-b border-gray-700" />
//         <Text className="text-gray-400 text-center">o continúa con</Text>
//         <View className="w-1/4 border-b border-gray-700" />
//       </View>

//       <View className="flex-row items-center justify-around px-10">
//         <TouchableOpacity
//           className="items-center w-16 h-12 bg-gray-800 p-3 rounded-lg"
//           accessibilityLabel="Iniciar sesión con Facebook"
//         >
//           <FontAwesome name="facebook" size={24} color="#1877F2" />
//         </TouchableOpacity>
//         <TouchableOpacity
//           className="items-center w-16 h-12 bg-gray-800 p-3 rounded-lg"
//           accessibilityLabel="Iniciar sesión con Google"
//         >
//           <FontAwesome name="google" size={24} color="#DB4437" />
//         </TouchableOpacity>
//         <TouchableOpacity
//           className="items-center w-16 h-12 bg-gray-800 p-3 rounded-lg"
//           accessibilityLabel="Iniciar sesión con Apple"
//         >
//           <FontAwesome name="apple" size={24} color="#FFF" />
//         </TouchableOpacity>
//       </View>

//       <View className="flex-row items-center justify-center">
//         <Text className="text-gray-400 text-center">
//           ¿No tienes una cuenta?
//         </Text>
//         <TouchableOpacity
//           activeOpacity={0.7}
//           onPress={() => router.push("/(usuario)/register")}
//           accessibilityLabel="Registrarse"
//         >
//           <Text className="ml-2 text-[#6842FF] font-bold">Regístrate</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

import React, { useState, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useUser } from "@/context/UsersContext";

import { useOAuth } from "@clerk/clerk-expo";
import { useCombinedUser } from "@/hooks/useCombinedUser";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useUser();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recordar, setRecordar] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = useCallback(async () => {
    try {
      await login(email, password);
      router.push("/(dashboard)");
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Error en la conexión");
    }
  }, [email, password, login, router]);

  // Función para iniciar el flujo OAuth de Google con Clerk
  const handleGoogleLogin = useCallback(async () => {
    try {
      const result = await startOAuthFlow();
      // Si se creó una sesión, la activamos y redirigimos
      if (result.createdSessionId && result.setActive) {
        await result.setActive({ session: result.createdSessionId });
        router.push("/(dashboard)");
      }
    } catch (error) {
      console.error("Error en Google OAuth:", error);
      setError("Error en autenticación con Google");
    }
  }, [startOAuthFlow, router]);

  return (
    <View className="flex-col w-full h-full justify-around bg-[#121212] px-8">
      <Text className="text-4xl text-white font-bold mt-12 mb-2">
        Ingresa con tu cuenta
      </Text>

      <View className="flex-col space-y-6">
        {/* Input de correo */}
        <View className="flex-row items-center bg-gray-800 rounded-lg px-4">
          <MaterialIcons name="email" size={20} color="#888" />
          <TextInput
            className="flex-1 text-white h-12 ml-2"
            placeholder="Correo electrónico"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            accessibilityLabel="Correo electrónico"
          />
        </View>

        {/* Input de contraseña con toggle de visibilidad */}
        <View className="flex-row items-center bg-gray-800 rounded-lg px-4">
          <MaterialIcons name="lock" size={20} color="#888" />
          <TextInput
            className="flex-1 text-white h-12 ml-2"
            placeholder="Contraseña"
            placeholderTextColor="#888"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            accessibilityLabel="Contraseña"
          />
          <TouchableOpacity
            onPress={() => setShowPassword((prev) => !prev)}
            accessibilityLabel={
              showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
            }
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialIcons
              name={showPassword ? "visibility" : "visibility-off"}
              size={20}
              color="#888"
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>
        </View>

        {/* Opción "Recordarme" */}
        <TouchableOpacity
          className="flex-row items-center justify-center"
          onPress={() => setRecordar(!recordar)}
          accessibilityLabel="Recordarme"
        >
          <View
            className={`w-5 h-5 rounded-md border-2 border-gray-500 mr-3 ${
              recordar ? "bg-[#6842FF]" : ""
            }`}
          />
          <Text className="text-white">Recordarme</Text>
        </TouchableOpacity>

        {/* Mensaje de error */}
        {error ? (
          <Text className="text-red-500 text-center">{error}</Text>
        ) : null}

        {/* Botón de login con email/password */}
        <TouchableOpacity
          className="bg-[#6842FF] rounded-lg items-center py-4"
          onPress={handleLogin}
          accessibilityLabel="Iniciar sesión"
        >
          <Text className="text-white text-lg font-bold">Iniciar sesión</Text>
        </TouchableOpacity>
      </View>

      {/* Sección de login social */}
      <View className="flex-row items-center justify-around">
        <View className="w-1/4 border-b border-gray-700" />
        <Text className="text-gray-400 text-center">o continúa con</Text>
        <View className="w-1/4 border-b border-gray-700" />
      </View>

      <View className="flex-row items-center justify-around px-10">
        <TouchableOpacity
          className="items-center w-16 h-12 bg-gray-800 p-3 rounded-lg"
          accessibilityLabel="Iniciar sesión con Facebook"
        >
          <FontAwesome name="facebook" size={24} color="#1877F2" />
        </TouchableOpacity>
        <TouchableOpacity
          className="items-center w-16 h-12 bg-gray-800 p-3 rounded-lg"
          onPress={handleGoogleLogin}
          accessibilityLabel="Iniciar sesión con Google"
        >
          <FontAwesome name="google" size={24} color="#DB4437" />
        </TouchableOpacity>
        <TouchableOpacity
          className="items-center w-16 h-12 bg-gray-800 p-3 rounded-lg"
          accessibilityLabel="Iniciar sesión con Apple"
        >
          <FontAwesome name="apple" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center justify-center">
        <Text className="text-gray-400 text-center">
          ¿No tienes una cuenta?
        </Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push("/(usuario)/register")}
          accessibilityLabel="Registrarse"
        >
          <Text className="ml-2 text-[#6842FF] font-bold">Regístrate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
