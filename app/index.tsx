// app/index.tsx

import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";

import Test from "./test";

export default function RootIndex() {
  const router = useRouter();

  useEffect(() => {
    const user = true;
    // Esperar un frame antes de navegar
    requestAnimationFrame(() => {
      router.replace("/(usuario)/login");
    });
  }, [router]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#121212",
      }}
    >
      <Test />
      {/* <ActivityIndicator color="#7B61FF" size="large" /> */}
    </View>
  );
}
