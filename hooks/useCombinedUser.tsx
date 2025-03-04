import { useUser as useClerkUser } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import { API_URL } from "@/env";

export function useCombinedUser() {
  const { user: clerkUser, isLoaded } = useClerkUser();
  const [backendUser, setBackendUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBackendUser() {
      if (isLoaded && clerkUser) {
        try {
          // Llama a tu endpoint que devuelve la información extra del usuario
          console.log("ID de Clerk:", clerkUser.id);
          console.log("User de Clerk:", clerkUser);
          const response = await fetch(`${API_URL}/api/auth/getUserProfile`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${clerkUser.id}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setBackendUser(data);
          } else {
            console.error(
              "Error al obtener datos del backend",
              response.statusText,
            );
          }
        } catch (error) {
          console.error("Error en fetchBackendUser:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
    fetchBackendUser();
  }, [isLoaded, clerkUser]);

  return { clerkUser, backendUser, loading };
}
