// app/context/UserContext.tsx

import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Quitar API_URL de aquí si se usa baseURL en axiosInstance
// import { API_URL } from "../env";
import { useAuth } from "@clerk/clerk-expo";
// Importar la instancia de Axios
import axiosInstance from "../api/axiosInstance";

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
  boardId?: string;
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  oauthSignIn: (userData: {
    name: string;
    email: string;
    oauthProvider: string;
    oauthId: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  addFav: (entrenamientoId: string) => Promise<void>;
  removeFav: (entrenamientoId: string) => Promise<void>;
  updateMetricas: (tiempo: number, calorias: number) => Promise<void>;
  updateLogros: () => Promise<void>;
  updateUserProfile: (userData: {
    name?: string;
    email?: string;
    profileImage?: string;
  }) => Promise<void>;
  updatePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  // Quitar getToken de aquí si axiosInstance lo maneja
  const { signOut /*, getToken*/ } = useAuth();

  // Rehidratar el usuario desde AsyncStorage al montar
  useEffect(() => {
    const loadUserFromStorage = async () => {
      setLoadingUser(true); // Iniciar carga
      try {
        const storedUser = await AsyncStorage.getItem("@user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log("Usuario cargado desde AsyncStorage:", parsedUser.email);
          setUser(parsedUser);
          // Opcional: Verificar token con el backend al inicio
          // try {
          //    await axiosInstance.get("/auth/verify"); // axiosInstance ya incluye el token
          //    console.log("Token verificado con el backend.");
          // } catch (verifyError: any) {
          //    console.warn("Fallo al verificar token con backend, limpiando:", verifyError.message);
          //    await AsyncStorage.removeItem("@token");
          //    await AsyncStorage.removeItem("@user");
          //    setUser(null);
          //    // Considerar llamar a signOut() de Clerk también?
          // }
        } else {
          console.log("No hay usuario en AsyncStorage.");
          // Si no hay usuario local, no necesitamos verificar token
        }
      } catch (error) {
        console.error("Error cargando usuario desde AsyncStorage:", error);
        // Limpiar por si acaso
        await AsyncStorage.removeItem("@token");
        await AsyncStorage.removeItem("@user");
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    };

    loadUserFromStorage();
  }, []); // Ejecutar solo al montar

  // --- Métodos Refactorizados con Axios ---

  const login = async (email: string, password: string) => {
    // Login tradicional probablemente no necesite el interceptor de token,
    // pero usamos axiosInstance por consistencia.
    try {
      // La URL base ya está en axiosInstance, solo necesitamos el endpoint
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      // Axios maneja el JSON automáticamente, accedemos a data
      const data = response.data;

      // Guardar token y usuario (el token viene en la respuesta del login)
      if (data.token && data.user) {
        await AsyncStorage.setItem("@token", data.token);
        await AsyncStorage.setItem("@user", JSON.stringify(data.user));
        setUser(data.user);
      } else {
        throw new Error("Respuesta inválida del servidor de login");
      }
    } catch (e: any) {
      console.error("Error en login (Axios):", e.response?.data || e.message);
      throw new Error(
        e.response?.data?.message || e.message || "Error en el login",
      );
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await axiosInstance.post("/auth/register", {
        name,
        email,
        password,
      });
      const data = response.data;

      if (data.token && data.user) {
        await AsyncStorage.setItem("@token", data.token);
        await AsyncStorage.setItem("@user", JSON.stringify(data.user));
        setUser(data.user);
      } else {
        throw new Error("Respuesta inválida del servidor de registro");
      }
    } catch (e: any) {
      console.error(
        "Error en registro (Axios):",
        e.response?.data || e.message,
      );
      throw new Error(
        e.response?.data?.message || e.message || "Error en el registro",
      );
    }
  };

  const oauthSignIn = async (userData: {
    name: string;
    email: string;
    oauthProvider: string;
    oauthId: string;
  }) => {
    try {
      setLoadingUser(true);
      console.log(
        "Iniciando proceso OAuth (Axios) con:",
        userData.oauthProvider,
      );

      const response = await axiosInstance.post("/auth/oauth", userData);
      const data = response.data;

      if (!data.token || !data.user) {
        console.error("Respuesta incompleta del servidor OAuth");
        throw new Error("Datos de usuario o token inválidos desde OAuth");
      }

      await AsyncStorage.setItem("@token", data.token);
      await AsyncStorage.setItem("@user", JSON.stringify(data.user));
      setUser(data.user);

      // No necesitamos retornar data si no se usa externamente
    } catch (error: any) {
      console.error(
        "Error en oauthSignIn (Axios):",
        error.response?.data || error.message,
      );
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Error en el registro con OAuth",
      );
    } finally {
      setLoadingUser(false);
    }
  };

  const logout = async () => {
    console.log("Iniciando logout...");
    setUser(null); // Limpiar estado local primero
    await AsyncStorage.removeItem("@token");
    await AsyncStorage.removeItem("@user");
    console.log("Datos locales eliminados.");

    // Cerrar sesión en Clerk (importante)
    try {
      await signOut();
      console.log("Sesión cerrada en Clerk.");
    } catch (error) {
      console.error("Error al cerrar sesión en Clerk:", error);
      // Continuar aunque falle Clerk
    }
    console.log("Logout completado.");
  };

  const addFav = async (entrenamientoId: string) => {
    // axiosInstance se encargará del token
    try {
      const response = await axiosInstance.post(
        `/auth/favs/agregar/${entrenamientoId}`,
      );
      const data = response.data;
      if (user && data.favs) {
        // Verificar que data.favs exista
        setUser({ ...user, favs: data.favs.map((id: any) => id.toString()) });
        // Actualizar AsyncStorage también? O confiar en recarga?
        const updatedUser = {
          ...user,
          favs: data.favs.map((id: any) => id.toString()),
        };
        await AsyncStorage.setItem("@user", JSON.stringify(updatedUser));
      }
    } catch (e: any) {
      console.error("Error en addFav (Axios):", e.response?.data || e.message);
      // No relanzar error, quizás solo mostrar un toast?
    }
  };

  const removeFav = async (entrenamientoId: string) => {
    // axiosInstance se encargará del token
    try {
      const response = await axiosInstance.delete(
        `/auth/favs/eliminar/${entrenamientoId}`,
      );
      const data = response.data;
      if (user && data.favs) {
        setUser({ ...user, favs: data.favs.map((id: any) => id.toString()) });
        const updatedUser = {
          ...user,
          favs: data.favs.map((id: any) => id.toString()),
        };
        await AsyncStorage.setItem("@user", JSON.stringify(updatedUser));
      }
    } catch (error: any) {
      console.error(
        "Error en removeFav (Axios):",
        error.response?.data || error.message,
      );
    }
  };

  const updateMetricas = async (
    tiempo: number,
    calorias: number,
  ): Promise<void> => {
    // axiosInstance se encargará del token
    try {
      const response = await axiosInstance.patch("/auth/update-metricas", {
        tiempo,
        calorias,
      });
      const data = response.data;
      if (user) {
        const updatedUser = {
          ...user,
          tiempoEntrenado: data.tiempoEntrenado,
          caloriasQuemadas: data.caloriasQuemadas,
          entrenamientosCompletos: data.entrenamientosCompletos,
        };
        setUser(updatedUser);
        await AsyncStorage.setItem("@user", JSON.stringify(updatedUser));
      }
    } catch (error: any) {
      console.error(
        "Error updating metrics (Axios):",
        error.response?.data || error.message,
      );
      // Podríamos lanzar el error para que el componente que llama lo maneje
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Error actualizando métricas",
      );
    }
  };

  const updateLogros = async (): Promise<void> => {
    // axiosInstance se encargará del token
    try {
      const response = await axiosInstance.patch("/auth/update-logros");
      const data = response.data;

      if (user && data.logros) {
        // Asegurarse que data.logros existe
        const updatedUser = {
          ...user,
          logros: data.logros,
        };
        setUser(updatedUser);
        await AsyncStorage.setItem("@user", JSON.stringify(updatedUser));
      }
    } catch (error: any) {
      console.error(
        "Error updating logros (Axios):",
        error.response?.data || error.message,
      );
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Error actualizando logros",
      );
    }
  };

  const updateUserProfile = async (userData: {
    name?: string;
    email?: string;
    profileImage?: string;
  }): Promise<void> => {
    // axiosInstance se encargará del token
    try {
      const response = await axiosInstance.patch(
        "/auth/update-profile",
        userData,
      );
      const data = response.data;
      if (user) {
        const updatedUser = {
          ...user,
          name: data.name || user.name,
          email: data.email || user.email,
          // profileImage: data.profileImage || user.profileImage, // Si se devuelve y maneja
        };
        setUser(updatedUser);
        await AsyncStorage.setItem("@user", JSON.stringify(updatedUser));
      }
    } catch (error: any) {
      console.error(
        "Error updating profile (Axios):",
        error.response?.data || error.message,
      );
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Error actualizando perfil",
      );
    }
  };

  const updatePassword = async (
    currentPassword: string,
    newPassword: string,
  ): Promise<void> => {
    // axiosInstance se encargará del token
    try {
      // No esperamos datos en la respuesta, solo verificamos que no haya error
      await axiosInstance.patch("/auth/update-password", {
        currentPassword,
        newPassword,
      });
      // Si llega aquí, fue exitoso
      console.log("Contraseña actualizada exitosamente (Axios).");
    } catch (error: any) {
      console.error(
        "Error updating password (Axios):",
        error.response?.data || error.message,
      );
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Error actualizando contraseña",
      );
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        login,
        register,
        oauthSignIn,
        logout,
        addFav,
        removeFav,
        updateMetricas,
        updateLogros,
        updateUserProfile,
        updatePassword,
      }}
    >
      {!loadingUser && children}{" "}
      {/* Renderizar children solo cuando no esté cargando */}
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

// Helper para verificar si hay un usuario autenticado (puede seguir igual)
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    // Podríamos confiar en el estado 'user' o verificar AsyncStorage
    const token = await AsyncStorage.getItem("@token");
    return !!token;
  } catch (error) {
    console.error("Error verificando autenticación:", error);
    return false;
  }
};

export default UserContext;
