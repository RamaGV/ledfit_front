import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme as useDeviceColorScheme } from "react-native";

// Paleta de colores para ambos temas
export type ThemeColors = {
  background: string;
  card: string;
  text: string;
  secondaryText: string;
  accent: string;
  border: string;
  shadow: string;
  navBackground: string;
  navText: string;
  navIcon: string;
};

// Definir el tipo para el contexto
type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
  colors: ThemeColors;
};

// Paletas de colores predefinidas
const darkTheme: ThemeColors = {
  background: "#121212",
  card: "#1E1E1E",
  text: "#FFFFFF",
  secondaryText: "#BBBBBB",
  accent: "#6842FF",
  border: "#333333",
  shadow: "rgba(0, 0, 0, 0.5)",
  navBackground: "#121212",
  navText: "#FFFFFF",
  navIcon: "#BBBBBB",
};

const lightTheme: ThemeColors = {
  background: "#EFEEE9", // Cambiado a un tono beige más suave
  card: "#F7F6F2", // Tono más suave para las tarjetas
  text: "#333333", // Texto más oscuro para mejor contraste
  secondaryText: "#666666",
  accent: "#6842FF", // Mantener el mismo acento
  border: "#D8D6D2", // Borde menos contrastante
  shadow: "rgba(0, 0, 0, 0.08)", // Sombra más sutil
  navBackground: "#EFEEE9",
  navText: "#333333",
  navIcon: "#555555",
};

// Crear el contexto
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Componente provider
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const deviceTheme = useDeviceColorScheme();
  // Por defecto usar el tema del dispositivo, si está en null o undefined usar dark
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    deviceTheme === "dark" || deviceTheme === null,
  );

  // Actualizar el tema cuando cambie el tema del dispositivo
  useEffect(() => {
    if (deviceTheme !== null) {
      setIsDarkMode(deviceTheme === "dark");
    }
  }, [deviceTheme]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Determinar qué paleta de colores usar
  const colors = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook personalizado para usar el tema
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
