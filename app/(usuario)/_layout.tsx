// app/(usuario)/_layout.tsx

import { Stack } from "expo-router";

export default function UsuarioLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="notificaciones" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="informacion" options={{ headerShown: false }} />
      <Stack.Screen name="editarPerfil" options={{ headerShown: false }} />
      <Stack.Screen name="logros" options={{ headerShown: false }} />
    </Stack>
  );
}
