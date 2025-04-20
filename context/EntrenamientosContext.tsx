// app/context/WorkoutsContext.tsx
import React, { createContext, useState, useEffect, useCallback } from "react";
// Importar axiosInstance y quitar API_URL
import axiosInstance from "../api/axiosInstance";
// import { API_URL } from "@/env";

import type { IEjercicio } from "./EjerciciosContext";

interface IDataEjercicio {
  ejercicioId: IEjercicio;
  tiempo: number;
}
export interface IEntrenamiento {
  _id: string;
  nombre: string;
  nivel: string;
  ejercicios: IDataEjercicio[];
  imagen: string;
  tiempoTotal: number;
  calorias: number;
  grupo: string;
  descripcion: string;
}

interface EntrenamientosContextValue {
  entrenamientos: IEntrenamiento[];
  selectedEntrenamiento: IEntrenamiento | null;
  setSelectedEntrenamiento: (e: IEntrenamiento | null) => void;
  fetchEntrenamientoById: (id: string) => Promise<IEntrenamiento | null>;
}

const EntrenamientosContext = createContext<
  EntrenamientosContextValue | undefined
>(undefined);

export function EntrenamientosProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [entrenamientos, setEntrenamientos] = useState<IEntrenamiento[]>([]);
  const [selectedEntrenamiento, setSelectedEntrenamiento] =
    useState<IEntrenamiento | null>(null);

  // Obtener lista de entrenamientos usando axiosInstance
  const fetchEntrenamientos = useCallback(async () => {
    try {
      // Usar axiosInstance.get con el endpoint relativo
      const response = await axiosInstance.get("/entrenamientos");
      // Acceder a los datos directamente desde response.data
      setEntrenamientos(response.data);
    } catch (err: any) {
      // Manejo de errores de Axios
      console.error(
        "Error fetching workouts (Axios):",
        err.response?.data || err.message,
      );
    }
  }, []);

  // Obtener un entrenamiento por su ID usando axiosInstance
  const fetchEntrenamientoById = useCallback(
    async (entrenamientoId: string): Promise<IEntrenamiento | null> => {
      try {
        // Usar axiosInstance.get con el endpoint relativo y el ID
        const response = await axiosInstance.get(
          `/entrenamientos/${entrenamientoId}`,
        );
        // Retornar los datos directamente desde response.data
        return response.data;
      } catch (err: any) {
        // Manejo de errores de Axios
        console.error(
          `Error fetching workout ${entrenamientoId} (Axios):`,
          err.response?.data || err.message,
        );
        return null;
      }
    },
    [],
  );

  useEffect(() => {
    fetchEntrenamientos();
  }, [fetchEntrenamientos]);

  return (
    <EntrenamientosContext.Provider
      value={{
        entrenamientos,
        selectedEntrenamiento,
        setSelectedEntrenamiento,
        fetchEntrenamientoById,
      }}
    >
      {children}
    </EntrenamientosContext.Provider>
  );
}

export const useEntrenamientos = () => {
  const context = React.useContext(EntrenamientosContext);
  if (context === undefined) {
    throw new Error(
      "useEntrenamientos must be used within a EntrenamientosProvider",
    );
  }
  return context;
};

export default EntrenamientosProvider;
