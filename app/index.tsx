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
