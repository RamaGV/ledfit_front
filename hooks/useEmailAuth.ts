import { useState, useCallback } from "react";
import { useUser } from "../context/UsersContext";
import { useRouter } from "expo-router";

/**
 * Hook personalizado para manejar la autenticación con email y contraseña
 */
export function useEmailAuth() {
  const router = useRouter();
  const { login } = useUser();

  // Estados locales
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * Maneja el inicio de sesión con email y contraseña
   */
  const handleLogin = useCallback(async () => {
    if (!email || !password) {
      setError("Por favor completa todos los campos");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await login(email, password);
      router.push("/(dashboard)");
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Error en la conexión");
    } finally {
      setIsLoading(false);
    }
  }, [email, password, login, router]);

  /**
   * Actualiza la visibilidad de la contraseña
   */
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  /**
   * Actualiza el estado de "recordarme"
   */
  const toggleRemember = useCallback(() => {
    setRemember((prev) => !prev);
  }, []);

  return {
    // Estados
    email,
    setEmail,
    password,
    setPassword,
    remember,
    showPassword,
    isLoading,
    error,
    setError,

    // Acciones
    handleLogin,
    togglePasswordVisibility,
    toggleRemember,
  };
}
