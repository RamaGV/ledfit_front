// app/context/ExercisesContext.tsx

import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

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

  // Obtener la lista de ejercicios usando axiosInstance
  const fetchEjercicios = async () => {
    try {
      // Usar axiosInstance.get con el endpoint relativo
      const response = await axiosInstance.get("/ejercicios");
      setEjercicios(response.data);
    } catch (err: any) {
      // Manejo de errores de Axios
      console.error(
        "Error fetching exercises (Axios):",
        err.response?.data || err.message,
      );
    }
  };

  // Obtener un ejercicio por su ID usando axiosInstance
  const fetchEjercicioById = async (ejercicioId: string) => {
    try {
      // Usar axiosInstance.get con el endpoint relativo y el ID
      const response = await axiosInstance.get(`/ejercicios/${ejercicioId}`);
      return response.data;
    } catch (err: any) {
      // Manejo de errores de Axios
      console.error(
        `Error fetching exercise ${ejercicioId} (Axios):`,
        err.response?.data || err.message,
      );
      return null;
    }
  };

  useEffect(() => {
    fetchEjercicios();
  }, []); // Dejar dependencia vacía si solo se carga una vez al montar

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
