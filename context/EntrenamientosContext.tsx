// app/context/WorkoutsContext.tsx
import React, { createContext, useState, useEffect, useCallback } from "react";
import { API_URL } from "@/env"; // Asegúrate de que API_URL esté correctamente definido en tu .env y declarado en env.d.ts

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

  // Obtener lista de entrenamientos utilizando API_URL
  const fetchEntrenamientos = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/entrenamientos`);
      if (!response.ok) {
        throw new Error("ErrorWorkouts fetching workouts");
      }
      const data = await response.json();
      setEntrenamientos(data);
    } catch (err: any) {
      console.error("ErrorWorkouts fetching workouts:", err);
    }
  }, []);

  // Obtener un entrenamiento por su ID utilizando API_URL
  const fetchEntrenamientoById = useCallback(
    async (entrenamientoId: string) => {
      try {
        const response = await fetch(
          `${API_URL}/api/entrenamientos/${entrenamientoId}`,
        );
        if (!response.ok) {
          throw new Error("Error fetching entrenamientos");
        }
        const data = await response.json();
        return data;
      } catch (err: any) {
        console.error("Error fetching entrenamientos:", err);
        return null;
      }
    },
    [],
  );

  useEffect(() => {
    fetchEntrenamientos();
  }, []);

  return (
    <EntrenamientosContext.Provider
      value={
        {
          entrenamientos: entrenamientos,
          setSelectedEntrenamiento: setSelectedEntrenamiento,
          selectedEntrenamiento: selectedEntrenamiento,
          // Puedes incluir fetchEntrenamientoById en el contexto si lo necesitas
          fetchEntrenamientoById: fetchEntrenamientoById,
        } as any
      }
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
