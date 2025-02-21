// app/context/UserContext.tsx

import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";


interface User {
  id: string;
  name: string;
  email: string;
  token?: string;
  favs: string[];
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  addFav: (entrenamientoId: string) => Promise<void>;
  removeFav: (entrenamientoId: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // >>> Al montar, revisamos el almacenamiento para re-hidratar el user <<<
  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        const token = await AsyncStorage.getItem("@token");
        if (token) {
          // Si hay token, intentamos leer el @user
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
      const response = await fetch("http://192.168.1.5:5000/api/auth/login", {
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
        `http://192.168.1.5:5000/api/auth/favs/agregar/${entrenamientoId}`,
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
      if (!token) {
        throw new Error("No token found");
      }
      const response = await fetch(
        `http://192.168.1.5:5000/api/auth/favs/eliminar/${entrenamientoId}`,
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
      // Actualizamos la propiedad favs del usuario
      if (user) {
        setUser({ ...user, favs: data.favs.map((id: any) => id.toString()) });
      }
    } catch (error) {
      console.error("Error en removeFav:", error);
    }
  };

  return (
    <UserContext.Provider
      value={{ user, setUser, login, logout, addFav, removeFav }}
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
