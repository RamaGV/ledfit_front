import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Obtener la URL base de la API (Ajusta esto según tu configuración)
// Puedes usar variables de entorno o un archivo de configuración
const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.220:5000"; // Cambiar IP aquí

console.log("Configuring Axios instance with baseURL:", API_URL);

const axiosInstance = axios.create({
  baseURL: `${API_URL}/api`, // Añadir /api si tus rutas backend empiezan ahí
  timeout: 10000, // Timeout de 10 segundos
  headers: {
    "Content-Type": "application/json",
  },
});

// --- Interceptor de Peticiones SIMPLIFICADO ---
axiosInstance.interceptors.request.use(
  async (config) => {
    console.log(
      `Axios Request Interceptor (Simple): Preparing ${config.method?.toUpperCase()} request to ${config.url}`,
    );
    try {
      // Intentar obtener el token SIEMPRE desde AsyncStorage
      const token = await AsyncStorage.getItem("@token");
      if (token) {
        console.log("Adding token from AsyncStorage to Authorization header.");
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        // Opcional: ¿Qué hacer si no hay token?
        // Depende de si la ruta requiere autenticación.
        // Dejar sin cabecera si no hay token.
        console.log(
          "No token found in AsyncStorage, sending request without Authorization header.",
        );
        // Asegurarse de que no quede una cabecera vieja
        delete config.headers.Authorization;
      }
    } catch (error) {
      // Error al leer AsyncStorage (raro pero posible)
      console.error(
        "Error reading token from AsyncStorage in interceptor:",
        error,
      );
      // Enviar petición sin token si falla la lectura
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => {
    console.error("Error in Axios request interceptor setup:", error);
    return Promise.reject(error);
  },
);

// --- Interceptor de Respuestas (Opcional) ---
// Se ejecuta cuando se recibe una respuesta
axiosInstance.interceptors.response.use(
  (response) => {
    // Cualquier código de estado que esté dentro del rango de 2xx causa la ejecución de esta función
    // Hacer algo con los datos de la respuesta
    console.log(
      `Axios Response Interceptor: Received ${response.status} for ${response.config.url}`,
    );
    return response;
  },
  (error) => {
    // Cualquier código de estado fuera del rango de 2xx causa la ejecución de esta función
    // Hacer algo con el error de la respuesta
    console.error(
      "Error in Axios response interceptor:",
      error.response?.status,
      error.message,
    );
    // Podrías manejar errores 401 (Unauthorized) aquí globalmente si quisieras
    // if (error.response && error.response.status === 401) {
    //   // Ej: Desloguear al usuario, intentar refrescar token, etc.
    // }
    return Promise.reject(error);
  },
);

export default axiosInstance;
