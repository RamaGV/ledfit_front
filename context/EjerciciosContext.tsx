// app/context/ExercisesContext.tsx

import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/env"; // Importa la variable de entorno

export interface IEjercicio {
  _id: string;
  imagen: string;
  nombre: string;
  caloriasPorSegundo: number;
  grupo: string;
  descripcion: string;
}

interface EjerciciosContextProps {
  ejercicios: IEjercicio[];
  setEjercicios: (e: IEjercicio[]) => void;
  ejercicioActual: IEjercicio | null;
  setEjercicioActual: (e: IEjercicio | null) => void;
  fetchEjercicioById: (ejercicioId: string) => Promise<IEjercicio | null>;
}

const EjerciciosContext = createContext<EjerciciosContextProps | undefined>(
  undefined,
);

export const EjerciciosProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [ejercicios, setEjercicios] = useState<IEjercicio[]>([]);
  const [ejercicioActual, setEjercicioActual] = useState<IEjercicio | null>(
    null,
  );

  // Obtener la lista de ejercicios usando API_URL
  const fetchEjercicios = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/ejercicios`);
      setEjercicios(response.data);
    } catch (err: any) {
      console.error("Error fetching exercises:", err);
    }
  };

  // Obtener un ejercicio por su ID usando API_URL
  const fetchEjercicioById = async (ejercicioId: string) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/ejercicios/${ejercicioId}`,
      );
      return response.data;
    } catch (err: any) {
      console.error("Error fetching exercise:", err);
      return null;
    }
  };

  useEffect(() => {
    fetchEjercicios();
  }, []);

  return (
    <EjerciciosContext.Provider
      value={{
        ejercicios,
        setEjercicios,
        ejercicioActual,
        setEjercicioActual,
        fetchEjercicioById,
      }}
    >
      {children}
    </EjerciciosContext.Provider>
  );
};

export const useEjercicios = () => {
  const context = React.useContext(EjerciciosContext);
  if (!context) {
    throw new Error("useEjercicios must be used within a EjerciciosProvider");
  }
  return context;
};

export default EjerciciosContext;
