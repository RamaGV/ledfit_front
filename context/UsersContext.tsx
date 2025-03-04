// app/context/UserContext.tsx

import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@/env"; // Importa la variable de entorno

export interface Logro {
  key: string;
  title: string;
  content: string;
  type: "check" | "plus" | "time";
  obtenido: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  token?: string;
  favs: string[];
  entrenamientosCompletos: number;
  caloriasQuemadas: number;
  tiempoEntrenado: number;
  logros: Logro[];
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  addFav: (entrenamientoId: string) => Promise<void>;
  removeFav: (entrenamientoId: string) => Promise<void>;
  updateMetricas: (tiempo: number, calorias: number) => Promise<void>;
  updateLogros: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Rehidratar el usuario desde AsyncStorage al montar
  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        const token = await AsyncStorage.getItem("@token");
        if (token) {
          const storedUser = await AsyncStorage.getItem("@user");
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
          }
        }
      } catch (error) {
        console.error("Error leyendo AsyncStorage:", error);
      } finally {
        setLoadingUser(false);
      }
    };

    loadUserFromStorage();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error en el login");
      }
      const data = await response.json();
      // Guarda el token y la información del usuario en AsyncStorage
      await AsyncStorage.setItem("@token", data.token);
      await AsyncStorage.setItem("@user", JSON.stringify(data.user));
      setUser(data.user);
    } catch (e) {
      throw e;
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("@token");
    await AsyncStorage.removeItem("@user");
    setUser(null);
  };

  const addFav = async (entrenamientoId: string) => {
    try {
      const token = await AsyncStorage.getItem("@token");
      if (!token) throw new Error("No token found");
      const response = await fetch(
        `${API_URL}/api/auth/favs/agregar/${entrenamientoId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await response.json();
      if (user) {
        setUser({ ...user, favs: data.favs.map((id: any) => id.toString()) });
      }
    } catch (e) {
      console.error("Error en addFav:", e);
      throw e;
    }
  };

  const removeFav = async (entrenamientoId: string) => {
    try {
      const token = await AsyncStorage.getItem("@token");
      if (!token) throw new Error("No token found");
      const response = await fetch(
        `${API_URL}/api/auth/favs/eliminar/${entrenamientoId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al eliminar de favoritos");
      }
      const data = await response.json();
      if (user) {
        setUser({ ...user, favs: data.favs.map((id: any) => id.toString()) });
      }
    } catch (error) {
      console.error("Error en removeFav:", error);
    }
  };

  const updateMetricas = async (
    tiempo: number,
    calorias: number,
  ): Promise<void> => {
    try {
      const token = await AsyncStorage.getItem("@token");
      if (!token) throw new Error("No token found");

      const response = await fetch(`${API_URL}/api/auth/update-metricas`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tiempo, calorias }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error actualizando metricas");
      }

      const data = await response.json();
      if (user) {
        setUser({
          ...user,
          tiempoEntrenado: data.tiempoEntrenado,
          caloriasQuemadas: data.caloriasQuemadas,
          entrenamientosCompletos: data.entrenamientosCompletos,
        });
      }
    } catch (error) {
      console.error("Error updating metrics:", error);
      throw error;
    }
  };

  const updateLogros = async (): Promise<void> => {
    try {
      const token = await AsyncStorage.getItem("@token");
      if (!token) throw new Error("No token found");

      const response = await fetch(`${API_URL}/api/auth/update-logros`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const text = await response.text();
      console.log("Respuesta de update-logros:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error("La respuesta no es JSON válido: " + text + e);
      }

      if (!response.ok) {
        throw new Error(data.message || "Error actualizando logros");
      }

      if (user) {
        setUser({
          ...user,
          logros: data.logros,
        });
      }
    } catch (error) {
      console.error("Error updating logros:", error);
      throw error;
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        addFav,
        removeFav,
        updateMetricas,
        updateLogros,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe ser usado dentro de un UserProvider");
  }
  return context;
};

export default UserContext;
