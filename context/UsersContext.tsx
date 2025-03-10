// app/context/UserContext.tsx

import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@/env"; // Importa la variable de entorno
import { useAuth } from "@clerk/clerk-expo";

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
  register: (name: string, email: string, password: string) => Promise<void>;
  oauthSignIn: (userData: {name: string; email: string; oauthProvider: string; oauthId: string}) => Promise<void>;
  logout: () => Promise<void>;
  addFav: (entrenamientoId: string) => Promise<void>;
  removeFav: (entrenamientoId: string) => Promise<void>;
  updateMetricas: (tiempo: number, calorias: number) => Promise<void>;
  updateLogros: () => Promise<void>;
  updateUserProfile: (userData: {name?: string; email?: string; profileImage?: string}) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const { signOut, getToken } = useAuth(); // Añadimos el hook de Clerk para obtener getToken

  // Rehidratar el usuario desde AsyncStorage al montar
  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        const token = await AsyncStorage.getItem("@token");
        if (token) {
          console.log("Token encontrado en almacenamiento, intentando obtener usuario");
          
          // Si hay un token almacenado, primero intentamos verificar si es válido
          const response = await fetch(`${API_URL}/api/auth/verify`, {
            method: "GET",
            headers: { 
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json" 
            }
          });
          
          if (response.ok) {
            // Si el token es válido, obtenemos los datos del usuario desde el servidor
            console.log("Token válido, obteniendo datos de usuario desde el servidor");
            const data = await response.json();
            setUser(data.user);
          } else {
            // Si el token no es válido, lo eliminamos
            console.log("Token inválido, eliminando de almacenamiento");
            await AsyncStorage.removeItem("@token");
            await AsyncStorage.removeItem("@user");
            
            // Intentamos usar la sesión de Clerk como respaldo
            try {
              const clerkToken = await getToken();
              if (clerkToken) {
                console.log("Encontrada sesión de Clerk, intentando recuperar usuario");
                // Podríamos tener un endpoint para obtener el usuario por su ID de Clerk
                // o intentar volver a hacer login con OAuth
              }
            } catch (clerkError) {
              console.log("No se pudo recuperar sesión de Clerk:", clerkError);
            }
          }
        } else {
          console.log("No hay token en almacenamiento");
        }
      } catch (error) {
        console.error("Error cargando usuario:", error);
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

  // Método para el registro tradicional de usuarios
  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error en el registro");
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

  // Método para manejar el registro o login con proveedores OAuth (Google, Facebook, Apple)
  const oauthSignIn = async (userData: {name: string; email: string; oauthProvider: string; oauthId: string}) => {
    try {
      setLoadingUser(true);
      console.log('Iniciando proceso OAuth con:', userData.oauthProvider);
      
      const response = await fetch(`${API_URL}/api/auth/oauth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        console.error('Error en respuesta del servidor:', response.status);
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error en el registro con OAuth");
      }
      
      const data = await response.json();
      
      if (!data.token || !data.user) {
        console.error('Respuesta incompleta del servidor');
        throw new Error('Datos de usuario o token inválidos');
      }
      
      // Guardar token y datos de usuario
      await AsyncStorage.setItem("@token", data.token);
      await AsyncStorage.setItem("@user", JSON.stringify(data.user));
      
      // Actualizar estado
      setUser(data.user);
      
      return data;
    } catch (error) {
      console.error('Error en oauthSignIn:', error);
      throw error;
    } finally {
      setLoadingUser(false);
    }
  };

  const logout = async () => {
    // Limpiamos los tokens de nuestro backend
    await AsyncStorage.removeItem("@token");
    await AsyncStorage.removeItem("@user");
    setUser(null);
    
    // También cerramos sesión en Clerk
    try {
      await signOut();
      console.log('Sesión cerrada en Clerk y backend');
    } catch (error) {
      console.error('Error al cerrar sesión en Clerk:', error);
      // Continuamos con el logout aunque falle Clerk
    }
  };

  const addFav = async (entrenamientoId: string) => {
    try {
      // Verificar primero si hay un usuario autenticado
      if (!user) {
        console.warn('Intento de agregar favorito sin usuario autenticado');
        return; // Salir sin error para evitar crashes
      }
      
      const token = await AsyncStorage.getItem("@token");
      if (!token) {
        console.error('ERROR: No se encontró token en AsyncStorage al intentar usar addFav');
        throw new Error("No token found");
      }
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
      // Verificar primero si hay un usuario autenticado
      if (!user) {
        console.warn('Intento de eliminar favorito sin usuario autenticado');
        return; // Salir sin error para evitar crashes
      }
      
      const token = await AsyncStorage.getItem("@token");
      if (!token) {
        console.error('ERROR: No se encontró token en AsyncStorage al intentar usar removeFav');
        throw new Error("No token found");
      }
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
      // Verificar primero si hay un usuario autenticado
      if (!user) {
        console.warn('Intento de actualizar métricas sin usuario autenticado');
        return; // Salir sin error para evitar crashes
      }
      
      const token = await AsyncStorage.getItem("@token");
      if (!token) {
        console.error('ERROR: No se encontró token en AsyncStorage al intentar usar updateMetricas');
        throw new Error("No token found");
      }

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
      // Verificar primero si hay un usuario autenticado
      if (!user) {
        console.warn('Intento de actualizar logros sin usuario autenticado');
        return; // Salir sin error para evitar crashes
      }
      
      const token = await AsyncStorage.getItem("@token");
      if (!token) {
        console.error('ERROR: No se encontró token en AsyncStorage al intentar usar updateLogros');
        throw new Error("No token found");
      }

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

  const updateUserProfile = async (userData: {name?: string; email?: string; profileImage?: string}): Promise<void> => {
    try {
      // Verificar primero si hay un usuario autenticado
      if (!user) {
        console.warn('Intento de actualizar perfil sin usuario autenticado');
        return; // Salir sin error para evitar crashes
      }
      
      const token = await AsyncStorage.getItem("@token");
      if (!token) {
        console.error('ERROR: No se encontró token en AsyncStorage al intentar usar updateUserProfile');
        throw new Error("No token found");
      }

      const response = await fetch(`${API_URL}/api/auth/update-profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error actualizando perfil");
      }

      const data = await response.json();
      if (user) {
        const updatedUser = {
          ...user,
          name: data.name || user.name,
          email: data.email || user.email,
        };
        
        setUser(updatedUser);
        
        // Actualizar el storage
        await AsyncStorage.setItem("@user", JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    try {
      // Verificar primero si hay un usuario autenticado
      if (!user) {
        console.warn('Intento de actualizar contraseña sin usuario autenticado');
        return; // Salir sin error para evitar crashes
      }
      
      const token = await AsyncStorage.getItem("@token");
      if (!token) {
        console.error('ERROR: No se encontró token en AsyncStorage al intentar usar updatePassword');
        throw new Error("No token found");
      }

      const response = await fetch(`${API_URL}/api/auth/update-password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error actualizando contraseña");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      throw error;
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

// Helper para verificar si hay un usuario autenticado
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem("@token");
    return !!token; // Devuelve true si hay token, false si no hay
  } catch (error) {
    console.error("Error verificando autenticación:", error);
    return false;
  }
};

export default UserContext;
