// // app/index.tsx

// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useRouter } from "expo-router";
// import { useEffect, useState } from "react";

// export default function RootIndex() {
//   const router = useRouter();

//   const [isLoggin, setIsLoggin] = useState(true);

//   useEffect(() => {
//     const checkSession = async () => {
//       try {
//         const token = await AsyncStorage.getItem("@token");
//         // Si existe token => estamos logueados => ir al dashboard
//         if (token) {
//           router.replace("/(dashboard)");
//         } else {
//           // Si no hay token => ir a login
//           router.replace("/(usuario)/login");
//         }
//       } catch (error) {
//         router.replace("/(usuario)/login");
//       } finally {
//         setIsLoggin(false);
//       }
//     };

//     checkSession();
//   }, [router]);

//   return <></>;
// }

// app/index.tsx
import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function RootIndex() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (isLoaded) {
      setTimeout(() => {
        if (isSignedIn) {
          router.replace("/(dashboard)");
        } else {
          router.replace("/(usuario)/login");
        }
      }, 0);
    }
  }, [isLoaded, isSignedIn, router]);

  return null;
}
