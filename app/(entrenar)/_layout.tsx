// app/(entrenar)/_layout.tsx

import { Stack } from "expo-router";

export default function EntrenarLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="detallesDeEntrenamiento"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="ejercicios" options={{ headerShown: false }} />
      <Stack.Screen
        name="mis-entrenamientos"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
