// app/index.tsx

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

export default function RootIndex() {
  const router = useRouter();

  const [isLoggin, setIsLoggin] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const token = await AsyncStorage.getItem("@token");
        // Si existe token => estamos logueados => ir al dashboard
        if (token) {
          router.replace("/(dashboard)");
        } else {
          // Si no hay token => ir a login
          router.replace("/(usuario)/login");
        }
      } catch (error) {
        console.log("Error leyendo AsyncStorage", error);
        router.replace("/(usuario)/login");
      } finally {
        setIsLoggin(false);
      }
    };

    checkSession();
  }, [router]);

  return <></>;
}
